import React, { useState, useEffect } from "react"
import { vaultService } from "../services/vaultService"

export const PasswordVault = () => {
  const [masterPassword, setMasterPassword] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [website, setWebsite] = useState("")
  const [entries, setEntries] = useState([])
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    checkVaultInitialization()
  }, [])

  const checkVaultInitialization = async () => {
    const initialized = await vaultService.isInitialized()
    setIsInitialized(initialized)
  }

  const handleUnlock = async () => {
    try {
      if (!isInitialized) {
        if (masterPassword !== confirmPassword) {
          setError("Passwords don't match")
          return
        }
        if (masterPassword.length < 8) {
          setError("Password must be at least 8 characters")
          return
        }
        await vaultService.initializeVault(masterPassword)
        setIsInitialized(true)
      }
      
      const vaultEntries = await vaultService.getEntries(masterPassword)
      setEntries(vaultEntries)
      setIsUnlocked(true)
      setError("")
    } catch (error) {
      setError("Invalid master password")
    }
  }

  const handleAddEntry = async () => {
    try {
      await vaultService.addEntry(
        { username, password, website },
        masterPassword
      )
      const updatedEntries = await vaultService.getEntries(masterPassword)
      setEntries(updatedEntries)
      setUsername("")
      setPassword("")
      setWebsite("")
      setError("")
    } catch (error) {
      setError("Failed to add entry")
    }
  }

  const togglePasswordVisibility = (index: number) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  if (!isUnlocked) {
    return (
      <div className="plasmo-p-4">
        <div className="plasmo-mb-4">
          <h3 className="plasmo-font-bold plasmo-mb-2">
            {isInitialized ? "Unlock Vault" : "Create Master Password"}
          </h3>
          <p className="plasmo-text-sm plasmo-text-gray-600 plasmo-mb-4">
            {isInitialized 
              ? "Enter your master password to access your vault"
              : "Choose a strong master password to secure your vault. You'll need this to access your passwords."}
          </p>
        </div>

        <input
          type="password"
          placeholder="Enter master password"
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          className="plasmo-w-full plasmo-p-2 plasmo-border plasmo-rounded plasmo-mb-2"
        />

        {!isInitialized && (
          <input
            type="password"
            placeholder="Confirm master password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="plasmo-w-full plasmo-p-2 plasmo-border plasmo-rounded plasmo-mb-2"
          />
        )}

        {error && (
          <p className="plasmo-text-red-500 plasmo-text-sm plasmo-mb-2">{error}</p>
        )}

        <button
          onClick={handleUnlock}
          className="plasmo-w-full plasmo-bg-blue-600 plasmo-text-white plasmo-p-2 plasmo-rounded hover:plasmo-bg-blue-700">
          {isInitialized ? "Unlock Vault" : "Create Vault"}
        </button>
      </div>
    )
  }

  return (
    <div className="plasmo-p-4">
      <div className="plasmo-mb-4">
        <input
          type="text"
          placeholder="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="plasmo-w-full plasmo-p-2 plasmo-border plasmo-rounded plasmo-mb-2"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="plasmo-w-full plasmo-p-2 plasmo-border plasmo-rounded plasmo-mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="plasmo-w-full plasmo-p-2 plasmo-border plasmo-rounded plasmo-mb-2"
        />
        <button
          onClick={handleAddEntry}
          className="plasmo-w-full plasmo-bg-blue-600 plasmo-text-white plasmo-p-2 plasmo-rounded hover:plasmo-bg-blue-700">
          Add Entry
        </button>
      </div>

      <div className="plasmo-mt-4">
        <h3 className="plasmo-font-bold plasmo-mb-2">Stored Passwords</h3>
        {entries.map((entry, index) => (
          <div key={index} className="plasmo-bg-gray-100 plasmo-p-3 plasmo-rounded plasmo-mb-2">
            <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
              <div className="plasmo-font-bold plasmo-text-blue-700">{entry.website}</div>
              <button
                onClick={() => togglePasswordVisibility(index)}
                className="plasmo-text-gray-500 hover:plasmo-text-gray-700 plasmo-text-sm">
                {visiblePasswords[index] ? "Hide" : "Show"}
              </button>
            </div>
            
            <div className="plasmo-mt-2 plasmo-space-y-1">
              <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                <div className="plasmo-text-sm plasmo-text-gray-600">
                  Username: {entry.username}
                </div>
                <button
                  onClick={() => copyToClipboard(entry.username)}
                  className="plasmo-text-blue-600 hover:plasmo-text-blue-700 plasmo-text-sm">
                  Copy
                </button>
              </div>

              <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                <div className="plasmo-text-sm plasmo-text-gray-600">
                  Password:{' '}
                  <span className="plasmo-font-mono">
                    {visiblePasswords[index] ? entry.password : '••••••••'}
                  </span>
                </div>
                <div className="plasmo-flex plasmo-gap-2">
                  <button
                    onClick={() => copyToClipboard(entry.password)}
                    className="plasmo-text-blue-600 hover:plasmo-text-blue-700 plasmo-text-sm">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="plasmo-text-center plasmo-text-gray-500 plasmo-py-4">
            No passwords stored yet
          </div>
        )}
      </div>
    </div>
  )
} 