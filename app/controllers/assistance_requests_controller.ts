import type { HttpContext } from '@adonisjs/core/http'
import AssistanceRequest from '#models/assistance_request'
import HederaService from '#services/hedera_service'
import env from '#start/env'

export default class AssistanceRequestsController {
  /**
   * Créer une demande d'aide
   */
  async store({ request, response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()

    if (user.role !== 'patient') {
      return response.status(403).json({ error: 'Seuls les patients peuvent créer des demandes' })
    }

    const data = request.only(['title', 'description', 'category', 'amountNeeded', 'urgency'])

    // Créer un topic Hedera pour le journal de transparence
    const hederaService = new HederaService()
    let topicId = null

    try {
      const topic = await hederaService.createConsensusTopic()
      topicId = topic.topicId
    } catch (error) {
      console.error('Erreur création topic:', error)
      // Continuer même si le topic n'est pas créé
    }

    const assistanceRequest = await AssistanceRequest.create({
      userId: user.id,
      title: data.title,
      description: data.description,
      category: data.category,
      amountNeeded: data.amountNeeded,
      amountRaised: 0,
      urgency: data.urgency || 'medium',
      status: 'open',
      hederaTopicId: topicId,
      supporters: JSON.stringify([]),
    })

    return response.status(201).json({
      message: 'Demande d aide créée',
      request: assistanceRequest,
    })
  }

  /**
   * Liste des demandes d'aide (avec filtres)
   */
  async index({ request, response }: HttpContext) {
    const q = AssistanceRequest.query()
      .preload('user', (query) => {
        query.select('id', 'firstName', 'lastName', 'addressCity')
      })
      .where('status', '!=', 'cancelled')

    // Filtres
    const category = request.input('category')
    const urgency = request.input('urgency')
    const city = request.input('city')
    const status = request.input('status')

    if (category) {
      q.where('category', category)
    }

    if (urgency) {
      q.where('urgency', urgency)
    }

    if (status) {
      q.where('status', status)
    }

    if (city) {
      q.whereHas('user', (subQuery) => {
        subQuery.where('addressCity', 'like', `%${city}%`)
      })
    }

    const requests = await q.orderBy('createdAt', 'desc')

    return response.json(requests)
  }

  /**
   * Détails d'une demande d'aide
   */
  async show({ params, response }: HttpContext) {
    const request = await AssistanceRequest.findOrFail(params.id)

    await request.load('user', (query) => {
      query.select('id', 'firstName', 'lastName', 'addressCity', 'disabilityType')
    })
    await request.load('donations', (query) => {
      query.preload('donor', (subQuery) => {
        subQuery.select('id', 'firstName', 'lastName')
      })
    })

    return response.json(request)
  }

  /**
   * Mes demandes d'aide (pour le patient)
   */
  async myRequests({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    const requests = await AssistanceRequest.query()
      .where('userId', user.id)
      .preload('donations')
      .orderBy('createdAt', 'desc')

    return response.json(requests)
  }

  /**
   * Mettre à jour une demande d'aide
   */
  async update({ params, request, response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()
    const assistanceRequest = await AssistanceRequest.findOrFail(params.id)

    if (assistanceRequest.userId !== user.id) {
      return response.status(403).json({ error: 'Accès non autorisé' })
    }

    const data = request.only(['title', 'description', 'urgency', 'status'])

    assistanceRequest.merge(data)
    await assistanceRequest.save()

    return response.json({
      message: 'Demande mise à jour',
      request: assistanceRequest,
    })
  }
}
