// Core game types

export interface Position {
  x: number
  y: number
}

export interface Item {
  id: string
  name: string
  description: string
  type: "light" | "heal" | "key" | "relic" | "gold"
}

export interface Room {
  id: string
  pos: Position
  description: string
  exits: {
    north?: string
    south?: string
    east?: string
    west?: string
  }
  items: Item[]
  hazard?: "trap" | "monster"
  visited: boolean
  dark?: boolean
}

export interface Monster {
  id: string
  name: string
  description: string
  hp: number
  damage: number
}

export interface GameState {
  player: {
    position: Position
    health: number
    maxHealth: number
    inventory: Item[]
    maxInventory: number
    lightRadius: number
  }
  dungeon: {
    rooms: Record<string, Room>
    depth: number
    hasRelic: boolean
    exitRevealed: boolean
  }
  currentMonster?: Monster
  turns: number
}
