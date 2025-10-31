/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const DonationsController = () => import('#controllers/donations_controller')
const AssistanceRequestsController = () => import('#controllers/assistance_requests_controller')
const NFTsController = () => import('#controllers/nfts_controller')
const HederaController = () => import('#controllers/hedera_controller')
const WalletController = () => import('#controllers/wallet_controller')

// Route de santé
router.get('/', async () => {
  return {
    name: 'HederaSoutien API',
    version: '1.0.0',
    status: 'online',
  }
})

// Routes d'authentification (publiques)
router
  .group(() => {
    router.post('/auth/register/patient', [AuthController, 'registerPatient'])
    router.post('/auth/register/partner', [AuthController, 'registerPartner'])
    router.post('/auth/login', [AuthController, 'login'])
  })
  .prefix('/api')

// Routes protégées
router
  .group(() => {
    // Authentification
    router.get('/auth/me', [AuthController, 'me'])

    // Utilisateurs
    router.put('/users/profile', [UsersController, 'update'])
    router.get('/users/hedera-balance', [UsersController, 'getHederaBalance'])
    router.get('/users/stats', [UsersController, 'stats'])

    // Dons
    router.post('/donations', [DonationsController, 'store'])
    router.get('/donations/my-donations', [DonationsController, 'myDonations'])
    router.get('/donations/received', [DonationsController, 'receivedDonations'])
    router.get('/donations/:id', [DonationsController, 'show'])

    // Demandes d'aide
    router.post('/assistance-requests', [AssistanceRequestsController, 'store'])
    router.get('/assistance-requests', [AssistanceRequestsController, 'index'])
    router.get('/assistance-requests/my-requests', [AssistanceRequestsController, 'myRequests'])
    router.get('/assistance-requests/:id', [AssistanceRequestsController, 'show'])
    router.put('/assistance-requests/:id', [AssistanceRequestsController, 'update'])

    // NFTs
    router.get('/nfts/my-nfts', [NFTsController, 'myNFTs'])
    router.get('/nfts/:id', [NFTsController, 'show'])
    router.post('/nfts/:id/transfer', [NFTsController, 'transfer'])

    // Routes Hedera (opérations blockchain sécurisées)
    router
      .group(() => {
        router.post('/create-account', [HederaController, 'createAccount'])
        router.post('/transfer', [HederaController, 'transfer'])
        router.post('/create-token', [HederaController, 'createToken'])
        router.post('/sign-transaction', [HederaController, 'signTransaction'])
      })
      .prefix('/hedera')

    // Routes Wallet (gestion des portefeuilles utilisateurs)
    router
      .group(() => {
        router.post('/create', [WalletController, 'create'])
        router.get('/show', [WalletController, 'show'])
        router.get('/balance', [WalletController, 'balance'])
        router.post('/initialize', [WalletController, 'initialize'])
      })
      .prefix('/wallet')
  })
  .prefix('/api')
  .use(middleware.auth())
