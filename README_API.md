# HederaSoutien API - Documentation Backend

## 🚀 Vue d'ensemble

API backend complète pour la plateforme HederaSoutien, construite avec AdonisJS et intégration Hedera Hashgraph.

## 📋 Prérequis

- Node.js 18+
- PostgreSQL 14+
- Compte Hedera (Testnet ou Mainnet)
- Compte Infura pour IPFS (optionnel)

## 🔧 Installation

1. Installer les dépendances :

```bash
npm install
```

2. Configurer les variables d'environnement :

```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

3. Exécuter les migrations :

```bash
node ace migration:run
```

4. Démarrer le serveur de développement :

```bash
npm run dev
```

## 📚 Structure du Projet

```
app/
├── controllers/          # Contrôleurs API
│   ├── auth_controller.ts
│   ├── users_controller.ts
│   ├── donations_controller.ts
│   ├── assistance_requests_controller.ts
│   └── nfts_controller.ts
├── models/              # Modèles de données
│   ├── user.ts
│   ├── donation.ts
│   ├── assistance_request.ts
│   ├── nft.ts
│   ├── equipment.ts
│   ├── message.ts
│   └── consensus_event.ts
├── services/            # Services métier
│   ├── hedera_service.ts
│   ├── nft_service.ts
│   ├── donation_service.ts
│   └── ipfs_service.ts
└── middleware/          # Middleware personnalisés

database/
└── migrations/          # Migrations de base de données

start/
├── routes.ts            # Définition des routes
├── env.ts               # Validation des variables d'environnement
└── kernel.ts            # Configuration middleware
```

## 🔐 Authentification

L'API utilise l'authentification par token JWT.

### Inscription Patient

```http
POST /api/auth/register/patient
Content-Type: application/json

{
  "firstName": "Marie",
  "lastName": "Dupont",
  "email": "marie@example.com",
  "password": "securePassword123",
  "phone": "+33612345678",
  "disabilityType": "moteur",
  "disabilityLevel": 3
}
```

### Inscription Partenaire

```http
POST /api/auth/register/partner
Content-Type: application/json

{
  "firstName": "Association",
  "lastName": "Solidarité",
  "email": "asso@example.com",
  "password": "securePassword123",
  "partnerType": "association",
  "partnerMotifs": ["Soutien financier", "Don de matériel"]
}
```

### Connexion

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "marie@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

## 📡 Endpoints Principaux

### Utilisateurs

- `GET /api/users/stats` - Statistiques de l'utilisateur
- `PUT /api/users/profile` - Mettre à jour le profil
- `GET /api/users/hedera-balance` - Solde Hedera

### Dons

- `POST /api/donations` - Créer un don
- `GET /api/donations/my-donations` - Mes dons effectués
- `GET /api/donations/received` - Dons reçus
- `GET /api/donations/:id` - Détails d'un don

### Demandes d'Aide

- `POST /api/assistance-requests` - Créer une demande
- `GET /api/assistance-requests` - Liste des demandes (avec filtres)
- `GET /api/assistance-requests/my-requests` - Mes demandes
- `GET /api/assistance-requests/:id` - Détails d'une demande
- `PUT /api/assistance-requests/:id` - Mettre à jour une demande

### NFTs

- `GET /api/nfts/my-nfts` - Mes NFTs
- `GET /api/nfts/:id` - Détails d'un NFT
- `POST /api/nfts/:id/transfer` - Transférer un NFT

## 🔗 Intégration Hedera

### Création de Wallet

Lors de l'inscription, un wallet Hedera est automatiquement créé pour chaque utilisateur avec :

- Compte Hedera unique
- Clé privée chiffrée et stockée sécuritairement
- 1 HBAR initial pour les frais de transaction

### Transactions de Dons

Chaque don est enregistré sur Hedera comme une transaction HBAR :

- Transaction ID traçable sur HashScan
- Mémos descriptifs pour la transparence
- Statut vérifiable

### NFTs

Trois types de collections NFT :

1. **Badges Donateurs** - Reconnaissance des donateurs actifs
2. **Équipements** - Traçabilité des équipements médicaux
3. **Certificats** - Compétences bénévoles

## 🔒 Sécurité

- Clés privées chiffrées avec AES-256
- Authentification JWT
- Validation des données d'entrée
- Protection CSRF
- Rate limiting (à configurer)

## 📊 Base de Données

### Tables Principales

- `users` - Utilisateurs (patients, partenaires, admins)
- `donations` - Transactions de dons
- `assistance_requests` - Demandes d'aide
- `nfts` - NFTs créés
- `equipment` - Équipements médicaux
- `messages` - Messagerie interne
- `consensus_events` - Journal des événements Hedera

## 🧪 Tests

```bash
npm test
```

## 📝 Variables d'Environnement Requises

Voir `.env.example` pour la liste complète.

## 🚨 Notes Importantes

1. **Testnet vs Mainnet** : Commencer avec Testnet pour le développement
2. **Clés Hedera** : Ne jamais commiter les clés privées
3. **IPFS** : Optionnel, peut être remplacé par un stockage local pour le développement
4. **Frais Hedera** : Prévoir un budget pour les transactions (très faible ~0.0001 HBAR)

## 📞 Support

Pour toute question sur l'API, consulter la documentation AdonisJS ou créer une issue.
