import { create } from 'ipfs-http-client'
import env from '#start/env'

export default class IPFSService {
  private ipfs: ReturnType<typeof create>

  constructor() {
    this.ipfs = create({
      host: env.get('IPFS_HOST', 'ipfs.infura.io'),
      port: env.get('IPFS_PORT', 5001),
      protocol: env.get('IPFS_PROTOCOL', 'https'),
      headers: {
        authorization: `Basic ${Buffer.from(
          `${env.get('INFURA_PROJECT_ID')}:${env.get('INFURA_PROJECT_SECRET')}`
        ).toString('base64')}`,
      },
    })
  }

  /**
   * Upload une image sur IPFS
   */
  async uploadImage(imageBuffer: Buffer, imageName: string): Promise<string> {
    try {
      const { cid } = await this.ipfs.add({
        path: `images/${imageName}`,
        content: imageBuffer,
      })
      return cid.toString()
    } catch (error) {
      console.error('Erreur upload IPFS:', error)
      throw new Error("Impossible de télécharger l'image sur IPFS")
    }
  }

  /**
   * Upload des métadonnées JSON sur IPFS
   */
  async uploadMetadata(metadata: object): Promise<string> {
    try {
      const metadataString = JSON.stringify(metadata)
      const { cid } = await this.ipfs.add(metadataString)
      return cid.toString()
    } catch (error) {
      console.error('Erreur upload métadonnées IPFS:', error)
      throw new Error('Impossible de télécharger les métadonnées sur IPFS')
    }
  }

  /**
   * Récupérer des données depuis IPFS
   */
  async getMetadata(ipfsHash: string): Promise<object> {
    try {
      const stream = this.ipfs.cat(ipfsHash)
      let data = ''

      for await (const chunk of stream) {
        data += chunk.toString()
      }

      return JSON.parse(data)
    } catch (error) {
      console.error('Erreur récupération IPFS:', error)
      throw new Error('Impossible de récupérer les données depuis IPFS')
    }
  }

  /**
   * Upload l'image d'un badge
   */
  async uploadBadgeImage(level: string): Promise<string> {
    // En production, charger l'image réelle depuis le système de fichiers
    // Pour l'instant, retourner un hash IPFS de placeholder
    const placeholder = {
      level: level,
      type: 'badge',
      generatedAt: new Date().toISOString(),
    }
    return await this.uploadMetadata(placeholder)
  }

  /**
   * Upload les photos d'un équipement
   */
  async uploadEquipmentPhotos(photos: string[]): Promise<string> {
    // En production, uploader les vraies images
    const photosData = {
      photos: photos,
      uploadedAt: new Date().toISOString(),
    }
    return await this.uploadMetadata(photosData)
  }
}
