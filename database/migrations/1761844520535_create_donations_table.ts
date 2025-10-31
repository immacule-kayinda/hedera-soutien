import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'donations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('donor_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('beneficiary_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('assistance_request_id').unsigned().nullable().references('id').inTable('assistance_requests').onDelete('SET NULL')
      table.decimal('amount', 10, 2).notNullable()
      table.string('currency', 3).defaultTo('EUR')
      table.string('hedera_transaction_id').nullable()
      table.enum('status', ['pending', 'success', 'failed']).defaultTo('pending')
      table.text('description').nullable()
      table.string('proof_ipfs_hash').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

