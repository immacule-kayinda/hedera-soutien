import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import HederaService from '#services/hedera_service'

export default class UsersController {
  /**
   * Mettre à jour le profil utilisateur
   */
  async update({ request, response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()

    const data = request.only([
      'firstName',
      'lastName',
      'phone',
      'addressStreet',
      'addressCity',
      'addressPostalCode',
      'addressCountry',
      'disabilityType',
      'disabilityLevel',
      'equipmentNeeds',
      'mobility',
      'partnerType',
      'partnerMotifs',
    ])

    user.merge(data)
    await user.save()

    return response.json({
      message: 'Profil mis à jour',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    })
  }

  /**
   * Obtenir le solde Hedera de l'utilisateur
   */
  async getHederaBalance({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    if (!user.hederaAccountId) {
      return response.status(400).json({ error: 'Aucun wallet Hedera associé' })
    }

    const hederaService = new HederaService()

    try {
      const balance = await hederaService.getAccountBalance(user.hederaAccountId)

      return response.json({
        accountId: user.hederaAccountId,
        balance: balance,
        unit: 'HBAR',
      })
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * Statistiques de l'utilisateur
   */
  async stats({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    await user.load('donationsMade')
    await user.load('donationsReceived')
    await user.load('nfts')
    await user.load('assistanceRequests')

    return response.json({
      reputationScore: user.reputationScore,
      donationsCount: user.donationsCount,
      donationsTotal: user.donationsTotal,
      volunteerHours: user.volunteerHours,
      memberSince: user.memberSince,
      nftsCount: user.nfts.length,
      assistanceRequestsCount: user.assistanceRequests.length,
    })
  }
}
