import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Donation from './donation.js'
import AssistanceRequest from './assistance_request.js'
import Nft from './nft.js'
import Message from './message.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare phone: string | null

  @column()
  declare addressStreet: string | null

  @column()
  declare addressCity: string | null

  @column()
  declare addressPostalCode: string | null

  @column()
  declare addressCountry: string | null

  @column()
  declare role: 'patient' | 'partner' | 'admin'

  @column()
  declare status: 'pending' | 'active' | 'suspended'

  // Wallet Hedera
  @column()
  declare hederaAccountId: string | null

  @column()
  declare hederaPublicKey: string | null

  @column({ serializeAs: null })
  declare hederaEncryptedPrivateKey: string | null

  @column()
  declare walletType: 'custodial' | 'hashpack'

  // Profil Patient
  @column()
  declare disabilityType: string | null

  @column()
  declare disabilityLevel: number | null

  @column()
  declare equipmentNeeds: string | null // JSON array

  @column()
  declare mobility: string | null

  // Profil Partenaire
  @column()
  declare partnerType: 'association' | 'particulier' | 'entreprise' | 'autre' | null

  @column()
  declare partnerMotifs: string | null // JSON array

  // Réputation
  @column()
  declare reputationScore: number

  @column()
  declare donationsCount: number

  @column()
  declare donationsTotal: number

  @column()
  declare volunteerHours: number

  @column.dateTime()
  declare memberSince: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relations
  @hasMany(() => Donation, {
    foreignKey: 'donorId',
  })
  declare donationsMade: HasMany<typeof Donation>

  @hasMany(() => Donation, {
    foreignKey: 'beneficiaryId',
  })
  declare donationsReceived: HasMany<typeof Donation>

  @hasMany(() => AssistanceRequest)
  declare assistanceRequests: HasMany<typeof AssistanceRequest>

  @hasMany(() => Nft, {
    foreignKey: 'ownerId',
  })
  declare nfts: HasMany<typeof Nft>

  @hasMany(() => Message, {
    foreignKey: 'fromUserId',
  })
  declare messagesSent: HasMany<typeof Message>

  @hasMany(() => Message, {
    foreignKey: 'toUserId',
  })
  declare messagesReceived: HasMany<typeof Message>
}
