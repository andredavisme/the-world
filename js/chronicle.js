import { supabase } from './supabase.js'

// chronicle columns: id, entry_type, headline, body, tile_id, player_id, environment, rarity, created_at
export async function loadChronicle(limit = 50) {
  const { data } = await supabase
    .schema('content').from('chronicle')
    .select('headline, body, environment, rarity, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}
