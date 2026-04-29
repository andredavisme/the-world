import { supabase } from './supabase.js'

export async function getPlayerState(playerId) {
  const { data, error } = await supabase
    .schema('player').from('state')
    .select('*').eq('player_id', playerId).single()
  return { data, error }
}

export async function getAdjacentTiles(col, row) {
  const directions = [
    { dir: 'N', col, row: row - 1 },
    { dir: 'S', col, row: row + 1 },
    { dir: 'W', col: col - 1, row },
    { dir: 'E', col: col + 1, row },
  ].filter(d => d.col >= 0 && d.col < 20 && d.row >= 0 && d.row < 10)

  const { data } = await supabase.schema('game').from('world_tiles')
    .select('id, col, row, environment')
    .in('col', directions.map(d => d.col))

  return directions.map(d => {
    const tile = data?.find(t => t.col === d.col && t.row === d.row)
    return { ...d, tile_id: tile?.id ?? null }
  })
}

export async function movePlayer(playerId, targetTileId) {
  const { data, error } = await supabase
    .schema('player').rpc('move_player', {
      p_player_id: playerId,
      p_target_tile: targetTileId
    })
  return { data, error }
}

export async function resolveAction(playerId, actionType, tileId) {
  const { data, error } = await supabase
    .schema('game').rpc('resolve_action', {
      p_player_id: playerId,
      p_action_type: actionType,
      p_tile_id: tileId
    })
  return { data, error }
}
