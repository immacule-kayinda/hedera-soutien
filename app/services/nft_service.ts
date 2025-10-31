import HederaService from './hedera_service.js'
import IPFSService from './ipfs_service.js'
import Nft from '#models/nft'
import User from '#models/user'
import env from '#start/env'

export default class NFTService {
  private hederaService: HederaService
  private ipfsService: IPFSService

  constructor() {
    this.hederaService = new HederaService()
    this.ipfsService = new IPFSService()
  }

  /**
   * Créer un badge NFT pour un donateur
   */
  async createDonorBadge(
    userId: number,
    donationData: {
      amount: number
      totalDonations: number
      helpedPeople: number
    }
  ): Promise<Nft> {
    // Déterminer le niveau de badge
    const badgeLevel = this.calculateBadgeLevel(donationData.totalDonations)

    // Créer les métadonnées
    const metadata = {
      name: `${this.getBadgeName(badgeLevel)} - HederaSoutien`,
      description: `Badge de reconnaissance pour ${donationData.totalDonations}€ de dons`,
      image: await this.ipfsService.uploadBadgeImage(badgeLevel),
      attributes: [
        {
          trait_type: 'Niveau',
          value: badgeLevel,
        },
        {
          trait_type: 'Montant Total Donné',
          value: donationData.totalDonations,
        },
        {
          trait_type: 'Personnes Aidées',
          value: donationData.helpedPeople,
        },
        {
          trait_type: "Date d'Obtention",
          value: new Date().toISOString(),
        },
      ],
      properties: {
        collection: 'HederaSoutien Donor Badges',
        utility: 'Accès aux fonctionnalités premium',
      },
    }

    // Upload metadata sur IPFS
    const ipfsHash = await this.ipfsService.uploadMetadata(metadata)

    // Mint sur Hedera
    const user = await User.findOrFail(userId)
    if (!user.hederaAccountId) {
      throw new Error('Utilisateur sans wallet Hedera')
    }

    const tokenId = env.get('NFT_COLLECTION_DONOR_BADGES')
    if (!tokenId) {
      throw new Error(
        "NFT_COLLECTION_DONOR_BADGES non configuré dans les variables d'environnement"
      )
    }
    const mintResult = await this.hederaService.mintNFT(
      tokenId,
      user.hederaAccountId,
      JSON.stringify(metadata)
    )

    // Enregistrer en base de données
    const nft = await Nft.create({
      tokenId: tokenId,
      serialNumber: mintResult.serialNumber.toString(),
      ownerId: userId,
      type: 'badge',
      collection: 'HederaSoutien Donor Badges',
      metadata: JSON.stringify(metadata),
      ipfsHash: ipfsHash,
    })

    return nft
  }

  /**
   * Créer un NFT pour un équipement
   */
  async createEquipmentNFT(
    equipmentData: {
      type: string
      model: string
      condition: string
      photos: string[]
      documents: string
    },
    ownerId: number
  ): Promise<Nft> {
    const metadata = {
      name: `${equipmentData.type} - ${equipmentData.model}`,
      description: `Équipement médical certifié HederaSoutien`,
      image: await this.ipfsService.uploadEquipmentPhotos(equipmentData.photos),
      attributes: [
        {
          trait_type: "Type d'Équipement",
          value: equipmentData.type,
        },
        {
          trait_type: 'Modèle',
          value: equipmentData.model,
        },
        {
          trait_type: 'État',
          value: equipmentData.condition,
        },
        {
          trait_type: 'Date de Mise en Service',
          value: new Date().toISOString(),
        },
      ],
      history: [
        {
          owner: ownerId,
          date: new Date().toISOString(),
          event: 'Mise en circulation',
        },
      ],
    }

    const ipfsHash = await this.ipfsService.uploadMetadata(metadata)

    const user = await User.findOrFail(ownerId)
    if (!user.hederaAccountId) {
      throw new Error('Utilisateur sans wallet Hedera')
    }

    const tokenId = env.get('NFT_COLLECTION_EQUIPMENT')
    if (!tokenId) {
      throw new Error("NFT_COLLECTION_EQUIPMENT non configuré dans les variables d'environnement")
    }
    const mintResult = await this.hederaService.mintNFT(
      tokenId,
      user.hederaAccountId,
      JSON.stringify(metadata)
    )

    const nft = await Nft.create({
      tokenId: tokenId,
      serialNumber: mintResult.serialNumber.toString(),
      ownerId: ownerId,
      type: 'equipment',
      collection: 'HederaSoutien Equipment',
      metadata: JSON.stringify(metadata),
      ipfsHash: ipfsHash,
    })

    return nft
  }

  /**
   * Transférer un NFT à un autre utilisateur
   */
  async transferNFT(nftId: number, fromUserId: number, toUserId: number): Promise<void> {
    const nft = await Nft.findOrFail(nftId)

    if (nft.ownerId !== fromUserId) {
      throw new Error('Vous ne possédez pas ce NFT')
    }

    const fromUser = await User.findOrFail(fromUserId)
    const toUser = await User.findOrFail(toUserId)

    if (!fromUser.hederaAccountId || !toUser.hederaAccountId) {
      throw new Error("Un des utilisateurs n'a pas de wallet Hedera")
    }

    // Mettre à jour les métadonnées avec le nouveau propriétaire
    const metadata = JSON.parse(nft.metadata)
    metadata.history.push({
      owner: toUserId,
      date: new Date().toISOString(),
      event: 'Transfert de propriété',
    })

    // En production, utiliser TransferTransaction avec les clés appropriées
    // Pour l'instant, on met juste à jour la base de données
    nft.ownerId = toUserId
    nft.metadata = JSON.stringify(metadata)
    await nft.save()
  }

  /**
   * Obtenir tous les NFTs d'un utilisateur
   */
  async getUserNFTs(userId: number): Promise<Nft[]> {
    return await Nft.query().where('ownerId', userId).orderBy('createdAt', 'desc')
  }

  /**
   * Calculer le niveau de badge selon le montant total
   */
  private calculateBadgeLevel(totalDonations: number): string {
    if (totalDonations >= 10000) return 'LEGENDARY'
    if (totalDonations >= 5000) return 'DIAMOND'
    if (totalDonations >= 2000) return 'GOLD'
    if (totalDonations >= 500) return 'SILVER'
    return 'BRONZE'
  }

  /**
   * Obtenir le nom du badge
   */
  private getBadgeName(level: string): string {
    const names: Record<string, string> = {
      BRONZE: 'Donateur Novice',
      SILVER: 'Donateur Actif',
      GOLD: 'Donateur Engagé',
      DIAMOND: 'Bienfaiteur',
      LEGENDARY: 'Légende',
    }
    return names[level] || 'Donateur'
  }
}
