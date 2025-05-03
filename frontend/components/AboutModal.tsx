"use client"

import { useSound } from "./SoundManager"

interface AboutModalProps {
  onClose: () => void
}

export default function AboutModal({ onClose }: AboutModalProps) {
  const { play } = useSound()

  const handleClose = () => {
    play("select")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-accent-green max-w-md w-full p-6 relative">
        <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-accent-green">
          [X]
        </button>

        <h2 className="text-accent-gold text-lg mb-4">ABOUT PIXEL PARLORS</h2>

        <div className="space-y-4 text-sm">
          <p>
            A self-rewriting 8-bit adventure game where you explore procedurally-generated dungeons in search of the
            legendary Bedrock Relic.
          </p>

          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-accent-green mb-2">HOW TO PLAY</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-accent-gold">Objective:</span> Find the Bedrock Relic and escape through the exit
                stairs.
              </li>
              <li>
                <span className="text-accent-gold">Movement:</span> Use 'go north/south/east/west' to navigate.
              </li>
              <li>
                <span className="text-accent-gold">Items:</span> Use 'take [item]' to collect items and 'use [item]' to
                use them.
              </li>
              <li>
                <span className="text-accent-gold">Combat:</span> Use 'attack' to fight monsters or 'flee' to try
                escaping.
              </li>
              <li>
                <span className="text-accent-gold">Exploration:</span> Use 'look' to examine your surroundings.
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-800 pt-4 text-center">
            <p className="text-xs text-gray-500">Version 1.0.0 | © 2025 PIXEL PARLORS</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-accent-gold text-bg-dark hover:bg-accent-green transition-colors text-xs"
          >
            RETURN TO GAME
          </button>
        </div>
      </div>
    </div>
  )
}
