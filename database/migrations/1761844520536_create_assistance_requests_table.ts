import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'assistance_requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.enum('category', ['financial', 'equipment', 'service', 'other']).notNullable()
      table.decimal('amount_needed', 10, 2).nullable()
      table.decimal('amount_raised', 10, 2).defaultTo(0)
      table.enum('urgency', ['low', 'medium', 'high', 'critical']).defaultTo('medium')
      table.enum('status', ['open', 'in_progress', 'fulfilled', 'cancelled']).defaultTo('open')
      table.string('hedera_topic_id').nullable()
      table.text('supporters').nullable() // JSON array
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

