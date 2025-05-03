"use client"

import Link from "next/link"
import SoundToggle from "./SoundToggle"
import { useSound } from "./SoundManager"

interface HeaderBarProps {
  health: number
}

export default function HeaderBar({ health }: HeaderBarProps) {
  const { play } = useSound()

  const handleMenuClick = () => {
    play("menu")
  }

  return (
    <header className="flex items-center justify-between h-12 px-4 bg-gray-900 border-b border-accent-green overflow-hidden">
      <div className="flex items-center">
        <div className="w-6 h-6 bg-accent-green relative mr-3">
          <div className="absolute w-1.5 h-1.5 bg-bg-dark left-1 top-1"></div>
          <div className="absolute w-1.5 h-1.5 bg-bg-dark right-1 top-1"></div>
          <div className="absolute w-3 h-1 bg-bg-dark left-1.5 top-3"></div>
          <div className="absolute w-4 h-1 bg-accent-gold left-1 bottom-1"></div>
        </div>
        <Link href="/" className="text-xs hover:text-accent-green transition-colors" onClick={handleMenuClick}>
          MENU
        </Link>
      </div>

      <div className="text-center text-xs tracking-widest">PIXEL PARLORS</div>

      <div className="flex items-center gap-3">
        <SoundToggle />
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`inline-flex items-center justify-center ${i < health ? "text-danger-red" : "text-gray-700"}`}
              role="img"
              aria-label={i < health ? "full heart" : "empty heart"}
            >
              ❤
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
