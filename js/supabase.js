import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.0/+esm'

const SUPABASE_URL = 'https://hhyhulqngdkwsxhymmcd.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeWh1bHFuZ2Rrd3N4aHltbWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzEyMDEsImV4cCI6MjA5MjcwNzIwMX0.dmSy7Q8Je5lEY4XCFzwvfPnkBYLebPE0yZMhy6Y8czI'

// Default client (public schema) — used for auth
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Per-schema clients — schema switching via db.schema option
export const db = {
  player:  createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: 'player'  } }),
  game:    createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: 'game'    } }),
  content: createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: 'content' } }),
}
