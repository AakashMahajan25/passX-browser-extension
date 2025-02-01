import React, { useState } from "react"

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export function GeneratePassword() {
  const [password, setPassword] = useState("")
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  })
  const [copied, setCopied] = useState(false)

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

    let chars = ""
    if (options.includeUppercase) chars += uppercase
    if (options.includeLowercase) chars += lowercase
    if (options.includeNumbers) chars += numbers
    if (options.includeSymbols) chars += symbols

    if (chars === "") return

    let generatedPassword = ""
    for (let i = 0; i < options.length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      generatedPassword += chars[randomIndex]
    }

    setPassword(generatedPassword)
    setCopied(false)
  }

  const copyToClipboard = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-4 plasmo-p-4">
      <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
        <label className="plasmo-flex plasmo-justify-between plasmo-items-center">
          Length: {options.length}
          <input
            type="range"
            min="8"
            max="32"
            value={options.length}
            onChange={(e) =>
              setOptions({ ...options, length: parseInt(e.target.value) })
            }
            className="plasmo-w-32"
          />
        </label>
        
        <label className="plasmo-flex plasmo-items-center plasmo-gap-2">
          <input
            type="checkbox"
            checked={options.includeUppercase}
            onChange={(e) =>
              setOptions({ ...options, includeUppercase: e.target.checked })
            }
          />
          Uppercase Letters
        </label>

        <label className="plasmo-flex plasmo-items-center plasmo-gap-2">
          <input
            type="checkbox"
            checked={options.includeLowercase}
            onChange={(e) =>
              setOptions({ ...options, includeLowercase: e.target.checked })
            }
          />
          Lowercase Letters
        </label>

        <label className="plasmo-flex plasmo-items-center plasmo-gap-2">
          <input
            type="checkbox"
            checked={options.includeNumbers}
            onChange={(e) =>
              setOptions({ ...options, includeNumbers: e.target.checked })
            }
          />
          Numbers
        </label>

        <label className="plasmo-flex plasmo-items-center plasmo-gap-2">
          <input
            type="checkbox"
            checked={options.includeSymbols}
            onChange={(e) =>
              setOptions({ ...options, includeSymbols: e.target.checked })
            }
          />
          Symbols
        </label>
      </div>

      <button
        onClick={generatePassword}
        className="plasmo-bg-blue-600 plasmo-text-white plasmo-p-2 plasmo-rounded hover:plasmo-bg-blue-700">
        Generate Password
      </button>

      {password && (
        <div className="plasmo-flex plasmo-gap-2 plasmo-items-center plasmo-bg-gray-100 plasmo-p-2 plasmo-rounded">
          <input
            type="text"
            value={password}
            readOnly
            className="plasmo-flex-1 plasmo-bg-transparent plasmo-outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="plasmo-text-blue-600 hover:plasmo-text-blue-700">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  )
}
