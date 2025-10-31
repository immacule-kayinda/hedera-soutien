import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'consensus_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('topic_id').notNullable()
      table.integer('sequence_number').notNullable()
      table
        .enum('event_type', [
          'DONATION',
          'EQUIPMENT_TRANSFER',
          'VOLUNTEER_HOURS',
          'BADGE_AWARDED',
          'OTHER',
        ])
        .notNullable()
      table.text('payload').notNullable() // JSON object
      table.text('participants').nullable() // JSON array
      table.string('hedera_transaction_id').nullable()
      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
