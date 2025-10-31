import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Nft extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tokenId: string

  @column()
  declare serialNumber: string

  @column()
  declare ownerId: number

  @column()
  declare type: 'badge' | 'equipment' | 'certificate'

  @column()
  declare collection: string

  @column()
  declare metadata: string // JSON object

  @column()
  declare ipfsHash: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relations
  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>
}

