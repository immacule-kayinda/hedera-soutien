import {
  Client,
  AccountId,
  PrivateKey,
  TransferTransaction,
  Hbar,
  TokenCreateTransaction,
  TokenMintTransaction,
  TokenAssociateTransaction,
  TokenType,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  AccountCreateTransaction,
  AccountBalanceQuery,
} from '@hashgraph/sdk'
import env from '#start/env'
import CryptoJS from 'crypto-js'

export default class HederaService {
  private client: Client
  private treasuryAccount: AccountId
  private treasuryKey: PrivateKey

  constructor() {
    // Initialiser le client Hedera
    this.client =
      env.get('HEDERA_NETWORK') === 'mainnet'
        ? Client.forMainnet()
        : Client.forTestnet()

    // Configuration du compte trésor (opérateur)
    this.treasuryAccount = AccountId.fromString(env.get('HEDERA_OPERATOR_ID'))
    this.treasuryKey = PrivateKey.fromString(env.get('HEDERA_OPERATOR_KEY'))

    // Configurer l'opérateur
    this.client.setOperator(this.treasuryAccount, this.treasuryKey)

    // Configurer les frais max
    this.client.setMaxTransactionFee(new Hbar(10))
    this.client.setMaxQueryPayment(new Hbar(1))
  }

  /**
   * Créer un nouveau wallet Hedera pour un utilisateur
   */
  async createUserWallet(): Promise<{
    accountId: string
    publicKey: string
    privateKey: string
  }> {
    try {
      // Générer une nouvelle paire de clés
      const privateKey = PrivateKey.generate()
      const publicKey = privateKey.publicKey

      // Créer le compte sur Hedera
      const transaction = await new AccountCreateTransaction()
        .setKey(publicKey)
        .setInitialBalance(new Hbar(1)) // 1 HBAR initial pour payer les frais
        .freezeWith(this.client)

      const signTx = await transaction.sign(this.treasuryKey)
      const txResponse = await signTx.execute(this.client)
      const receipt = await txResponse.getReceipt(this.client)

      const accountId = receipt.accountId!

      return {
        accountId: accountId.toString(),
        publicKey: publicKey.toString(),
        privateKey: privateKey.toString(),
      }
    } catch (error) {
      console.error('Erreur création wallet Hedera:', error)
      throw new Error(`Impossible de créer le wallet: ${error}`)
    }
  }

  /**
   * Chiffrer une clé privée pour stockage sécurisé
   */
  encryptPrivateKey(privateKey: string, userId: number): string {
    const encryptionKey = env.get('ENCRYPTION_KEY') + userId.toString()
    return CryptoJS.AES.encrypt(privateKey, encryptionKey).toString()
  }

