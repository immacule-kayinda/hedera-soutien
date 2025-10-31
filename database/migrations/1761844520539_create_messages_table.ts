import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('from_user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('to_user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.text('content').notNullable()
      table.string('attachments_ipfs_hash').nullable()
      table.timestamp('read_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

