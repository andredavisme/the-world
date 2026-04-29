import { supabase } from './supabase.js'

// message_boards columns: check via schema
export async function getBoards() {
  const { data } = await supabase
    .schema('content').from('message_boards')
    .select('*').order('is_global', { ascending: false })
  return data ?? []
}

// board_posts columns: id, board_id, player_id, display_name, content, status, created_at
export async function getPosts(boardId, limit = 40) {
  const { data } = await supabase
    .schema('content').from('board_posts')
    .select('display_name, content, created_at')
    .eq('board_id', boardId).eq('status', 'active')
    .order('created_at', { ascending: false }).limit(limit)
  return data ?? []
}

export async function postMessage(boardId, playerId, displayName, content) {
  const { data, error } = await supabase
    .schema('content').from('board_posts')
    .insert({ board_id: boardId, player_id: playerId, display_name: displayName, content, status: 'active' })
  return { data, error }
}
