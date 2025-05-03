"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useSound } from "./SoundManager"

interface CommandInputProps {
  onCommand: (command: string) => void
}

export default function CommandInput({ onCommand }: CommandInputProps) {
  const [command, setCommand] = useState("")
  const [isFocused, setIsFocused] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const { play } = useSound()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (command.trim()) {
      // Play typing sound when submitting command
      play("select")
      onCommand(command)
      setCommand("")

      // Immediately focus the input after submitting
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          setIsFocused(true)
        }
      }, 10)
    }
  }

  // Play subtle typing sounds when typing
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") {
      // We don't want to play for every keystroke as it would be too noisy
      // Instead, play randomly for some keystrokes to create a more natural effect
      if (Math.random() > 0.7) {
        play("select")
      }
    }
  }

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      setIsFocused(true)
    }
  }, [])

  // Re-focus input when clicking anywhere in the command area
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
      setIsFocused(true)
    }
  }

  // Handle focus and blur events
  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  // Set up a periodic focus check
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.activeElement !== inputRef.current) {
        if (inputRef.current) {
          inputRef.current.focus()
          setIsFocused(true)
        }
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-gray-800 h-10 px-3 border-t border-gray-700 relative"
      onClick={handleContainerClick}
    >
      <span className="text-accent-green text-sm">›</span>
      <input
        ref={inputRef}
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex-1 bg-transparent outline-none text-xs text-fg-text w-full"
        placeholder=""
        autoFocus
        autoComplete="off"
        spellCheck="false"
        aria-label="Command input"
      />
      {command === "" && (
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 pointer-events-none text-xs text-gray-500">
          Type a command...
        </div>
      )}
    </form>
  )
}
