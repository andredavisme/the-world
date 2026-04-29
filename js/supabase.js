import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.0'

const SUPABASE_URL = 'https://hhyhulqngdkwsxhymmcd.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeWh1bHFuZ2Rrd3N4aHltbWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzEyMDEsImV4cCI6MjA5MjcwNzIwMX0.dmSy7Q8Je5lEY4XCFzwvfPnkBYLebPE0yZMhy6Y8czI'

// Single client — one GoTrueClient, no warnings
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Schema-scoped query helpers
// Usage: db.player.from('state')  /  db.game.rpc('roll_encounter', {...})
export const db = {
  player:  supabase.schema('player'),
  game:    supabase.schema('game'),
  content: supabase.schema('content'),
}
