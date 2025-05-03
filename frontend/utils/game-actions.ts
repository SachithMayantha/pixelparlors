import type { GameState } from "@/types/game"
import { getRoomFromPosition, getRandomMonster, placeExitStairs } from "./dungeon-generator"

// Move player to a new position
export function movePlayer(state: GameState, direction: string): { newState: GameState; message: string } {
  const currentRoom = getRoomFromPosition(state, state.player.position)
  if (!currentRoom) {
    return {
      newState: state,
      message: "Error: Current room not found.",
    }
  }

  // Check if the direction is valid
  const exit = currentRoom.exits[direction as keyof typeof currentRoom.exits]
  if (!exit) {
    return {
      newState: state,
      message: `You cannot go ${direction} from here.`,
    }
  }

  // Check if it's the exit stairs
  if (exit === "exit") {
    if (state.dungeon.hasRelic) {
      // Player wins!
      return {
        newState: {
          ...state,
          player: {
            ...state.player,
            position: { x: -999, y: -999 }, // Move player out of dungeon
          },
        },
        message: "You climb the stairs with the Bedrock Relic in hand. You've won!",
      }
    } else {
      return {
        newState: state,
        message: "You need to find the Bedrock Relic before you can leave the dungeon.",
      }
    }
  }

  // Find the target room
  const targetRoomId = exit
  const targetRoom = state.dungeon.rooms[targetRoomId]

  if (!targetRoom) {
    return {
      newState: state,
      message: "Error: Target room not found.",
    }
  }

  // Update player position
  const newState = {
    ...state,
    player: {
      ...state.player,
      position: { ...targetRoom.pos },
    },
    turns: state.turns + 1,
  }

  // Mark room as visited
  newState.dungeon.rooms[targetRoomId] = {
    ...targetRoom,
    visited: true,
  }

  // Check for trap
  if (targetRoom.hazard === "trap") {
    // Player triggers trap
    const damage = Math.floor(Math.random() * 2) + 1 // 1-2 damage
    const newHealth = Math.max(0, newState.player.health - damage)

    // Update player health
    newState.player.health = newHealth

    // Clear the trap
    newState.dungeon.rooms[targetRoomId].hazard = undefined

    // Check if player died
    if (newHealth <= 0) {
      return {
        newState,
        message: `You triggered a trap! You take ${damage} damage and collapse. GAME OVER.`,
      }
    }

    return {
      newState,
      message: `You triggered a trap! You take ${damage} damage.`,
    }
  }

  // Check for monster
  if (targetRoom.hazard === "monster") {
    // Create a monster encounter
    const monster = getRandomMonster()

    return {
      newState: {
        ...newState,
        currentMonster: monster,
      },
      message: `You encounter a ${monster.name}! ${monster.description}`,
    }
  }

  // Normal movement
  let description = targetRoom.description

  // Add item information
  if (targetRoom.items.length > 0) {
    const itemNames = targetRoom.items.map((item) => item.name).join(", ")
    description += ` You see: ${itemNames}.`
  }

  // Add exit information
  const exits = Object.keys(targetRoom.exits)
  if (exits.length > 0) {
    const exitDirections = exits.join(", ")
    description += ` Exits: ${exitDirections}.`
  }

  return {
    newState,
    message: description,
  }
}

// Look around the current room
export function lookAround(state: GameState): { newState: GameState; message: string } {
  const currentRoom = getRoomFromPosition(state, state.player.position)
  if (!currentRoom) {
    return {
      newState: state,
      message: "Error: Current room not found.",
    }
  }

  let description = currentRoom.description

  // Add item information
  if (currentRoom.items.length > 0) {
    const itemNames = currentRoom.items.map((item) => item.name).join(", ")
    description += ` You see: ${itemNames}.`
  } else {
    description += " There are no items here."
  }

  // Add exit information
  const exits = Object.keys(currentRoom.exits)
  if (exits.length > 0) {
    const exitDirections = exits.join(", ")
    description += ` Exits: ${exitDirections}.`
  } else {
    description += " There are no visible exits."
  }

  // Add monster information
  if (state.currentMonster) {
    description += ` A ${state.currentMonster.name} is here!`
  }

  return {
    newState: state,
    message: description,
  }
}

