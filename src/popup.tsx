import React, { useState, useEffect } from "react"
import "~style.css"
import { Storage } from "@plasmohq/storage"
import { GeneratePassword } from "~features/generate-password"

function IndexPopup() {
  const storage = new Storage()
  const [isOn, setIsOn] = useState(false)
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false)

  useEffect(() => {
    // Load initial state
    storage.get('isOn').then(value => {
      setIsOn(!!value)
    })

    // Subscribe to changes
    storage.watch({
      'isOn': (c) => {
        setIsOn(!!c.newValue)
      }
    })
  }, [])

  async function toggle() {
    const newState = !isOn
    await storage.set('isOn', newState)
    setIsOn(newState)
  }

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-h-[500px] plasmo-w-[300px] plasmo-bg-slate-100">
      {/* Header */}
      <header className="plasmo-bg-blue-700 plasmo-text-white plasmo-p-4 plasmo-shadow-md">
        <h1 className="plasmo-text-2xl plasmo-font-bold">passX</h1>
        <p className="plasmo-text-sm plasmo-opacity-80">Your Password Manager</p>
      </header>

      {/* Main Content */}
      <main className="plasmo-grow plasmo-flex plasmo-flex-col plasmo-p-4 plasmo-gap-4">
        {showPasswordGenerator ? (
          <div className="plasmo-bg-white plasmo-rounded-lg plasmo-shadow-sm">
            <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-p-4 plasmo-border-b">
              <h2 className="plasmo-text-lg plasmo-font-semibold">Password Generator</h2>
              <button
                onClick={() => setShowPasswordGenerator(false)}
                className="plasmo-text-gray-500 hover:plasmo-text-gray-700">
                ←
              </button>
            </div>
            <GeneratePassword />
          </div>
        ) : (
          <>
            {/* Status Section */}
            <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-bg-white plasmo-p-4 plasmo-rounded-lg plasmo-shadow-sm">
              <p className="plasmo-text-gray-600 plasmo-mb-2">Protection Status</p>
              <button
                onClick={() => toggle()}
                className={`plasmo-relative plasmo-w-24 plasmo-h-24 plasmo-rounded-full plasmo-transition-all plasmo-duration-300 
                  ${isOn ? 'plasmo-bg-blue-700 plasmo-shadow-lg plasmo-shadow-blue-600/50' : 'plasmo-bg-gray-400'}
                  ${isOn ? 'hover:plasmo-bg-blue-600' : 'hover:plasmo-bg-gray-500'}`}
              >
                {isOn && (
                  <div className="plasmo-absolute plasmo-inset-0 plasmo-animate-spin">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="plasmo-absolute plasmo-w-2 plasmo-h-8 plasmo-bg-blue-400/50"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                          transformOrigin: '50% 50%'
                        }}
                      />
                    ))}
                  </div>
                )}
                <div className={`plasmo-relative plasmo-z-10 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-text-white plasmo-font-bold
                  ${isOn ? 'plasmo-text-white' : 'plasmo-text-gray-200'}`}>
                  {isOn ? 'ON' : 'OFF'}
                </div>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="plasmo-bg-white plasmo-p-4 plasmo-rounded-lg plasmo-shadow-sm">
              <h2 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-3">Quick Actions</h2>
              <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-2">
                <button 
                  onClick={() => setShowPasswordGenerator(true)}
                  className="plasmo-p-2 plasmo-bg-blue-50 plasmo-text-blue-700 plasmo-rounded hover:plasmo-bg-blue-100">
                  Generate Password
                </button>
                <button className="plasmo-p-2 plasmo-bg-blue-50 plasmo-text-blue-700 plasmo-rounded hover:plasmo-bg-blue-100">
                  View Vault
                </button>
                <button className="plasmo-p-2 plasmo-bg-blue-50 plasmo-text-blue-700 plasmo-rounded hover:plasmo-bg-blue-100">
                  Auto-fill
                </button>
                <button className="plasmo-p-2 plasmo-bg-blue-50 plasmo-text-blue-700 plasmo-rounded hover:plasmo-bg-blue-100">
                  Settings
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="plasmo-p-2 plasmo-text-center plasmo-text-sm plasmo-text-gray-500 plasmo-bg-white plasmo-border-t">
        passX v1.0.0
      </footer>
    </div>
  )
}

export default IndexPopup
