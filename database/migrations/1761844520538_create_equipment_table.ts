import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'equipment'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('nft_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('nfts')
        .onDelete('SET NULL')
      table.string('type').notNullable()
      table.string('model').notNullable()
      table.enum('condition', ['new', 'excellent', 'good', 'fair', 'poor']).notNullable()
      table.text('photos').nullable() // JSON array
      table.text('history').nullable() // JSON array
      table.string('documents_ipfs_hash').nullable()
      table
        .integer('current_owner_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
