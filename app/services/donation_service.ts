import HederaService from './hedera_service.js'
import NFTService from './nft_service.js'
import Donation from '#models/donation'
import User from '#models/user'
import AssistanceRequest from '#models/assistance_request'

export default class DonationService {
  private hederaService: HederaService
  private nftService: NFTService

  constructor() {
    this.hederaService = new HederaService()
    this.nftService = new NFTService()
  }

  /**
   * Traiter un don complet
   */
  async processDonation(data: {
    donorId: number
    beneficiaryId: number
    amount: number
    currency: string
    assistanceRequestId?: number
    description?: string
  }): Promise<Donation> {
    const donor = await User.findOrFail(data.donorId)
    const beneficiary = await User.findOrFail(data.beneficiaryId)

    if (!donor.hederaAccountId || !beneficiary.hederaAccountId) {
      throw new Error('Les deux utilisateurs doivent avoir un wallet Hedera')
    }

    // Convertir le montant en HBAR (exemple: 1 HBAR = 0.05€)
    const amountHbar = data.amount / 0.05

    // Créer la transaction Hedera
    const txResult = await this.hederaService.executeDonation(
      donor.hederaAccountId,
      beneficiary.hederaAccountId,
      amountHbar,
      `Don HederaSoutien: ${data.amount}${data.currency}`
    )

    // Créer l'enregistrement en base
    const donation = await Donation.create({
      donorId: data.donorId,
      beneficiaryId: data.beneficiaryId,
      assistanceRequestId: data.assistanceRequestId || null,
      amount: data.amount,
      currency: data.currency,
      hederaTransactionId: txResult.transactionId,
      status: txResult.status === 'SUCCESS' ? 'success' : 'failed',
      description: data.description || null,
    })

    // Mettre à jour les statistiques des utilisateurs
    await this.updateUserStats(data.donorId, data.beneficiaryId, data.amount)

    // Si le don est réussi, créer un badge NFT si nécessaire
    if (txResult.status === 'SUCCESS') {
      await this.checkAndAwardBadge(data.donorId)
    }

    // Mettre à jour la demande d'aide si applicable
    if (data.assistanceRequestId) {
      await this.updateAssistanceRequest(data.assistanceRequestId, data.amount)
    }

    return donation
  }

  /**
   * Mettre à jour les statistiques des utilisateurs
   */
  private async updateUserStats(
    donorId: number,
    beneficiaryId: number,
    amount: number
  ): Promise<void> {
    // Mettre à jour les statistiques du donateur
    const donor = await User.findOrFail(donorId)
    donor.donationsCount += 1
    donor.donationsTotal += amount

    // Calculer le nouveau score de réputation du donateur
    donor.reputationScore = await this.calculateReputationScore(donor)

    await donor.save()

    // Mettre à jour les statistiques du bénéficiaire
    const beneficiary = await User.findOrFail(beneficiaryId)

    // Mettre à jour le score de réputation du bénéficiaire
    beneficiary.reputationScore = await this.calculateReputationScore(beneficiary)

    await beneficiary.save()
  }

