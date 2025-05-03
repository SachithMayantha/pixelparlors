import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PIXEL PARLORS",
  description: "A self-rewriting 8-bit adventure",
}

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-dark text-fg-text p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-fadeIn">
        <div className="pixel-logo mx-auto w-16 h-16 mb-6">
          <div className="w-16 h-16 bg-accent-green relative overflow-hidden">
            <div className="absolute w-4 h-4 bg-bg-dark left-3 top-3"></div>
            <div className="absolute w-4 h-4 bg-bg-dark right-3 top-3"></div>
            <div className="absolute w-8 h-2 bg-bg-dark left-4 top-9"></div>
            <div className="absolute w-10 h-2 bg-accent-gold left-3 bottom-3 rounded-sm"></div>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">PIXEL PARLORS</h1>

        <p className="text-sm mb-8 opacity-80">
          A self-rewriting 8-bit adventure forged with{" "}
          <span className="text-accent-gold font-bold">Amazon Q Developer</span>.
        </p>

        <div className="crt-scanline"></div>

        <Link
          href="/game"
          className="inline-block px-6 py-3 text-bg-dark bg-accent-gold hover:bg-accent-green transition-colors duration-300 font-bold text-sm tracking-wider"
        >
          START ADVENTURE →
        </Link>

        <div className="mt-12 text-xs opacity-50 pixel-text">Press [ESC] to access menu</div>
      </div>
    </div>
  )
}
