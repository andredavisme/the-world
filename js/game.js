import { db } from './supabase.js'

export async function getPlayerState() {
  const { data, error } = await db.player.from('state').select('*').single()
  return { data, error }
}

export async function getResources(playerId) {
  const { data, error } = await db.player.from('resources')
    .select('resource_type, current_value, max_value')
    .eq('player_id', playerId)
  return { data, error }
}

export async function getAdjacentTiles(col, row) {
  const dirs = [
    { dir: 'N',  col: col,   row: row-1 },
    { dir: 'S',  col: col,   row: row+1 },
    { dir: 'W',  col: col-1, row: row   },
    { dir: 'E',  col: col+1, row: row   },
    { dir: 'NW', col: col-1, row: row-1 },
    { dir: 'NE', col: col+1, row: row-1 },
    { dir: 'SW', col: col-1, row: row+1 },
    { dir: 'SE', col: col+1, row: row+1 },
  ].filter(d => d.col >= 0 && d.row >= 0)

  const cols = [...new Set(dirs.map(d => d.col))]
  const rows = [...new Set(dirs.map(d => d.row))]

  const { data } = await db.game.from('world_tiles')
    .select('id, col, row, environment')
    .in('col', cols).in('row', rows)

  return dirs.map(d => ({
    ...d,
    tile_id: data?.find(t => t.col === d.col && t.row === d.row)?.id ?? null
  }))
}

export async function movePlayer(playerId, targetTileId) {
  const { data, error } = await db.player.rpc('move_player', {
    p_player_id: playerId,
    p_target_tile: targetTileId
  })
  return { data, error }
}
