import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Nft from './nft.js'

export default class Equipment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nftId: number | null

  @column()
  declare type: string

  @column()
  declare model: string

  @column()
  declare condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor'

  @column()
  declare photos: string | null // JSON array of IPFS hashes

  @column()
  declare history: string | null // JSON array

  @column()
  declare documentsIpfsHash: string | null

  @column()
  declare currentOwnerId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relations
  @belongsTo(() => Nft, {
    foreignKey: 'nftId',
  })
  declare nft: BelongsTo<typeof Nft> | null

  @belongsTo(() => User, {
    foreignKey: 'currentOwnerId',
  })
  declare currentOwner: BelongsTo<typeof User> | null
}

