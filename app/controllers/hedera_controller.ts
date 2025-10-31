import type { HttpContext } from '@adonisjs/core/http'
import HederaService from '#services/hedera_service'

/**
 * Contrôleur pour les opérations Hedera
 * Interface API sécurisée pour toutes les opérations blockchain
 */
export default class HederaController {
  /**
   * Transférer des fonds HBAR
   */
  async transfer({ request, response }: HttpContext) {
    try {
      const data = request.only(['to', 'amount', 'memo'])

      // Validation
      if (!data.to || !data.amount) {
        return response.status(400).json({
          error: 'Les champs "to" et "amount" sont requis',
        })
      }

      if (typeof data.amount !== 'number' || data.amount <= 0) {
        return response.status(400).json({
          error: 'Le montant doit être un nombre positif',
        })
      }

      const hederaService = new HederaService()
      const result = await hederaService.transferFunds({
        to: data.to,
        amount: data.amount,
        memo: data.memo,
      })

      return response.ok({
        message: 'Transfert effectué avec succès',
        transactionId: result.transactionId,
        status: result.status,
      })
    } catch (error: any) {
      console.error('Erreur transfert Hedera:', error)
      return response.status(500).json({
        error: error.message || 'Erreur lors du transfert',
      })
    }
  }

  /**
   * Créer un nouveau compte Hedera
   */
  async createAccount({ response }: HttpContext) {
    try {
      const hederaService = new HederaService()
      const result = await hederaService.createAccount()

      return response.ok({
        message: 'Compte créé avec succès',
        accountId: result.accountId,
        publicKey: result.publicKey,
        // Note: La clé privée ne doit JAMAIS être renvoyée au client en production
        // Ici c'est pour les besoins de développement uniquement
        privateKey: result.privateKey,
      })
    } catch (error: any) {
      console.error('Erreur création compte Hedera:', error)
      return response.status(500).json({
        error: error.message || 'Erreur lors de la création du compte',
      })
    }
  }

  /**
   * Créer un token Hedera
   */
  async createToken({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'symbol', 'decimals', 'initialSupply'])

      const hederaService = new HederaService()
      const result = await hederaService.createToken({
        name: data.name,
        symbol: data.symbol,
        decimals: data.decimals ? Number(data.decimals) : undefined,
        initialSupply: data.initialSupply ? Number(data.initialSupply) : undefined,
      })

      return response.ok({
        message: 'Token créé avec succès',
        tokenId: result.tokenId,
        status: result.status,
      })
    } catch (error: any) {
      console.error('Erreur création token Hedera:', error)
      return response.status(500).json({
        error: error.message || 'Erreur lors de la création du token',
      })
    }
  }

  /**
   * Signer une transaction (pour usage avancé)
   */
  async signTransaction({ request, response }: HttpContext) {
    try {
      // Cette méthode est pour usage avancé uniquement
      // En production, la signature doit être gérée par le service
      return response.status(501).json({
        error: 'Cette fonctionnalité n\'est pas encore implémentée',
      })
    } catch (error: any) {
      console.error('Erreur signature transaction:', error)
      return response.status(500).json({
        error: error.message || 'Erreur lors de la signature',
      })
    }
  }
}

