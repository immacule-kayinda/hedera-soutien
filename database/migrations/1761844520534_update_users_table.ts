import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('full_name')
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('phone').nullable()
      table.string('address_street').nullable()
      table.string('address_city').nullable()
      table.string('address_postal_code').nullable()
      table.string('address_country').nullable()
      table.enum('role', ['patient', 'partner', 'admin']).defaultTo('patient')
      table.enum('status', ['pending', 'active', 'suspended']).defaultTo('pending')
      table.string('hedera_account_id').nullable()
      table.text('hedera_public_key').nullable()
      table.text('hedera_encrypted_private_key').nullable()
      table.enum('wallet_type', ['custodial', 'hashpack']).defaultTo('custodial')
      table.string('disability_type').nullable()
      table.integer('disability_level').nullable()
      table.text('equipment_needs').nullable()
      table.string('mobility').nullable()
      table.enum('partner_type', ['association', 'particulier', 'entreprise', 'autre']).nullable()
      table.text('partner_motifs').nullable()
      table.integer('reputation_score').defaultTo(0)
      table.integer('donations_count').defaultTo(0)
      table.decimal('donations_total', 10, 2).defaultTo(0)
      table.integer('volunteer_hours').defaultTo(0)
      table.timestamp('member_since').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('full_name').nullable()
      table.dropColumn('first_name')
      table.dropColumn('last_name')
      table.dropColumn('phone')
      table.dropColumn('address_street')
      table.dropColumn('address_city')
      table.dropColumn('address_postal_code')
      table.dropColumn('address_country')
      table.dropColumn('role')
      table.dropColumn('status')
      table.dropColumn('hedera_account_id')
      table.dropColumn('hedera_public_key')
      table.dropColumn('hedera_encrypted_private_key')
      table.dropColumn('wallet_type')
      table.dropColumn('disability_type')
      table.dropColumn('disability_level')
      table.dropColumn('equipment_needs')
      table.dropColumn('mobility')
      table.dropColumn('partner_type')
      table.dropColumn('partner_motifs')
      table.dropColumn('reputation_score')
      table.dropColumn('donations_count')
      table.dropColumn('donations_total')
      table.dropColumn('volunteer_hours')
      table.dropColumn('member_since')
    })
  }
}
