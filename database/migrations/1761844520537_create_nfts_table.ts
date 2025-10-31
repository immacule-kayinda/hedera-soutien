import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'nfts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('token_id').notNullable()
      table.string('serial_number').notNullable()
      table
        .integer('owner_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.enum('type', ['badge', 'equipment', 'certificate']).notNullable()
      table.string('collection').notNullable()
      table.text('metadata').notNullable() // JSON object
      table.string('ipfs_hash').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['token_id', 'serial_number'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
