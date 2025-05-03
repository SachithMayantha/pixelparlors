"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

// Define sound types
type SoundType = "move" | "error" | "menu" | "select" | "inventory" | "look" | "pickup" | "damage" | "heal" | "success"

// Create context
type SoundContextType = {
  play: (sound: SoundType) => void
  isMuted: boolean
  toggleMute: () => void
  volume: number
  setVolume: (volume: number) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

// Sound provider component
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize audio context after user interaction
  const initialize = useCallback(() => {
    if (isInitialized || typeof window === "undefined") return

    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(context)
      setIsInitialized(true)
    } catch (error) {
      console.error("Web Audio API is not supported in this browser", error)
    }
  }, [isInitialized])

  // Generate sound based on type
  const generateSound = useCallback(
    (type: SoundType) => {
      if (!audioContext || isMuted) return

      try {
        // Create oscillator and gain nodes
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        // Connect nodes
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        // Set volume
        gainNode.gain.value = volume * 0.2 // Reduce overall volume

        // Configure sound based on type
        switch (type) {
          case "move":
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
            oscillator.frequency.linearRampToValueAtTime(880, audioContext.currentTime + 0.1)
            gainNode.gain.setValueAtTime(volume * 0.2, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.2)
            break

          case "error":
            oscillator.type = "sawtooth"
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
            oscillator.frequency.linearRampToValueAtTime(100, audioContext.currentTime + 0.2)
            gainNode.gain.setValueAtTime(volume * 0.2, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.2)
            break

          case "menu":
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(330, audioContext.currentTime)
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.1)
            gainNode.gain.setValueAtTime(volume * 0.2, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.2)
            break

          case "select":
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(660, audioContext.currentTime)
            gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.1)
            break

          case "inventory":
            oscillator.type = "triangle"
            oscillator.frequency.setValueAtTime(330, audioContext.currentTime)
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.1)
            oscillator.frequency.setValueAtTime(550, audioContext.currentTime + 0.2)
            gainNode.gain.setValueAtTime(volume * 0.2, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.3)
            break

          case "look":
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
            oscillator.frequency.setValueAtTime(494, audioContext.currentTime + 0.1)
            gainNode.gain.setValueAtTime(volume * 0.15, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.2)
            break

          case "pickup":
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime)
            oscillator.frequency.linearRampToValueAtTime(1320, audioContext.currentTime + 0.1)
            gainNode.gain.setValueAtTime(volume * 0.15, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.2)
            break

          case "damage":
            oscillator.type = "sawtooth"
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime)
            oscillator.frequency.linearRampToValueAtTime(110, audioContext.currentTime + 0.2)
            gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.3)
            break

          case "heal":
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime)
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1)
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2)
            gainNode.gain.setValueAtTime(volume * 0.15, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.3)
            break

          case "success":
            oscillator.type = "triangle"
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime)
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1)
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2)
            gainNode.gain.setValueAtTime(volume * 0.2, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.4)
            break

          default:
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
            gainNode.gain.setValueAtTime(volume * 0.2, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.1)
        }
      } catch (error) {
        console.error("Error generating sound:", error)
      }
    },
    [audioContext, isMuted, volume],
  )

  // Play sound effect
  const play = useCallback(
    (sound: SoundType) => {
      if (!isInitialized) {
        initialize()
        return
      }

      generateSound(sound)
    },
    [generateSound, initialize, isInitialized],
  )

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  // Add initialization listener
  useEffect(() => {
    if (typeof window === "undefined") return

    const initializeAudio = () => {
      initialize()
      // Remove listeners after initialization
      document.removeEventListener("click", initializeAudio)
      document.removeEventListener("keydown", initializeAudio)
    }

    document.addEventListener("click", initializeAudio)
    document.addEventListener("keydown", initializeAudio)

    return () => {
      document.removeEventListener("click", initializeAudio)
      document.removeEventListener("keydown", initializeAudio)
    }
  }, [initialize])

  return (
    <SoundContext.Provider value={{ play, isMuted, toggleMute, volume, setVolume }}>{children}</SoundContext.Provider>
  )
}

// Hook to use sound
export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}
