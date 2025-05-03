"use client"

import { useState, useEffect, useCallback } from "react"
import HeaderBar from "@/components/HeaderBar"
import MapCanvas from "@/components/MapCanvas"
import TextLog from "@/components/TextLog"
import CommandInput from "@/components/CommandInput"
import InventoryPanel from "@/components/InventoryPanel"
import AboutModal from "@/components/AboutModal"
import QuitConfirmation from "@/components/QuitConfirmation"
import GameOverModal from "@/components/GameOverModal"
import WinModal from "@/components/WinModal"
import { useSound } from "@/components/SoundManager"
import { generateDungeon } from "@/utils/dungeon-generator"
import {
  movePlayer,
  lookAround,
  takeItem,
  useItem,
  attackMonster,
  showStats,
  showInventory,
  fleeFromCombat,
} from "@/utils/game-actions"
import type { GameState } from "@/types/game"

export default function GamePage() {
  const { play } = useSound()
  const [gameState, setGameState] = useState<GameState>(() => generateDungeon(5))
  const [logs, setLogs] = useState<{ text: string; type: string }[]>([
    { text: "Welcome to PIXEL PARLORS!", type: "system" },
    { text: "You find yourself in a dimly lit dungeon. Your quest for the Bedrock Relic begins.", type: "description" },
    { text: "Type 'help' to see available commands.", type: "hint" },
  ])

  const [showAbout, setShowAbout] = useState(false)
  const [showQuit, setShowQuit] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showWin, setShowWin] = useState(false)

  // Add a log entry
  const addLog = (text: string, type: string) => {
    setLogs((prev) => [{ text, type }, ...prev])
  }

  // Process game command
  const handleCommand = useCallback(
    (command: string) => {
      // Add the command to the log
      addLog(`Command: ${command}`, "input")

      // Process command and update game state
      const cmd = command.toLowerCase().trim()

      // Split command into parts (for commands with arguments)
      const parts = cmd.split(" ")
      const mainCommand = parts[0]

      // Handle different commands
      switch (mainCommand) {
        case "help":
          play("select")
          addLog("Available commands:", "system")
          addLog("look - Examine your surroundings", "command")
          addLog("go [north|south|east|west] - Move in a direction", "command")
          addLog("take [item] - Pick up an item", "command")
          addLog("use [item] - Use an item from your inventory", "command")
          addLog("attack - Attack a monster", "command")
          addLog("flee - Try to escape from combat", "command")
          addLog("inventory - Check your items", "command")
          addLog("stats - Show your current stats", "command")
          addLog("about - Show game information", "command")
          addLog("quit - Exit the game", "command")
          break

        case "look":
          play("look")
          const lookResult = lookAround(gameState)
          setGameState(lookResult.newState)
          addLog(lookResult.message, "description")
          break

        case "go":
          if (parts.length < 2) {
            play("error")
            addLog("Go where? Try 'go north', 'go south', 'go east', or 'go west'.", "error")
            break
          }

          const direction = parts[1]
          if (!["north", "south", "east", "west", "up"].includes(direction)) {
            play("error")
            addLog(`I don't understand that direction: ${direction}`, "error")
            break
          }

          // Check if in combat
          if (gameState.currentMonster) {
            play("error")
            addLog("You can't move while in combat! Try 'attack' or 'flee'.", "error")
            break
          }

          const moveResult = movePlayer(gameState, direction)
          setGameState(moveResult.newState)

          // Check for win condition
          if (moveResult.message.includes("You've won!")) {
            play("success")
            addLog(moveResult.message, "success")
            setShowWin(true)
            break
          }

          // Check for game over
          if (moveResult.message.includes("GAME OVER")) {
            play("damage")
            addLog(moveResult.message, "error")
            setShowGameOver(true)
            break
          }

          // Normal movement
          if (moveResult.message.includes("You triggered a trap!")) {
            play("damage")
            addLog(moveResult.message, "error")
          } else if (moveResult.message.includes("You encounter")) {
            play("error")
            addLog(moveResult.message, "error")
          } else {
            play("move")
            addLog(moveResult.message, "description")
          }
          break

        case "take":
          if (parts.length < 2) {
            play("error")
            addLog("Take what? Try 'take [item name]'.", "error")
            break
          }

          // Check if in combat
          if (gameState.currentMonster) {
            play("error")
            addLog("You can't take items while in combat! Try 'attack' or 'flee'.", "error")
            break
          }

          const itemName = parts.slice(1).join(" ")
          const takeResult = takeItem(gameState, itemName)
          setGameState(takeResult.newState)

          if (takeResult.message.includes("pick up")) {
            play("pickup")
            addLog(takeResult.message, "success")
          } else {
            play("error")
            addLog(takeResult.message, "error")
          }
          break

        case "use":
          if (parts.length < 2) {
            play("error")
            addLog("Use what? Try 'use [item name]'.", "error")
            break
          }

          const useItemName = parts.slice(1).join(" ")
          const useResult = useItem(gameState, useItemName)
          setGameState(useResult.newState)

          if (useResult.message.includes("restore") || useResult.message.includes("illuminating")) {
            play("heal")
            addLog(useResult.message, "success")
          } else {
            play("select")
            addLog(useResult.message, "description")
          }
          break

        case "attack":
          if (!gameState.currentMonster) {
            play("error")
            addLog("There's nothing to attack here.", "error")
            break
          }

          const attackResult = attackMonster(gameState)
          setGameState(attackResult.newState)

          // Check for game over
          if (attackResult.message.includes("GAME OVER")) {
            play("damage")
            addLog(attackResult.message, "error")
            setShowGameOver(true)
            break
          }

          if (attackResult.message.includes("hit") && !attackResult.message.includes("miss")) {
            play("success")
            addLog(attackResult.message, "success")
          } else {
            play("damage")
            addLog(attackResult.message, "error")
          }
          break

        case "flee":
          if (!gameState.currentMonster) {
            play("error")
            addLog("There's nothing to flee from.", "error")
            break
          }

          const fleeResult = fleeFromCombat(gameState)
          setGameState(fleeResult.newState)

          // Check for game over
          if (fleeResult.message.includes("GAME OVER")) {
            play("damage")
            addLog(fleeResult.message, "error")
            setShowGameOver(true)
            break
          }

          if (fleeResult.message.includes("successfully")) {
            play("move")
            addLog(fleeResult.message, "success")
          } else {
            play("damage")
            addLog(fleeResult.message, "error")
          }
          break

        case "inventory":
          play("inventory")
          const inventoryResult = showInventory(gameState)
          setGameState(inventoryResult.newState)

          // Split inventory items into separate log entries
          if (inventoryResult.message.includes("\n")) {
            const [header, ...items] = inventoryResult.message.split("\n")
            addLog(header, "inventory")
            items.forEach((item) => addLog(item, "inventory"))
          } else {
            addLog(inventoryResult.message, "inventory")
          }
          break

        case "stats":
          play("select")
          const statsResult = showStats(gameState)
          setGameState(statsResult.newState)
          addLog(statsResult.message, "system")
          break

        case "about":
          play("menu")
          setShowAbout(true)
          break

        case "quit":
          play("menu")
          setShowQuit(true)
          break

        default:
          play("error")
          addLog("I don't understand that command. Type 'help' for assistance.", "error")
      }
    },
    [gameState, play, addLog, setGameState, setShowAbout, setShowQuit, setShowGameOver, setShowWin],
  )

  // Handle escape key for menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Make sure play is available before calling it
        if (typeof play === "function") {
          play("menu")
        }
        setShowAbout(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [play, setShowAbout])

  // Start a new game
  const startNewGame = () => {
    const newGameState = generateDungeon(5)
    setGameState(newGameState)
    setLogs([
      { text: "Welcome to PIXEL PARLORS!", type: "system" },
      {
        text: "You find yourself in a dimly lit dungeon. Your quest for the Bedrock Relic begins.",
        type: "description",
      },
      { text: "Type 'help' to see available commands.", type: "hint" },
    ])
    setShowGameOver(false)
    setShowWin(false)
  }

  return (
    <div className="flex flex-col h-screen bg-bg-dark text-fg-text">
      <HeaderBar health={gameState.player.health} />

      <div className="flex-1 overflow-hidden max-w-6xl mx-auto w-full grid grid-cols-[16rem_1fr_10rem]">
        <MapCanvas gameState={gameState} currentRoom={gameState.player.position} />

        <div className="flex flex-col h-full">
          <TextLog logs={logs} />
          <CommandInput onCommand={handleCommand} />
        </div>

        <InventoryPanel items={gameState.player.inventory} />
      </div>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showQuit && <QuitConfirmation onClose={() => setShowQuit(false)} />}
      {showGameOver && <GameOverModal onRestart={startNewGame} />}
      {showWin && <WinModal onRestart={startNewGame} />}
    </div>
  )
}
