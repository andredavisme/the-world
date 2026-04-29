# ⬡ The World

A shared-world, turn-based exploration game.
No map. No guide. Only what you find.

---

## How to Play

1. Visit the game URL (or open `index.html` locally)
2. Register with an email address and choose a display name
3. You spawn somewhere in the world — you won't know where
4. Use the **N / S / E / W** buttons to move between tiles
   - Movement is always free
   - Entering harsh biomes (Desert, Mountain, Ocean, Jungle) drains Vitality
5. Use **Action buttons** to interact with your current tile
   - Each action costs a resource (shown in your bars)
   - Grayed-out actions mean that resource is depleted or cooling down
6. **Encounters** may trigger when you act — rarity determines reward
7. Read the **Chronicle** to follow the world story as it unfolds
8. Post on **Boards** to share intel, directions, and rumors with others
9. Find a **Map Fragment** to see nearby tiles (or draw your own on paper)
10. Resources recharge over time — come back and keep playing

---

## Resources

| Resource  | Start | What It Powers | Cooldown on Depletion |
|-----------|-------|---|-----------------------|
| Stamina   | 10    | Explore, Hunt, Excavate | 1–3 min |
| Focus     | 8     | Study | 5 min |
| Influence | 6     | Trade, Establish Outpost | 10 min – 1 hr |
| Vitality  | 10    | Survival in harsh biomes; Endure restores +2 | 90 sec |
| Luck      | 3     | Trigger Encounter (bonus rarity roll) | None |

Stamina partially regenerates (+2) every 3 actions automatically.

---

## Actions

| Action | Cost | Effect |
|---|---|---|
| Explore | ST: 2 | Survey tile; may trigger encounter + clue drop |
| Hunt | ST: 3 | Harvest life; reduces tile Life rating |
| Excavate | ST: 3 | Dig for treasure; reduces tile Treasure rating |
| Study | FO: 2 | Learn the tile; reduces Knowledge rating locally |
| Trade | IN: 3 | Exchange resources with the world |
| Establish Outpost | IN: 5 | Claim presence; raises local Risk rating |
| Endure | Free | Rest and recover; restores +2 Vitality |
| Trigger Encounter | LK: 1 | Force a carrot roll using Luck |

---

## Environments

| Environment | Risk | Treasure | Notable Hazard |
|---|---|---|---|
| Forest | 3 | 2 | Safe starter zone |
| Freshwater | 2 | 2 | Safest zone |
| Swamp | 3 | 3 | Exposure drain on entry |
| Jungle | 5 | 4 | Highest danger + reward |
| Desert | 4 | 4 | Extreme exposure |
| Ocean | 4 | 3 | Exposure + isolation |
| Mountain | 5 | 5 | Max risk, max reward |

---

## Deployment

### GitHub Pages
1. Go to Settings → Pages → Source: main branch / root
2. Share: `https://andredavisme.github.io/the-world/`

### Local
Open `index.html` in any modern browser. Internet required for Supabase.

### Netlify Drop
Drag this folder to [netlify.com/drop](https://netlify.com/drop).
