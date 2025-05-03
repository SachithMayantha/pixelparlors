"use client"

import { useSound } from "./SoundManager"
import { Volume2, VolumeX } from "lucide-react"

export default function SoundToggle() {
  const { isMuted, toggleMute, play } = useSound()

  const handleToggle = () => {
    toggleMute()
    play("select")
  }

  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-center w-8 h-8 text-fg-text hover:text-accent-green transition-colors"
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
    >
      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  )
}
