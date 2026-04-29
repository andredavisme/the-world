import { supabase } from './supabase.js'

export async function getBoards() {
  const { data } = await supabase.schema('content').from('message_boards')
    .select('*').order('is_global', { ascending: false })
  return data ?? []
}

export async function getPosts(boardId, limit = 40) {
  const { data } = await supabase.schema('content').from('board_posts')
    .select('*').eq('board_id', boardId).eq('status', 'active')
    .order('created_at', { ascending: false }).limit(limit)
  return data ?? []
}

export async function postMessage(boardId, playerId, displayName, content) {
  const { data, error } = await supabase.schema('content').from('board_posts')
    .insert({ board_id: boardId, player_id: playerId, display_name: displayName, content })
  return { data, error }
}

export function subscribePosts(boardId, callback) {
  return supabase.channel('board-' + boardId)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'content', table: 'board_posts',
      filter: `board_id=eq.${boardId}`
    }, payload => callback(payload.new))
    .subscribe()
}
