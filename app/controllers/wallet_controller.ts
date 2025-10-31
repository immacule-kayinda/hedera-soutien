import type { HttpContext } from '@adonisjs/core/http'
import WalletService from '#services/wallet_service'

/**
 * Contrôleur pour la gestion des portefeuilles utilisateurs
 */
export default class WalletController {
  /**
   * Créer un wallet pour l'utilisateur connecté
   */
  async create({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()

      // Vérifier si l'utilisateur a déjà un wallet
      const walletService = new WalletService()
      const hasWallet = await walletService.hasWallet(user.id)

      if (hasWallet) {
        return response.status(400).json({
          error: 'Vous avez déjà un wallet Hedera',
        })
      }

      const wallet = await walletService.createWalletForUser(user.id)

      // Mettre à jour l'utilisateur dans la base de données
      user.hederaAccountId = wallet.accountId
      user.hederaPublicKey = wallet.publicKey
      user.hederaEncryptedPrivateKey = wallet.encryptedPrivateKey
      await user.save()

      return response.ok({
        message: 'Wallet créé avec succès',
        accountId: wallet.accountId,
        publicKey: wallet.publicKey,
      })
    } catch (error: any) {
      console.error('Erreur création wallet:', error)
      return response.status(500).json({
        error: error.message || 'Erreur lors de la création du wallet',
      })
    }
  }

  /**
   * Obtenir les informations du wallet de l'utilisateur connecté
   */
  async show({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const walletService = new WalletService()

      const wallet = await walletService.getUserWallet(user.id)

      if (!wallet) {
        return response.status(404).json({
          error: 'Aucun wallet trouvé pour cet utilisateur',
        })
      }

      return response.ok({
        accountId: wallet.accountId,
        publicKey: wallet.publicKey,
        balance: wallet.balance,
      })
    } catch (error: any) {
      console.error('Erreur récupération wallet:', error)
      return response.status(500).json({
        error: error.message || 'Erreur lors de la récupération du wallet',
      })
    }
  }

  /**
   * Obtenir le solde du wallet
   */
  async balance({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()

      if (!user.hederaAccountId) {
        return response.status(404).json({
          error: 'Aucun wallet trouvé pour cet utilisateur',
        })
      }

      const walletService = new WalletService()
      const balance = await walletService.getWalletBalance(user.hederaAccountId)

      return response.ok({
        accountId: user.hederaAccountId,
        balance,
      })
    } catch (error: any) {
      console.error('Erreur récupération solde:', error)
      return response.status(500).json({
        error: error.message || 'Erreur lors de la récupération du solde',
      })
    }
  }

  /**
   * Initialiser un wallet pour l'utilisateur (si non existant)
   */
  async initialize({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const walletService = new WalletService()

      const wallet = await walletService.initializeWalletForUser(user.id)

      return response.ok({
        message: 'Wallet initialisé avec succès',
        accountId: wallet.accountId,
        publicKey: wallet.publicKey,
      })
    } catch (error: any) {
      console.error('Erreur initialisation wallet:', error)
      return response.status(500).json({
        error: error.message || 'Erreur lors de l\'initialisation du wallet',
      })
    }
  }
}

