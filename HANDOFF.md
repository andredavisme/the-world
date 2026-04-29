# The World — Handoff Document
_Last updated: 2026-04-28_

---

## Project Overview

**The World** is a persistent, multiplayer text-based exploration game hosted on GitHub Pages with a Supabase backend. Players spawn on a procedurally generated tile map, explore environments, collect **Carrots** (hidden discoveries), follow **Clues**, and share events via a live Chronicle and Message Boards.

- **Live URL:** https://andredavisme.github.io/the-world/
- **GitHub Repo:** https://github.com/andredavisme/the-world
- **Supabase Project:** `hhyhulqngdkwsxhymmcd` (us-west-2)
- **Supabase Dashboard:** https://supabase.com/dashboard/project/hhyhulqngdkwsxhymmcd

---

## Auth

- Provider: Supabase email/password auth
- Test account: `andre.davis.me@gmail.com` / `WorldPass1!`
- Email confirmation is ON — new registrations require email confirmation before login
- `onboard_player(p_auth_uid, p_display_name)` RPC is called on register to create player row

---

## Database Architecture

Three custom schemas (all exposed to PostgREST):

### `player` schema
| Table/View | Key Columns | Notes |
|---|---|---|
| `state` (VIEW) | `player_id`, `display_name`, `col`, `row`, `environment`, `life_rating`, `treasure_rating`, `risk_rating`, `knowledge_rating`, `exposure_rating`, `resources` (JSONB) | RLS-filtered per user. `resources` is a JSONB aggregate |
| `resources` | `player_id`, `resource_type`, `current_value`, `max_value`, `cooldown_until`, `last_used_at` | Separate rows per resource type (health, stamina, hunger, knowledge) |
| `profiles` | `player_id`, `display_name`, `last_active_at`, `tile_id` | No `auth_uid` column — link via `state` view only |
| `inventory` | `player_id`, `item_name`, `quantity` | |

**Functions:**
- `move_player(p_player_id, p_target_tile)` — moves player to adjacent tile
- `onboard_player(p_auth_uid, p_display_name)` — creates player profile on register
- `resource_available(...)` — checks resource cooldown

### `game` schema
| Table | Key Columns | Notes |
|---|---|---|
| `world_tiles` | `id`, `col`, `row`, `environment` | 20×10 grid |
| `carrots` | `id`, `tile_id`, `attribute`, `rarity`, `status`, `label`, `reward_description`, `discovered_at`, `created_at` | `status='found'` for collected. No `found_by` column — filter by `status` |
| `clues` | `id`, `origin_carrot_id`, `target_tile_id`, `status`, `hint_text`, `created_at`, `followed_at` | `status='active'` for unresolved. No `player_id` column |

**Functions:**
- `resolve_action(p_player_id, p_action_type, p_tile_id)`
- `roll_encounter(...)` — triggers on tile entry
- `apply_ecosystem_delta(...)` / `regenerate_ecosystem(...)` — world state evolution

### `content` schema
| Table | Key Columns | Notes |
|---|---|---|
| `chronicle` | `id`, `entry_type`, `headline`, `body`, `tile_id`, `player_id`, `environment`, `rarity`, `created_at` | World event feed |
| `message_boards` | `id`, `name`, `is_global` (+ others TBC) | |
| `board_posts` | `id`, `board_id`, `player_id`, `display_name`, `content`, `status`, `created_at` | `status='active'` for visible posts |

**Functions:**
- `write_chronicle(...)` — inserts chronicle entries
- `reveal_map_fragment(...)` — triggered by Codex carrots
- `chronicle_action_trigger` / `chronicle_global_event_trigger` — DB triggers

---

## Frontend Architecture

```
the-world/
├── index.html          # Login + Register page
├── portal.html         # Main game portal (tabbed: Overview, Explore, Carrots, Chronicle, Boards)
├── css/
│   └── style.css
└── js/
    ├── supabase.js        # Creates 4 clients: supabase (auth), db.player, db.game, db.content
    ├── auth.js            # getSession, requireAuth, login, logout, register
    ├── game.js            # getPlayerState(), getResources(), getAdjacentTiles(), movePlayer()
    ├── chronicle.js       # loadChronicle()
    └── boards.js          # getBoards(), getPosts(), postMessage()
```

### Key Pattern — Schema Clients
Do NOT use `supabase.schema('x').from('y')` — it does not send the `Accept-Profile` header correctly from a static site. Use the pre-built schema clients instead:

```js
import { supabase, db } from './js/supabase.js'
// supabase — auth only
// db.player, db.game, db.content — data queries
```

---

## Current Status (as of 2026-04-28)

### Working
- [x] GitHub Pages deployment
- [x] Auth login/logout (anon key updated, password reset)
- [x] Schema clients created correctly
- [x] All schemas exposed in Supabase PostgREST settings

### Open Issue — Still Being Debugged
- [ ] **All data queries return 404** even though schemas are exposed and clients are correct
  - URLs hitting `/rest/v1/state` instead of schema-prefixed path
  - Supabase hint: `"Perhaps you meant the table 'player.state'"`
  - Schemas `player`, `game`, `content` confirmed exposed in dashboard
  - **Next step:** Verify the `db.player` client is actually sending `Accept-Profile: player` header by checking Network tab in DevTools — look at the request headers on the `/rest/v1/state` call
  - **Possible cause:** CDN-loaded `@supabase/supabase-js@2` via jsDelivr may have a version that doesn’t support `db.schema` in `createClient` options — consider pinning to a specific version like `@2.49.0`

### Carrot System Design (implemented in DB, not yet wired to UI)
- Carrots: `attribute`, `rarity` (Common/Uncommon/Rare/Legendary/Mythic), `label`, `reward_description`
- Clues: `hint_text`, `status`, `origin_carrot_id`, `target_tile_id`
- Perpetuation logic: finding a carrot seeds new clues into unexplored tiles via `resolve_action` RPC

---

## Recommended Next Debug Step

In browser DevTools → Network tab, click the failing `/rest/v1/state` request and check **Request Headers**. You should see:
```
Accept-Profile: player
```
If that header is missing, the `db.schema` option in `createClient` is not working from the CDN build. The fix would be to pin the jsDelivr import to a known working version:
```js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.0/+esm'
```
