import { supabase } from './supabase.js'

export async function loadChronicle(limit = 50) {
  const { data } = await supabase.schema('content').from('chronicle')
    .select('*').order('created_at', { ascending: false }).limit(limit)
  return data ?? []
}

export function subscribeChronicle(callback) {
  return supabase.channel('chronicle-feed')
    .on('postgres_changes', {
      event: 'INSERT', schema: 'content', table: 'chronicle'
    }, payload => callback(payload.new))
    .subscribe()
}
