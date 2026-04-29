import { db } from './supabase.js'

export async function getBoards() {
  const { data } = await db.content.from('message_boards')
    .select('*').order('is_global', { ascending: false })
  return data ?? []
}

export async function getPosts(boardId, limit = 40) {
  const { data } = await db.content.from('board_posts')
    .select('display_name, content, created_at')
    .eq('board_id', boardId).eq('status', 'active')
    .order('created_at', { ascending: false }).limit(limit)
  return data ?? []
}

export async function postMessage(boardId, playerId, displayName, content) {
  const { data, error } = await db.content.from('board_posts')
    .insert({ board_id: boardId, player_id: playerId, display_name: displayName, content, status: 'active' })
  return { data, error }
}
