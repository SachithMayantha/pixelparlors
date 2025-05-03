"use client"

import { useSound } from "./SoundManager"

interface GameOverModalProps {
  onRestart: () => void
}

export default function GameOverModal({ onRestart }: GameOverModalProps) {
  const { play } = useSound()

  const handleRestart = () => {
    play("select")
    onRestart()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-danger-red max-w-md w-full p-6 relative">
        <h2 className="text-danger-red text-center text-xl mb-6">GAME OVER</h2>

        <div className="space-y-4 text-sm">
          <p className="text-center">
            Your quest for the Bedrock Relic has come to an end. The dungeon claims another adventurer...
          </p>

          <div className="border-t border-gray-800 pt-4 text-center">
            <p className="text-xs text-gray-500 mb-4">
              "Even in defeat, the journey continues. The Relic awaits another hero."
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-danger-red text-white hover:bg-red-700 transition-colors text-xs"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    </div>
  )
}
