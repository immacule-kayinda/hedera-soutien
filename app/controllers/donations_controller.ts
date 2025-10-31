import type { HttpContext } from '@adonisjs/core/http'
import Donation from '#models/donation'
import DonationService from '#services/donation_service'
import User from '#models/user'

export default class DonationsController {
  /**
   * Créer un don
   */
  async store({ request, response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()

    const data = request.only([
      'beneficiaryId',
      'amount',
      'currency',
      'assistanceRequestId',
      'description',
    ])

    // Vérifier que le bénéficiaire existe
    const beneficiary = await User.findOrFail(data.beneficiaryId)
    if (beneficiary.role !== 'patient') {
      return response.status(400).json({ error: 'Le bénéficiaire doit être un patient' })
    }

    const donationService = new DonationService()

    try {
      const donation = await donationService.processDonation({
        donorId: user.id,
        beneficiaryId: data.beneficiaryId,
        amount: data.amount,
        currency: data.currency || 'EUR',
        assistanceRequestId: data.assistanceRequestId,
        description: data.description,
      })

      return response.status(201).json({
        message: 'Don effectué avec succès',
        donation: {
          id: donation.id,
          amount: donation.amount,
          currency: donation.currency,
          status: donation.status,
          hederaTransactionId: donation.hederaTransactionId,
          createdAt: donation.createdAt,
        },
      })
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * Liste des dons effectués par l'utilisateur
   */
  async myDonations({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    const donations = await Donation.query()
      .where('donorId', user.id)
      .preload('beneficiary', (query) => {
        query.select('id', 'firstName', 'lastName')
      })
      .orderBy('createdAt', 'desc')

    return response.json(donations)
  }

  /**
   * Liste des dons reçus par l'utilisateur
   */
  async receivedDonations({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    const donations = await Donation.query()
      .where('beneficiaryId', user.id)
      .preload('donor', (query) => {
        query.select('id', 'firstName', 'lastName')
      })
      .orderBy('createdAt', 'desc')

    return response.json(donations)
  }

  /**
   * Détails d'un don spécifique
   */
  async show({ params, auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const donation = await Donation.findOrFail(params.id)

    // Vérifier que l'utilisateur a accès à ce don
    if (donation.donorId !== user.id && donation.beneficiaryId !== user.id) {
      return response.status(403).json({ error: 'Accès non autorisé' })
    }

    await donation.load('donor', (query) => {
      query.select('id', 'firstName', 'lastName', 'hederaAccountId')
    })
    await donation.load('beneficiary', (query) => {
      query.select('id', 'firstName', 'lastName', 'hederaAccountId')
    })

    return response.json(donation)
  }
}
