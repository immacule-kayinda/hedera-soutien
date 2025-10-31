import HederaService from './hedera_service.js'
import User from '#models/user'
import CryptoJS from 'crypto-js'
import env from '#start/env'

/**
 * Service pour la gestion des portefeuilles utilisateurs
 * Gère la création, le stockage sécurisé et la récupération des wallets Hedera
 */
export default class WalletService {
  private hederaService: HederaService

  constructor() {
    this.hederaService = new HederaService()
  }

  /**
   * Créer un nouveau wallet pour un utilisateur
   */
  async createWalletForUser(userId: number): Promise<{
    accountId: string
    publicKey: string
    encryptedPrivateKey: string
  }> {
    try {
      // Créer le compte Hedera
      const wallet = await this.hederaService.createAccount()

      // Chiffrer la clé privée avant stockage
      const encryptedPrivateKey = this.hederaService.encryptPrivateKey(
        wallet.privateKey,
        userId
      )

      return {
        accountId: wallet.accountId,
        publicKey: wallet.publicKey,
        encryptedPrivateKey,
      }
    } catch (error) {
      console.error('Erreur création wallet utilisateur:', error)
      throw new Error(`Impossible de créer le wallet: ${error}`)
    }
  }

  /**
   * Récupérer les informations du wallet d'un utilisateur
   */
  async getUserWallet(userId: number): Promise<{
    accountId: string
    publicKey: string
    balance: number
  } | null> {
    try {
      const user = await User.find(userId)
      if (!user || !user.hederaAccountId) {
        return null
      }

      const balance = await this.hederaService.getAccountBalance(user.hederaAccountId)

      return {
        accountId: user.hederaAccountId,
        publicKey: user.hederaPublicKey || '',
        balance,
      }
    } catch (error) {
      console.error('Erreur récupération wallet utilisateur:', error)
      throw error
    }
  }

  /**
   * Obtenir le solde d'un wallet
   */
  async getWalletBalance(accountId: string): Promise<number> {
    try {
      return await this.hederaService.getAccountBalance(accountId)
    } catch (error) {
      console.error('Erreur récupération solde:', error)
      throw error
    }
  }

  /**
   * Chiffrer une clé privée pour stockage sécurisé
   */
  encryptPrivateKey(privateKey: string, userId: number): string {
    return this.hederaService.encryptPrivateKey(privateKey, userId)
  }

  /**
   * Déchiffrer une clé privée stockée
   */
  decryptPrivateKey(encryptedKey: string, userId: number): string {
    return this.hederaService.decryptPrivateKey(encryptedKey, userId)
  }

  /**
   * Vérifier si un utilisateur a un wallet Hedera
   */
  async hasWallet(userId: number): Promise<boolean> {
    try {
      const user = await User.find(userId)
      return !!(user && user.hederaAccountId)
    } catch (error) {
      console.error('Erreur vérification wallet:', error)
      return false
    }
  }

  /**
   * Initialiser un wallet pour un utilisateur existant
   * (si l'utilisateur n'a pas encore de wallet)
   */
  async initializeWalletForUser(userId: number): Promise<{
    accountId: string
    publicKey: string
  }> {
    try {
      const hasWallet = await this.hasWallet(userId)
      if (hasWallet) {
        const wallet = await this.getUserWallet(userId)
        if (wallet) {
          return {
            accountId: wallet.accountId,
            publicKey: wallet.publicKey,
          }
        }
      }

      // Créer un nouveau wallet
      const wallet = await this.createWalletForUser(userId)

      // Mettre à jour l'utilisateur dans la base de données
      const user = await User.findOrFail(userId)
      user.hederaAccountId = wallet.accountId
      user.hederaPublicKey = wallet.publicKey
      user.hederaEncryptedPrivateKey = wallet.encryptedPrivateKey
      await user.save()

      return {
        accountId: wallet.accountId,
        publicKey: wallet.publicKey,
      }
    } catch (error) {
      console.error('Erreur initialisation wallet:', error)
      throw new Error(`Impossible d'initialiser le wallet: ${error}`)
    }
  }
}

