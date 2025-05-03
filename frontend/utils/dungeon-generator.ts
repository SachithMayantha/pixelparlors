import type { Room, Item, Position, GameState } from "@/types/game"

// Room descriptions for variety
const ROOM_DESCRIPTIONS = [
  "A dimly lit room with cobwebs in the corners. Dust particles dance in the air.",
  "Ancient stone walls surround you. The floor is cracked and worn from centuries of use.",
  "A small chamber with a low ceiling. Water drips somewhere in the distance.",
  "This room smells of damp earth. Moss grows between the stone tiles.",
  "A spacious hall with faded murals on the walls depicting forgotten heroes.",
  "Broken furniture lies scattered about. Someone—or something—was here before you.",
  "The air is stale here. Rusted chains hang from hooks on the wall.",
  "A circular chamber with strange symbols etched into the floor.",
  "This room is unusually cold. Your breath forms small clouds in the air.",
  "Faint whispers seem to emanate from the walls. You can't make out the words.",
  "Shelves line the walls, filled with dusty tomes and strange artifacts.",
  "The floor is uneven here, sloping slightly toward the center of the room.",
  "Tattered banners hang from the ceiling, their insignias long faded.",
  "This chamber appears to have been a kitchen once. Rusted utensils lie about.",
  "A grand room with pillars supporting the ceiling. Echoes follow your footsteps.",
]

// Item templates
const ITEM_TEMPLATES: Item[] = [
  {
    id: "torch",
    name: "Torch",
    description: "A flickering light source that illuminates dark rooms.",
    type: "light",
  },
  {
    id: "health_potion",
    name: "Health Potion",
    description: "A small vial of red liquid that restores 1 heart.",
    type: "heal",
  },
  {
    id: "rusty_key",
    name: "Rusty Key",
    description: "An old key that might unlock something nearby.",
    type: "key",
  },
  {
    id: "golden_key",
    name: "Golden Key",
    description: "An ornate key that seems important.",
    type: "key",
  },
  {
    id: "gold_coin",
    name: "Gold Coin",
    description: "A shiny gold coin. Collect them for a high score.",
    type: "gold",
  },
  {
    id: "bedrock_relic",
    name: "Bedrock Relic",
    description: "The legendary artifact you've been seeking. Find the exit to win!",
    type: "relic",
  },
]

// Monster templates
const MONSTER_NAMES = ["Slime", "Skeleton", "Goblin", "Rat", "Bat", "Spider", "Ghost", "Zombie"]

// Generate a unique room ID from position
export function getRoomId(pos: Position): string {
  return `${pos.x},${pos.y}`
}

// Get room from position
export function getRoomFromPosition(state: GameState, pos: Position): Room | undefined {
  const roomId = getRoomId(pos)
  return state.dungeon.rooms[roomId]
}

// Get a random item (excluding the relic)
function getRandomItem(): Item {
  const itemPool = ITEM_TEMPLATES.filter((item) => item.id !== "bedrock_relic")
  return { ...itemPool[Math.floor(Math.random() * itemPool.length)] }
}

// Get the relic item
export function getRelicItem(): Item {
  return { ...ITEM_TEMPLATES.find((item) => item.id === "bedrock_relic")! }
}

// Generate a new room
function generateRoom(pos: Position, depth: number): Room {
  const descriptionIndex = Math.floor(Math.random() * ROOM_DESCRIPTIONS.length)

  // Determine if room has items (30% chance)
  const hasItems = Math.random() < 0.3

  // Determine if room has hazard (20% chance for trap, 15% chance for monster)
  let hazard: "trap" | "monster" | undefined = undefined
  const hazardRoll = Math.random()
  if (hazardRoll < 0.2) {
    hazard = "trap"
  } else if (hazardRoll < 0.35) {
    hazard = "monster"
  }

  // Determine if room is dark (25% chance)
  const isDark = Math.random() < 0.25

  // Generate items
  const items: Item[] = []
  if (hasItems) {
    // 1-2 items per room with items
    const itemCount = Math.floor(Math.random() * 2) + 1
    for (let i = 0; i < itemCount; i++) {
      items.push(getRandomItem())
    }
  }

  return {
    id: getRoomId(pos),
    pos,
    description: ROOM_DESCRIPTIONS[descriptionIndex],
    exits: {}, // Will be populated when connecting rooms
    items,
    hazard,
    visited: false,
    dark: isDark,
  }
}

