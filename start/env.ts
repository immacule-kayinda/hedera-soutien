/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring Hedera
  |----------------------------------------------------------
  */
  HEDERA_NETWORK: Env.schema.enum(['testnet', 'mainnet'] as const),
  HEDERA_OPERATOR_ID: Env.schema.string(),
  HEDERA_OPERATOR_KEY: Env.schema.string(),
  HEDERA_TOPIC_ID: Env.schema.string.optional(),
  NFT_COLLECTION_DONOR_BADGES: Env.schema.string.optional(),
  NFT_COLLECTION_EQUIPMENT: Env.schema.string.optional(),
  NFT_COLLECTION_CERTIFICATES: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring IPFS
  |----------------------------------------------------------
  */
  IPFS_HOST: Env.schema.string.optional(),
  IPFS_PORT: Env.schema.number.optional(),
  IPFS_PROTOCOL: Env.schema.string.optional(),
  INFURA_PROJECT_ID: Env.schema.string.optional(),
  INFURA_PROJECT_SECRET: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for encryption
  |----------------------------------------------------------
  */
  ENCRYPTION_KEY: Env.schema.string(),
})
