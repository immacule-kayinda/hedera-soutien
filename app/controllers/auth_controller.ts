import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import HederaService from '#services/hedera_service'

export default class AuthController {
  /**
   * Inscription - Patient
   */
  async registerPatient({ request, response }: HttpContext) {
    const data = request.only([
      'firstName',
      'lastName',
      'email',
      'password',
      'phone',
      'addressStreet',
      'addressCity',
      'addressPostalCode',
      'addressCountry',
      'disabilityType',
      'disabilityLevel',
      'equipmentNeeds',
      'mobility',
    ])

    // Vérifier si l'email existe déjà
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      return response.status(400).json({ error: 'Cet email est déjà utilisé' })
    }

    // Créer le wallet Hedera
    const hederaService = new HederaService()
    const wallet = await hederaService.createUserWallet()

    // Chiffrer la clé privée
    const tempUserId = 0 // Sera mis à jour après création
    const encryptedKey = hederaService.encryptPrivateKey(wallet.privateKey, tempUserId)

    // Créer l'utilisateur
    const user = await User.create({
      ...data,
      role: 'patient',
      status: 'pending',
      hederaAccountId: wallet.accountId,
      hederaPublicKey: wallet.publicKey,
      hederaEncryptedPrivateKey: encryptedKey,
      walletType: 'custodial',
      reputationScore: 0,
      donationsCount: 0,
      donationsTotal: 0,
      volunteerHours: 0,
      memberSince: new Date(),
    })

    // Mettre à jour la clé chiffrée avec le vrai ID
    user.hederaEncryptedPrivateKey = hederaService.encryptPrivateKey(
      wallet.privateKey,
      user.id
    )
    await user.save()

    return response.status(201).json({
      message: 'Inscription réussie',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        hederaAccountId: user.hederaAccountId,
      },
    })
  }

  /**
   * Inscription - Partenaire
   */
  async registerPartner({ request, response }: HttpContext) {
    const data = request.only([
      'firstName',
      'lastName',
      'email',
      'password',
      'phone',
      'addressStreet',
      'addressCity',
      'addressPostalCode',
      'addressCountry',
      'partnerType',
      'partnerMotifs',
    ])

    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      return response.status(400).json({ error: 'Cet email est déjà utilisé' })
    }

    const hederaService = new HederaService()
    const wallet = await hederaService.createUserWallet()

    const user = await User.create({
      ...data,
      role: 'partner',
      status: 'pending',
      hederaAccountId: wallet.accountId,
      hederaPublicKey: wallet.publicKey,
      hederaEncryptedPrivateKey: hederaService.encryptPrivateKey(
        wallet.privateKey,
        0
      ),
      walletType: 'custodial',
      reputationScore: 0,
      donationsCount: 0,
      donationsTotal: 0,
      volunteerHours: 0,
      memberSince: new Date(),
    })

    user.hederaEncryptedPrivateKey = hederaService.encryptPrivateKey(
      wallet.privateKey,
      user.id
    )
    await user.save()

    return response.status(201).json({
      message: 'Inscription partenaire réussie',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        hederaAccountId: user.hederaAccountId,
      },
    })
  }

  /**
   * Connexion
   */
  async login({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)
      const token = await auth.use('api').generate(user)

      return response.json({
        token: token.token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          hederaAccountId: user.hederaAccountId,
        },
      })
    } catch {
      return response.status(401).json({ error: 'Identifiants invalides' })
    }
  }

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  async me({ auth, response }: HttpContext) {
    const user = await auth.getUserOrFail()

    return response.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      hederaAccountId: user.hederaAccountId,
      reputationScore: user.reputationScore,
      donationsCount: user.donationsCount,
      donationsTotal: user.donationsTotal,
      volunteerHours: user.volunteerHours,
      memberSince: user.memberSince,
    })
  }
}

