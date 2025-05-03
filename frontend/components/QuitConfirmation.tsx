"use client"

import Link from "next/link"
import { useSound } from "./SoundManager"

interface QuitConfirmationProps {
  onClose: () => void
}

export default function QuitConfirmation({ onClose }: QuitConfirmationProps) {
  const { play } = useSound()

  const handleClose = () => {
    play("select")
    onClose()
  }

  const handleQuit = () => {
    play("error")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-danger-red max-w-sm w-full p-6">
        <h2 className="text-danger-red text-center mb-6">QUIT GAME?</h2>

        <p className="text-center text-sm mb-6">Are you sure you want to quit? Your progress will not be saved.</p>

        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="px-4 py-2 bg-danger-red text-white hover:bg-red-700 transition-colors text-xs"
            onClick={handleQuit}
          >
            QUIT GAME
          </Link>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 transition-colors text-xs"
          >
            CONTINUE PLAYING
          </button>
        </div>
      </div>
    </div>
  )
}
