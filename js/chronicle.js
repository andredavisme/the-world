import { db } from './supabase.js'

export async function loadChronicle(limit = 50) {
  const { data } = await db.content.from('chronicle')
    .select('headline, body, environment, rarity, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}
