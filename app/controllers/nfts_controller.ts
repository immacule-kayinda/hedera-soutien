import type { HttpContext } from '@adonisjs/core/http'
import NFTService from '#services/nft_service'
import Nft from '#models/nft'

export default class NFTsController {
  /**
   * Obtenir tous les NFTs de l'utilisateur connecté
   */
  async myNFTs({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    const nftService = new NFTService()
    const nfts = await nftService.getUserNFTs(user.id)

    return response.json(nfts)
  }

  /**
   * Détails d'un NFT spécifique
   */
  async show({ params, auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const nft = await Nft.findOrFail(params.id)

    // Vérifier que l'utilisateur possède ce NFT
    if (nft.ownerId !== user.id) {
      return response.status(403).json({ error: 'Vous ne possédez pas ce NFT' })
    }

    // Parser les métadonnées
    const metadata = JSON.parse(nft.metadata)

    return response.json({
      ...nft.serialize(),
      metadata: metadata,
    })
  }

  /**
   * Transférer un NFT à un autre utilisateur
   */
  async transfer({ params, request, response, auth }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { toUserId } = request.only(['toUserId'])

    const nftService = new NFTService()

    try {
      await nftService.transferNFT(Number(params.id), user.id, toUserId)

      return response.json({
        message: 'NFT transféré avec succès',
      })
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }
}

