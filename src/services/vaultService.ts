import { Storage } from "@plasmohq/storage"

interface VaultEntry {
  username: string
  password: string
  website: string
}

class VaultService {
  private storage = new Storage()
  private encoder = new TextEncoder()
  private decoder = new TextDecoder()

  // Derive encryption key from master password
  private async deriveKey(masterPassword: string): Promise<CryptoKey> {
    const salt = new Uint8Array(16)
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      this.encoder.encode(masterPassword),
      "PBKDF2",
      false,
      ["deriveKey"]
    )
    
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    )
  }

  // Encrypt data
  private async encrypt(data: string, key: CryptoKey): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      this.encoder.encode(data)
    )
    
    return JSON.stringify({
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    })
  }

  // Decrypt data
  private async decrypt(encryptedData: string, key: CryptoKey): Promise<string> {
    const { iv, data } = JSON.parse(encryptedData)
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      new Uint8Array(data)
    )
    
    return this.decoder.decode(decrypted)
  }

  // Initialize vault with master password
  async initializeVault(masterPassword: string): Promise<void> {
    const key = await this.deriveKey(masterPassword)
    const emptyVault = await this.encrypt(JSON.stringify([]), key)
    await this.storage.set("vault", emptyVault)
    await this.storage.set("vaultInitialized", true)
  }

  // Add entry to vault
  async addEntry(entry: VaultEntry, masterPassword: string): Promise<void> {
    const key = await this.deriveKey(masterPassword)
    const encryptedVault = await this.storage.get("vault")
    const decryptedVault = await this.decrypt(encryptedVault, key)
    const vault = JSON.parse(decryptedVault) as VaultEntry[]
    
    vault.push(entry)
    const updatedEncryptedVault = await this.encrypt(JSON.stringify(vault), key)
    await this.storage.set("vault", updatedEncryptedVault)
  }

  // Get all entries
  async getEntries(masterPassword: string): Promise<VaultEntry[]> {
    const key = await this.deriveKey(masterPassword)
    const encryptedVault = await this.storage.get("vault")
    const decryptedVault = await this.decrypt(encryptedVault, key)
    return JSON.parse(decryptedVault)
  }

  // Check if vault is initialized
  async isInitialized(): Promise<boolean> {
    const initialized = await this.storage.get("vaultInitialized")
    return !!initialized
  }
}

export const vaultService = new VaultService() 