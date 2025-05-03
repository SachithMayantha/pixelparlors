"use client"

import type React from "react"

import { useState } from "react"
import { useSound } from "./SoundManager"

export default function VolumeControl() {
  const { volume, setVolume, play } = useSound()
  const [isOpen, setIsOpen] = useState(false)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (Math.random() > 0.5) {
      play("select")
    }
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    play("menu")
  }

  return (
    <div className="relative">
      <button onClick={toggleOpen} className="text-xs text-gray-400 hover:text-accent-green">
        VOL
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-gray-900 border border-gray-800 p-2 rounded-sm w-32">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-accent-green"
          />
          <div className="flex justify-between text-[8px] mt-1">
            <span>0%</span>
            <span>{Math.round(volume * 100)}%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  )
}