// Connect two rooms
function connectRooms(room1: Room, room2: Room): void {
  const { x: x1, y: y1 } = room1.pos
  const { x: x2, y: y2 } = room2.pos

  if (x1 === x2) {
    if (y1 === y2 - 1) {
      room1.exits.south = room2.id
      room2.exits.north = room1.id
    } else if (y1 === y2 + 1) {
      room1.exits.north = room2.id
      room2.exits.south = room1.id
    }
  } else if (y1 === y2) {
    if (x1 === x2 - 1) {
      room1.exits.east = room2.id
      room2.exits.west = room1.id
    } else if (x1 === x2 + 1) {
      room1.exits.west = room2.id
      room2.exits.east = room1.id
    }
  }
}

// Generate a dungeon with the specified depth
export function generateDungeon(depth = 5): GameState {
  const rooms: Record<string, Room> = {}
  const startPos: Position = { x: 0, y: 0 }

  // Create starting room
  const startRoom: Room = {
    id: getRoomId(startPos),
    pos: startPos,
    description: "The entrance to the dungeon. Faint light filters in from above.",
    exits: {},
    items: [{ ...ITEM_TEMPLATES.find((item) => item.id === "torch")! }],
    visited: true,
    dark: false,
  }

  rooms[startRoom.id] = startRoom

  // Generate a simple grid of rooms
  const size = depth * 2 + 1 // Ensure enough space for the depth
  for (let y = -depth; y <= depth; y++) {
    for (let x = -depth; x <= depth; x++) {
      // Skip the starting room
      if (x === 0 && y === 0) continue

      // Only create rooms with a certain probability to create a maze-like structure
      if (Math.random() < 0.7) {
        const pos = { x, y }
        const room = generateRoom(pos, depth)
        rooms[room.id] = room
      }
    }
  }

  // Connect adjacent rooms
  Object.values(rooms).forEach((room) => {
    const { x, y } = room.pos

    // Check for adjacent rooms in all four directions
    const adjacentPositions = [
      { x, y: y - 1 }, // North
      { x, y: y + 1 }, // South
      { x: x + 1, y }, // East
      { x: x - 1, y }, // West
    ]

    adjacentPositions.forEach((adjPos) => {
      const adjRoomId = getRoomId(adjPos)
      const adjRoom = rooms[adjRoomId]

      if (adjRoom) {
        connectRooms(room, adjRoom)
      }
    })
  })

  // Place the relic in a room far from the start
  const relicRoom = Object.values(rooms).reduce((farthest, room) => {
    const distance = Math.abs(room.pos.x) + Math.abs(room.pos.y)
    const currentFarthestDistance = Math.abs(farthest.pos.x) + Math.abs(farthest.pos.y)

    return distance > currentFarthestDistance ? room : farthest
  }, startRoom)

  relicRoom.items.push(getRelicItem())

  // Create the game state
  return {
    player: {
      position: { ...startPos },
      health: 3,
      maxHealth: 3,
      inventory: [],
      maxInventory: 6,
      lightRadius: 3,
    },
    dungeon: {
      rooms,
      depth,
      hasRelic: false,
      exitRevealed: false,
    },
    turns: 0,
  }
}

// Check if a room is visible based on light radius
export function isRoomVisible(state: GameState, roomPos: Position): boolean {
  const playerPos = state.player.position
  const room = getRoomFromPosition(state, roomPos)

  // Always show visited rooms
  if (room && room.visited) return true

  // Calculate Manhattan distance
  const distance = Math.abs(roomPos.x - playerPos.x) + Math.abs(roomPos.y - playerPos.y)

  // Check if room is within light radius
  return distance <= state.player.lightRadius
}

// Get a random monster
export function getRandomMonster() {
  const name = MONSTER_NAMES[Math.floor(Math.random() * MONSTER_NAMES.length)]
  return {
    id: name.toLowerCase(),
    name,
    description: `A menacing ${name.toLowerCase()} blocks your path.`,
    hp: 1,
    damage: 1,
  }
}

// Place exit stairs after relic is found
export function placeExitStairs(state: GameState): GameState {
  // Find a room that's not the current room and not the relic room
  const eligibleRooms = Object.values(state.dungeon.rooms).filter((room) => {
    const isCurrentRoom = room.pos.x === state.player.position.x && room.pos.y === state.player.position.y
    const hasRelic = room.items.some((item) => item.type === "relic")
    return !isCurrentRoom && !hasRelic
  })

  if (eligibleRooms.length > 0) {
    // Choose a random eligible room
    const exitRoom = eligibleRooms[Math.floor(Math.random() * eligibleRooms.length)]

    // Mark this room as having the exit
    exitRoom.description += " There's a staircase leading up out of the dungeon!"
    exitRoom.exits.up = "exit"

    return {
      ...state,
      dungeon: {
        ...state.dungeon,
        exitRevealed: true,
      },
    }
  }

  return state
}