  /**
   * Calculer le score de réputation d'un utilisateur
   */
  private async calculateReputationScore(user: User): Promise<number> {
    let score = 0

    // Points de base selon le type d'utilisateur
    if (user.role === 'partner') {
      // Pour les partenaires : basé sur les dons effectués
      score += Math.min(user.donationsCount * 2, 50) // Max 50 points pour nombre de dons
      score += Math.min(user.donationsTotal / 100, 30) // Max 30 points pour montant total
      score += Math.min(user.volunteerHours / 10, 20) // Max 20 points pour bénévolat
    } else if (user.role === 'patient') {
      // Pour les patients : basé sur l'engagement et la transparence
      const assistanceRequests = await AssistanceRequest.query()
        .where('userId', user.id)
        .count('* as total')

      score += Math.min(Number(assistanceRequests[0].$extras.total) * 5, 30) // Max 30 points

      // Points pour les témoignages/interactions (à implémenter plus tard)
      score += 10 // Points de base pour l'inscription
    }

    // Bonus d'ancienneté
    if (user.memberSince) {
      const memberSince = user.memberSince
      const monthsAsMember = Math.floor(
        (Date.now() - memberSince.toMillis()) / (1000 * 60 * 60 * 24 * 30)
      )
      score += Math.min(monthsAsMember, 20) // Max 20 points pour ancienneté
    }

    // Bonus pour les NFTs (badges)
    const nftCount = await this.nftService.getUserNFTs(user.id)
    score += Math.min(nftCount.length * 3, 15) // Max 15 points pour badges

    // S'assurer que le score reste entre 0 et 100
    return Math.min(Math.max(score, 0), 100)
  }

  /**
   * Vérifier et attribuer un badge NFT si le donateur le mérite
   */
  private async checkAndAwardBadge(donorId: number): Promise<void> {
    const donor = await User.findOrFail(donorId)

    // Calculer le nombre de personnes aidées
    const helpedPeople = await Donation.query()
      .where('donorId', donorId)
      .where('status', 'success')
      .count('* as total')

    // Vérifier si un nouveau badge doit être créé
    const existingBadges = await this.nftService.getUserNFTs(donorId)
    const currentHighestBadge = this.getHighestBadgeLevel(existingBadges)

    // Créer un nouveau badge si le niveau a augmenté
    if (this.shouldAwardNewBadge(donor.donationsTotal, currentHighestBadge)) {
      await this.nftService.createDonorBadge(donorId, {
        amount: 0, // Pas utilisé pour les badges
        totalDonations: donor.donationsTotal,
        helpedPeople: Number(helpedPeople[0].$extras.total),
      })
    }
  }

  /**
   * Mettre à jour une demande d'aide avec le nouveau don
   */
  private async updateAssistanceRequest(requestId: number, amount: number): Promise<void> {
    const request = await AssistanceRequest.findOrFail(requestId)
    request.amountRaised += amount

    // Mettre à jour le statut si l'objectif est atteint
    if (request.amountNeeded && request.amountRaised >= request.amountNeeded) {
      request.status = 'fulfilled'
    } else if (request.status === 'open') {
      request.status = 'in_progress'
    }

    await request.save()
  }

  /**
   * Obtenir le niveau de badge le plus élevé
   */
  private getHighestBadgeLevel(nfts: any[]): string {
    const levels: Record<string, number> = {
      BRONZE: 0,
      SILVER: 1,
      GOLD: 2,
      DIAMOND: 3,
      LEGENDARY: 4,
    }

    let highestLevel = 'BRONZE'
    let highestLevelValue = 0

    for (const nft of nfts) {
      if (nft.type === 'badge' && nft.metadata) {
        try {
          const metadata = JSON.parse(nft.metadata)
          const badgeLevel = metadata.attributes?.find(
            (attr: any) => attr.trait_type === 'Niveau'
          )?.value

          if (badgeLevel && levels[badgeLevel] !== undefined) {
            if (levels[badgeLevel] > highestLevelValue) {
              highestLevelValue = levels[badgeLevel]
              highestLevel = badgeLevel
            }
          }
        } catch (error) {
          // Ignorer les erreurs de parsing
          continue
        }
      }
    }

    return highestLevel
  }

  /**
   * Déterminer si un nouveau badge doit être attribué
   */
  private shouldAwardNewBadge(totalDonations: number, currentLevel: string): boolean {
    const thresholds: Record<string, number> = {
      BRONZE: 0,
      SILVER: 500,
      GOLD: 2000,
      DIAMOND: 5000,
      LEGENDARY: 10000,
    }

    const currentThreshold = thresholds[currentLevel] || 0
    return totalDonations >= currentThreshold
  }
}
