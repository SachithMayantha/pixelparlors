"use client"

import { useEffect, useRef } from "react"

interface TextLogProps {
  logs: { text: string; type: string }[]
}

export default function TextLog({ logs }: TextLogProps) {
  const logRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the bottom when logs update
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTo({
        top: logRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [logs])

  const getTextColor = (type: string) => {
    switch (type) {
      case "system":
        return "text-accent-green"
      case "error":
        return "text-danger-red"
      case "input":
        return "text-accent-gold italic"
      case "description":
        return "text-fg-text"
      case "hint":
        return "text-accent-gold"
      case "inventory":
        return "text-accent-gold"
      case "movement":
        return "text-accent-green"
      case "command":
        return "text-accent-green"
      default:
        return "text-fg-text"
    }
  }

  return (
    <div ref={logRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-5" aria-live="polite">
      {logs.map((log, index) => (
        <div key={index} className={`mb-2 ${getTextColor(log.type)}`}>
          {log.text}
        </div>
      ))}
    </div>
  )
}
