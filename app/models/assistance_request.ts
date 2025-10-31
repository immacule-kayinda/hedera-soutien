import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Donation from './donation.js'

export default class AssistanceRequest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare category: 'financial' | 'equipment' | 'service' | 'other'

  @column()
  declare amountNeeded: number | null

  @column()
  declare amountRaised: number

  @column()
  declare urgency: 'low' | 'medium' | 'high' | 'critical'

  @column()
  declare status: 'open' | 'in_progress' | 'fulfilled' | 'cancelled'

  @column()
  declare hederaTopicId: string | null

  @column()
  declare supporters: string | null // JSON array

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relations
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Donation, {
    foreignKey: 'assistanceRequestId',
  })
  declare donations: HasMany<typeof Donation>
}