// Take an item from the current room
export function takeItem(state: GameState, itemName: string): { newState: GameState; message: string } {
  const currentRoom = getRoomFromPosition(state, state.player.position)
  if (!currentRoom) {
    return {
      newState: state,
      message: "Error: Current room not found.",
    }
  }

  // Find the item in the room
  const itemIndex = currentRoom.items.findIndex((item) => item.name.toLowerCase() === itemName.toLowerCase())

  if (itemIndex === -1) {
    return {
      newState: state,
      message: `There is no ${itemName} here.`,
    }
  }

  // Check if inventory has space
  if (state.player.inventory.length >= state.player.maxInventory) {
    return {
      newState: state,
      message: "Your inventory is full. Use or drop an item first.",
    }
  }

  // Take the item
  const item = currentRoom.items[itemIndex]
  const newItems = [...currentRoom.items]
  newItems.splice(itemIndex, 1)

  // Update room items
  const newRooms = {
    ...state.dungeon.rooms,
    [currentRoom.id]: {
      ...currentRoom,
      items: newItems,
    },
  }

  // Check if it's the relic
  let hasRelic = state.dungeon.hasRelic
  const exitRevealed = state.dungeon.exitRevealed

  if (item.type === "relic") {
    hasRelic = true

    // Place exit stairs
    const stateWithRelic = {
      ...state,
      dungeon: {
        ...state.dungeon,
        rooms: newRooms,
        hasRelic: true,
      },
    }

    const stateWithExit = placeExitStairs(stateWithRelic)

    return {
      newState: {
        ...stateWithExit,
        player: {
          ...state.player,
          inventory: [...state.player.inventory, item],
        },
        turns: state.turns + 1,
      },
      message: `You pick up the ${item.name}. The ground trembles slightly. An exit has appeared somewhere in the dungeon!`,
    }
  }

  // Normal item pickup
  return {
    newState: {
      ...state,
      player: {
        ...state.player,
        inventory: [...state.player.inventory, item],
      },
      dungeon: {
        ...state.dungeon,
        rooms: newRooms,
        hasRelic,
        exitRevealed,
      },
      turns: state.turns + 1,
    },
    message: `You pick up the ${item.name}.`,
  }
}

// Use an item from inventory
export function useItem(state: GameState, itemName: string): { newState: GameState; message: string } {
  // Find the item in inventory
  const itemIndex = state.player.inventory.findIndex((item) => item.name.toLowerCase() === itemName.toLowerCase())

  if (itemIndex === -1) {
    return {
      newState: state,
      message: `You don't have a ${itemName}.`,
    }
  }

  const item = state.player.inventory[itemIndex]
  const newInventory = [...state.player.inventory]

  // Process based on item type
  switch (item.type) {
    case "heal":
      // Remove the item
      newInventory.splice(itemIndex, 1)

      // Heal the player
      const newHealth = Math.min(state.player.maxHealth, state.player.health + 1)

      return {
        newState: {
          ...state,
          player: {
            ...state.player,
            health: newHealth,
            inventory: newInventory,
          },
          turns: state.turns + 1,
        },
        message: `You use the ${item.name} and restore 1 heart.`,
      }

    case "light":
      // Torch doesn't get consumed, just activated
      return {
        newState: {
          ...state,
          player: {
            ...state.player,
            lightRadius: 5, // Increased light radius
          },
          turns: state.turns + 1,
        },
        message: `You hold up the ${item.name}, illuminating more of the dungeon.`,
      }

    case "key":
      // Check if there's a locked door in the current room
      const currentRoom = getRoomFromPosition(state, state.player.position)
      if (!currentRoom) {
        return {
          newState: state,
          message: "Error: Current room not found.",
        }
      }

      // For simplicity, we'll just say the key is used
      newInventory.splice(itemIndex, 1)

      return {
        newState: {
          ...state,
          player: {
            ...state.player,
            inventory: newInventory,
          },
          turns: state.turns + 1,
        },
        message: `You use the ${item.name}, but there's nothing to unlock here.`,
      }

    case "relic":
      return {
        newState: state,
        message: "The Bedrock Relic pulses with ancient power. Find the exit to win!",
      }

    default:
      return {
        newState: state,
        message: `You can't use the ${item.name} right now.`,
      }
  }
}

