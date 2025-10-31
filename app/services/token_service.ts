import HederaService from './hedera_service.js'
import {
  TokenCreateTransaction,
  TokenMintTransaction,
  TokenAssociateTransaction,
  TokenTransferTransaction,
  AccountId,
  TokenId,
  Hbar,
  TokenType,
} from '@hashgraph/sdk'

/**
 * Service pour la gestion des tokens Hedera
 * Centralise toute la logique liée aux tokens
 */
export default class TokenService {
  private hederaService: HederaService

  constructor() {
    this.hederaService = new HederaService()
  }

  /**
   * Créer un nouveau token fungible
   */
  async createFungibleToken(options: {
    name: string
    symbol: string
    decimals?: number
    initialSupply?: number
    treasuryAccountId?: string
  }): Promise<{
    tokenId: string
    status: string
  }> {
    try {
      return await this.hederaService.createToken({
        name: options.name,
        symbol: options.symbol,
        decimals: options.decimals ?? 8,
        initialSupply: options.initialSupply ?? 0,
      })
    } catch (error) {
      console.error('Erreur création token fungible:', error)
      throw error
    }
  }

  /**
   * Créer un nouveau token non-fungible (NFT)
   */
  async createNFTCollection(options: { name: string; symbol: string }): Promise<{
    tokenId: string
    status: string
  }> {
    try {
      return await this.hederaService.createNFTCollection(options.name, options.symbol)
    } catch (error) {
      console.error('Erreur création collection NFT:', error)
      throw error
    }
  }

  /**
   * Mint des tokens fungibles
   */
  async mintTokens(
    tokenId: string,
    amount: number,
    recipientAccountId?: string
  ): Promise<{
    transactionId: string
    status: string
  }> {
    try {
      const client = this.hederaService.getClient()

      const transaction = await new TokenMintTransaction()
        .setTokenId(TokenId.fromString(tokenId))
        .setAmount(amount)
        .freezeWith(client)

      // En production, utiliser la clé privée du treasury depuis le service
      const signedTx = await transaction.sign(
        // Note: Cette approche nécessite d'exposer la clé du treasury depuis HederaService
        // ou de passer la clé en paramètre
        client.operatorPrivateKey!
      )
      const txResponse = await signedTx.execute(client)
      const receipt = await txResponse.getReceipt(client)

      return {
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
      }
    } catch (error) {
      console.error('Erreur mint tokens:', error)
      throw new Error(`Impossible de mint les tokens: ${error}`)
    }
  }

  /**
   * Mint un NFT avec métadonnées
   */
  async mintNFT(
    tokenId: string,
    recipientAccountId: string,
    metadata: string
  ): Promise<{
    serialNumber: number
    transactionId: string
  }> {
    try {
      return await this.hederaService.mintNFT(tokenId, recipientAccountId, metadata)
    } catch (error) {
      console.error('Erreur mint NFT:', error)
      throw error
    }
  }

  /**
   * Transférer des tokens fungibles
   */
  async transferTokens(options: {
    tokenId: string
    from: string
    to: string
    amount: number
  }): Promise<{
    transactionId: string
    status: string
  }> {
    try {
      const client = this.hederaService.getClient()

      const transaction = await new TokenTransferTransaction()
        .addTokenTransfer(
          TokenId.fromString(options.tokenId),
          AccountId.fromString(options.from),
          -options.amount
        )
        .addTokenTransfer(
          TokenId.fromString(options.tokenId),
          AccountId.fromString(options.to),
          options.amount
        )
        .freezeWith(client)

      // En production, signer avec la clé du compte source
      const signedTx = await transaction.sign(client.operatorPrivateKey!)
      const txResponse = await signedTx.execute(client)
      const receipt = await txResponse.getReceipt(client)

      return {
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
      }
    } catch (error) {
      console.error('Erreur transfert tokens:', error)
      throw new Error(`Impossible de transférer les tokens: ${error}`)
    }
  }

  /**
   * Associer un token à un compte
   */
  async associateTokenToAccount(
    accountId: string,
    tokenId: string
  ): Promise<{
    transactionId: string
    status: string
  }> {
    try {
      const client = this.hederaService.getClient()

      const transaction = await new TokenAssociateTransaction()
        .setAccountId(AccountId.fromString(accountId))
        .setTokenIds([TokenId.fromString(tokenId)])
        .freezeWith(client)

      // En production, signer avec la clé du compte utilisateur
      const signedTx = await transaction.sign(client.operatorPrivateKey!)
      const txResponse = await signedTx.execute(client)
      const receipt = await txResponse.getReceipt(client)

      return {
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
      }
    } catch (error) {
      console.error('Erreur association token:', error)
      throw new Error(`Impossible d'associer le token: ${error}`)
    }
  }
}
