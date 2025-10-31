import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ConsensusEvent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare topicId: string

  @column()
  declare sequenceNumber: number

  @column()
  declare eventType: 'DONATION' | 'EQUIPMENT_TRANSFER' | 'VOLUNTEER_HOURS' | 'BADGE_AWARDED' | 'OTHER'

  @column()
  declare payload: string // JSON object

  @column()
  declare participants: string | null // JSON array

  @column()
  declare hederaTransactionId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}

