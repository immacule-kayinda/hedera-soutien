import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fromUserId: number

  @column()
  declare toUserId: number

  @column()
  declare content: string

  @column()
  declare attachmentsIpfsHash: string | null

  @column.dateTime()
  declare readAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relations
  @belongsTo(() => User, {
    foreignKey: 'fromUserId',
  })
  declare fromUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'toUserId',
  })
  declare toUser: BelongsTo<typeof User>
}

