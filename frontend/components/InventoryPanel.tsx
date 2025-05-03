"use client"

import { useState } from "react"
import { useSound } from "./SoundManager"
import type { Item } from "@/types/game"

interface InventoryPanelProps {
  items: Item[]
}

export default function InventoryPanel({ items }: InventoryPanelProps) {
  const [activeTab, setActiveTab] = useState<"inventory" | "stats">("inventory")
  const { play } = useSound()

  const handleTabChange = (tab: "inventory" | "stats") => {
    if (tab !== activeTab) {
      play("select")
      setActiveTab(tab)
    }
  }

  const handleItemClick = () => {
    play("inventory")
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case "light":
        return "🔦"
      case "heal":
        return "❤️"
      case "key":
        return "🔑"
      case "relic":
        return "⭐"
      case "gold":
        return "💰"
      default:
        return "📦"
    }
  }

  return (
    <div className="bg-gray-950 p-3 text-xs border-l border-gray-800">
      <div className="flex border-b border-gray-800 mb-3">
        <button
          className={`flex-1 pb-2 text-[10px] ${activeTab === "inventory" ? "text-accent-gold border-b-2 border-accent-gold" : "text-gray-500"}`}
          onClick={() => handleTabChange("inventory")}
        >
          BAG
        </button>
        <button
          className={`flex-1 pb-2 text-[10px] ${activeTab === "stats" ? "text-accent-gold border-b-2 border-accent-gold" : "text-gray-500"}`}
          onClick={() => handleTabChange("stats")}
        >
          HELP
        </button>
      </div>

      {activeTab === "inventory" ? (
        <div className="space-y-3">
          <h3 className="text-[10px] text-gray-500 mb-2">INVENTORY ({items.length}/6)</h3>

          {items.length === 0 ? (
            <div className="text-gray-500 text-[10px]">Empty inventory</div>
          ) : (
            <div className="space-y-2 max-h-[calc(100vh-10rem)] overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="border border-gray-800 p-2 hover:border-accent-green cursor-pointer"
                  onClick={handleItemClick}
                >
                  <div className="text-accent-gold flex items-center gap-1">
                    <span>{getItemIcon(item.type)}</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="text-[8px] text-gray-400 mt-1">{item.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-[10px] text-gray-500 mb-2">QUICK HELP</h3>

          <div className="space-y-2 text-[9px]">
            <div className="mb-2">
              <div className="text-accent-gold mb-1">MAP SYMBOLS</div>
              <div className="flex items-center gap-1 text-fg-text">
                <span className="text-accent-green">□</span> <span>Your position</span>
              </div>
              <div className="flex items-center gap-1 text-fg-text">
                <span className="text-blue-400">■</span> <span>Item</span>
              </div>
              <div className="flex items-center gap-1 text-fg-text">
                <span className="text-danger-red">▲</span> <span>Trap/Monster</span>
              </div>
              <div className="flex items-center gap-1 text-fg-text">
                <span className="text-accent-gold">★</span> <span>Exit/Relic</span>
              </div>
            </div>

            <div className="mb-2">
              <div className="text-accent-gold mb-1">OBJECTIVE</div>
              <div className="text-fg-text">Find the Bedrock Relic and escape through the exit stairs.</div>
            </div>

            <div>
              <div className="text-accent-gold mb-1">COMMANDS</div>
              <div className="text-fg-text">Type 'help' to see all available commands.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