// Attack the current monster
export function attackMonster(state: GameState): { newState: GameState; message: string } {
  if (!state.currentMonster) {
    return {
      newState: state,
      message: "There's nothing to attack here.",
    }
  }

  // 50% chance to hit
  const hit = Math.random() < 0.5

  if (hit) {
    // Player hits the monster
    const monster = state.currentMonster
    const newMonsterHp = monster.hp - 1

    if (newMonsterHp <= 0) {
      // Monster dies
      // Maybe drop an item (50% chance)
      const currentRoom = getRoomFromPosition(state, state.player.position)
      let newRooms = { ...state.dungeon.rooms }

      if (currentRoom && Math.random() < 0.5) {
        // Add a random item to the room
        const newItems = [
          ...currentRoom.items,
          {
            id: `gold_coin_${Date.now()}`,
            name: "Gold Coin",
            description: "A shiny gold coin. Collect them for a high score.",
            type: "gold" as const,
          },
        ]

        newRooms = {
          ...newRooms,
          [currentRoom.id]: {
            ...currentRoom,
            items: newItems,
            hazard: undefined, // Remove the monster
          },
        }
      } else if (currentRoom) {
        // Just remove the monster
        newRooms = {
          ...newRooms,
          [currentRoom.id]: {
            ...currentRoom,
            hazard: undefined,
          },
        }
      }

      return {
        newState: {
          ...state,
          currentMonster: undefined,
          dungeon: {
            ...state.dungeon,
            rooms: newRooms,
          },
          turns: state.turns + 1,
        },
        message: `You hit the ${monster.name}! It collapses in defeat.`,
      }
    } else {
      // Monster is wounded but still alive
      return {
        newState: {
          ...state,
          currentMonster: {
            ...monster,
            hp: newMonsterHp,
          },
          turns: state.turns + 1,
        },
        message: `You hit the ${monster.name}! It looks wounded.`,
      }
    }
  } else {
    // Player misses, monster attacks
    const monster = state.currentMonster
    const newPlayerHp = state.player.health - monster.damage

    // Check if player dies
    if (newPlayerHp <= 0) {
      return {
        newState: {
          ...state,
          player: {
            ...state.player,
            health: 0,
          },
          turns: state.turns + 1,
        },
        message: `You miss! The ${monster.name} attacks and deals ${monster.damage} damage. You collapse. GAME OVER.`,
      }
    }

    return {
      newState: {
        ...state,
        player: {
          ...state.player,
          health: newPlayerHp,
        },
        turns: state.turns + 1,
      },
      message: `You miss! The ${monster.name} attacks and deals ${monster.damage} damage.`,
    }
  }
}

// Show player stats
export function showStats(state: GameState): { newState: GameState; message: string } {
  return {
    newState: state,
    message: `Hearts: ${state.player.health}/${state.player.maxHealth} | Depth: ${state.dungeon.depth} | Turns: ${state.turns}`,
  }
}

// Show inventory
export function showInventory(state: GameState): { newState: GameState; message: string } {
  if (state.player.inventory.length === 0) {
    return {
      newState: state,
      message: "Your inventory is empty.",
    }
  }

  const itemList = state.player.inventory.map((item) => `${item.name}: ${item.description}`).join("\n")

  return {
    newState: state,
    message: `Inventory (${state.player.inventory.length}/${state.player.maxInventory}):\n${itemList}`,
  }
}

// Flee from combat
export function fleeFromCombat(state: GameState): { newState: GameState; message: string } {
  if (!state.currentMonster) {
    return {
      newState: state,
      message: "There's nothing to flee from.",
    }
  }

  // 50% chance to successfully flee
  const success = Math.random() < 0.5

  if (success) {
    return {
      newState: {
        ...state,
        currentMonster: undefined,
        turns: state.turns + 1,
      },
      message: "You successfully flee from combat!",
    }
  } else {
    // Failed to flee, monster attacks
    const monster = state.currentMonster
    const newPlayerHp = state.player.health - monster.damage

    // Check if player dies
    if (newPlayerHp <= 0) {
      return {
        newState: {
          ...state,
          player: {
            ...state.player,
            health: 0,
          },
          turns: state.turns + 1,
        },
        message: `You fail to flee! The ${monster.name} attacks and deals ${monster.damage} damage. You collapse. GAME OVER.`,
      }
    }

    return {
      newState: {
        ...state,
        player: {
          ...state.player,
          health: newPlayerHp,
        },
        turns: state.turns + 1,
      },
      message: `You fail to flee! The ${monster.name} attacks and deals ${monster.damage} damage.`,
    }
  }
}
