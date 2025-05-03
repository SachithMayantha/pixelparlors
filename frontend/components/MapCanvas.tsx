"use client"

import { useEffect, useRef } from "react"
import type { GameState, Position } from "@/types/game"
import { isRoomVisible } from "@/utils/dungeon-generator"

interface MapCanvasProps {
  gameState: GameState
  currentRoom: Position
}

export default function MapCanvas({ gameState, currentRoom }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#0d0d0d"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const tileSize = 32
    const centerX = canvas.width / 2 - tileSize / 2
    const centerY = canvas.height / 2 - tileSize / 2

    // Calculate offset to center the player
    const offsetX = centerX - currentRoom.x * tileSize
    const offsetY = centerY - currentRoom.y * tileSize

    // Draw all rooms
    Object.values(gameState.dungeon.rooms).forEach((room) => {
      // Check if room is visible
      if (!isRoomVisible(gameState, room.pos)) return

      const x = room.pos.x * tileSize + offsetX
      const y = room.pos.y * tileSize + offsetY

      // Skip if outside canvas
      if (x < -tileSize || y < -tileSize || x > canvas.width || y > canvas.height) return

      // Draw room background
      if (room.dark) {
        ctx.fillStyle = "#111111"
      } else {
        ctx.fillStyle = "#1a1a1a"
      }

      ctx.fillRect(x, y, tileSize, tileSize)

      // Draw room border
      ctx.strokeStyle = "#0d0d0d"
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, tileSize, tileSize)

      // Draw room contents
      if (room.items.length > 0) {
        // Check for relic
        const hasRelic = room.items.some((item) => item.type === "relic")

        if (hasRelic) {
          // Draw relic symbol (gold star)
          ctx.fillStyle = "#f9d849"
          const starSize = 8
          const starX = x + tileSize / 2
          const starY = y + tileSize / 2

          // Simple star
          ctx.beginPath()
          for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
            const outerX = starX + Math.cos(angle) * starSize
            const outerY = starY + Math.sin(angle) * starSize

            if (i === 0) {
              ctx.moveTo(outerX, outerY)
            } else {
              ctx.lineTo(outerX, outerY)
            }

            const innerAngle = angle + Math.PI / 5
            const innerX = starX + Math.cos(innerAngle) * (starSize / 2)
            const innerY = starY + Math.sin(innerAngle) * (starSize / 2)

            ctx.lineTo(innerX, innerY)
          }
          ctx.closePath()
          ctx.fill()
        } else {
          // Draw item symbol (blue square)
          ctx.fillStyle = "#4287f5"
          ctx.fillRect(x + tileSize / 2 - 3, y + tileSize / 2 - 3, 6, 6)
        }
      }

      // Draw hazards
      if (room.hazard === "trap") {
        // Draw trap symbol (red triangle)
        ctx.fillStyle = "#ff4b4b"
        ctx.beginPath()
        ctx.moveTo(x + tileSize / 2, y + tileSize / 2 - 5)
        ctx.lineTo(x + tileSize / 2 - 5, y + tileSize / 2 + 3)
        ctx.lineTo(x + tileSize / 2 + 5, y + tileSize / 2 + 3)
        ctx.closePath()
        ctx.fill()
      } else if (room.hazard === "monster") {
        // Draw monster symbol (pixel monster)
        ctx.fillStyle = "#ff4b4b"

        // Simple pixel monster face
        ctx.fillRect(x + tileSize / 2 - 4, y + tileSize / 2 - 2, 2, 2) // Left eye
        ctx.fillRect(x + tileSize / 2 + 2, y + tileSize / 2 - 2, 2, 2) // Right eye
        ctx.fillRect(x + tileSize / 2 - 3, y + tileSize / 2 + 2, 6, 2) // Mouth
      }

      // Draw exit if revealed
      if (room.exits.up === "exit") {
        // Draw exit symbol (gold star)
        ctx.fillStyle = "#f9d849"
        const starSize = 10
        const starX = x + tileSize / 2
        const starY = y + tileSize / 2

        // Simple star
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
          const outerX = starX + Math.cos(angle) * starSize
          const outerY = starY + Math.sin(angle) * starSize

          if (i === 0) {
            ctx.moveTo(outerX, outerY)
          } else {
            ctx.lineTo(outerX, outerY)
          }

          const innerAngle = angle + Math.PI / 5
          const innerX = starX + Math.cos(innerAngle) * (starSize / 2)
          const innerY = starY + Math.sin(innerAngle) * (starSize / 2)

          ctx.lineTo(innerX, innerY)
        }
        ctx.closePath()
        ctx.fill()
      }
    })

    // Draw current room highlight with pulsing effect
    const drawHighlight = () => {
      const time = Date.now() / 1000
      const pulseIntensity = ((Math.sin(time * 4) + 1) / 2) * 0.5 + 0.5

      const x = currentRoom.x * tileSize + offsetX
      const y = currentRoom.y * tileSize + offsetY

      ctx.strokeStyle = `rgba(33, 227, 110, ${pulseIntensity})`
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, tileSize, tileSize)

      requestAnimationFrame(drawHighlight)
    }

    const animationId = requestAnimationFrame(drawHighlight)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [gameState, currentRoom])

  return (
    <div className="w-64 h-[calc(100vh-3rem)] border-r-2 border-gray-800 bg-gray-900 relative overflow-hidden">
      <canvas ref={canvasRef} width={256} height={256} className="w-full h-full" />
      <div className="absolute bottom-2 right-2 text-[8px] text-gray-500">
        [{currentRoom.x},{currentRoom.y}]
      </div>
    </div>
  )
}
