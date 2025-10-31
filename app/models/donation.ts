import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import AssistanceRequest from './assistance_request.js'

export default class Donation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare donorId: number

  @column()
  declare beneficiaryId: number

  @column()
  declare assistanceRequestId: number | null

  @column()
  declare amount: number

  @column()
  declare currency: string

  @column()
  declare hederaTransactionId: string | null

  @column()
  declare status: 'pending' | 'success' | 'failed'

  @column()
  declare description: string | null

  @column()
  declare proofIpfsHash: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relations
  @belongsTo(() => User, {
    foreignKey: 'donorId',
  })
  declare donor: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'beneficiaryId',
  })
  declare beneficiary: BelongsTo<typeof User>

  @belongsTo(() => AssistanceRequest, {
    foreignKey: 'assistanceRequestId',
  })
  declare assistanceRequest: BelongsTo<typeof AssistanceRequest> | null
}

