"use client"

import { useSound } from "./SoundManager"

interface WinModalProps {
  onRestart: () => void
}

export default function WinModal({ onRestart }: WinModalProps) {
  const { play } = useSound()

  const handleRestart = () => {
    play("select")
    onRestart()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-accent-green max-w-md w-full p-6 relative">
        <h2 className="text-accent-gold text-center text-xl mb-6">VICTORY!</h2>

        <div className="space-y-4 text-sm">
          <p className="text-center">
            You've recovered the legendary Bedrock Relic and escaped the dungeon! Your name will be remembered in the
            halls of heroes.
          </p>

          <div className="border-t border-gray-800 pt-4 text-center">
            <p className="text-xs text-gray-500 mb-4">
              "The Relic's power is now yours, but greater adventures await..."
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-accent-gold text-bg-dark hover:bg-accent-green transition-colors text-xs"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    </div>
  )
}