  /**
   * Déchiffrer une clé privée
   */
  decryptPrivateKey(encryptedKey: string, userId: number): string {
    const encryptionKey = env.get('ENCRYPTION_KEY') + userId.toString()
    const bytes = CryptoJS.AES.decrypt(encryptedKey, encryptionKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  /**
   * Obtenir le solde d'un compte
   */
  async getAccountBalance(accountId: string): Promise<number> {
    try {
      const query = new AccountBalanceQuery().setAccountId(accountId)
      const balance = await query.execute(this.client)
      return balance.hbars.toTinybars().toNumber() / 100_000_000 // Convertir en HBAR
    } catch (error) {
      console.error('Erreur récupération solde:', error)
      throw error
    }
  }

  /**
   * Exécuter une transaction de don HBAR
   */
  async executeDonation(
    donorAccountId: string,
    beneficiaryAccountId: string,
    amountHbar: number,
    memo?: string
  ): Promise<{
    transactionId: string
    status: string
  }> {
    try {
      const amountTinybars = amountHbar * 100_000_000

      const transaction = await new TransferTransaction()
        .addHbarTransfer(
          AccountId.fromString(donorAccountId),
          new Hbar(-amountHbar)
        )
        .addHbarTransfer(
          AccountId.fromString(beneficiaryAccountId),
          new Hbar(amountHbar)
        )
        .setTransactionMemo(memo || `Don HederaSoutien: ${amountHbar} HBAR`)
        .freezeWith(this.client)

      // Signer avec la clé du donateur (si custodial)
      // Note: En production, il faudra récupérer et déchiffrer la clé du donateur
      const signedTx = await transaction.sign(this.treasuryKey) // Temporaire pour test
      const txResponse = await signedTx.execute(this.client)
      const receipt = await txResponse.getReceipt(this.client)

      return {
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
      }
    } catch (error) {
      console.error('Erreur transaction don:', error)
      throw new Error(`Erreur lors du don: ${error}`)
    }
  }

  /**
   * Créer une collection NFT
   */
  async createNFTCollection(
    name: string,
    symbol: string
  ): Promise<{ tokenId: string; status: string }> {
    try {
      const transaction = await new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setTreasuryAccountId(this.treasuryAccount)
        .setAdminKey(this.treasuryKey)
        .setSupplyKey(this.treasuryKey)
        .freezeWith(this.client)

      const signTx = await transaction.sign(this.treasuryKey)
      const submitTx = await signTx.execute(this.client)
      const receipt = await submitTx.getReceipt(this.client)

      return {
        tokenId: receipt.tokenId!.toString(),
        status: receipt.status.toString(),
      }
    } catch (error) {
      console.error('Erreur création collection NFT:', error)
      throw new Error(`Impossible de créer la collection: ${error}`)
    }
  }

  /**
   * Mint un NFT
   */
  async mintNFT(
    tokenId: string,
    recipientAccountId: string,
    metadata: string
  ): Promise<{ serialNumber: number; transactionId: string }> {
    try {
      // Convertir les métadonnées en bytes
      const metadataBytes = Buffer.from(metadata)

      // Mint le NFT
      const transaction = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .addMetadata(metadataBytes)
        .freezeWith(this.client)

      const signTx = await transaction.sign(this.treasuryKey)
      const submitTx = await signTx.execute(this.client)
      const receipt = await submitTx.getReceipt(this.client)

      // Associer le token au compte destinataire
      const associateTx = await new TokenAssociateTransaction()
        .setAccountId(recipientAccountId)
        .setTokenIds([tokenId])
        .freezeWith(this.client)

      // En production, signer avec la clé du destinataire
      const associateSignTx = await associateTx.sign(this.treasuryKey)
      await associateSignTx.execute(this.client)

      return {
        serialNumber: receipt.serials[0].toNumber(),
        transactionId: submitTx.transactionId.toString(),
      }
    } catch (error) {
      console.error('Erreur mint NFT:', error)
      throw new Error(`Impossible de créer le NFT: ${error}`)
    }
  }

  /**
   * Créer un topic pour le journal de consensus
   */
  async createConsensusTopic(): Promise<{ topicId: string; status: string }> {
    try {
      const transaction = await new TopicCreateTransaction()
        .setTopicMemo('HederaSoutien - Journal des événements')
        .freezeWith(this.client)

      const signTx = await transaction.sign(this.treasuryKey)
      const submitTx = await signTx.execute(this.client)
      const receipt = await submitTx.getReceipt(this.client)

      return {
        topicId: receipt.topicId!.toString(),
        status: receipt.status.toString(),
      }
    } catch (error) {
      console.error('Erreur création topic:', error)
      throw new Error(`Impossible de créer le topic: ${error}`)
    }
  }

  /**
   * Soumettre un message au journal de consensus
   */
  async submitConsensusMessage(
    topicId: string,
    message: string
  ): Promise<{ sequenceNumber: number; transactionId: string }> {
    try {
      const transaction = await new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(message)
        .freezeWith(this.client)

      const signTx = await transaction.sign(this.treasuryKey)
      const submitTx = await signTx.execute(this.client)
      const receipt = await submitTx.getReceipt(this.client)

      return {
        sequenceNumber: receipt.topicSequenceNumber!.toNumber(),
        transactionId: submitTx.transactionId.toString(),
      }
    } catch (error) {
      console.error('Erreur soumission message:', error)
      throw new Error(`Impossible de soumettre le message: ${error}`)
    }
  }

  /**
   * Obtenir le client Hedera (pour usage avancé)
   */
  getClient(): Client {
    return this.client
  }
}

