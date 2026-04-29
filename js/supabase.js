import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.0'

const SUPABASE_URL = 'https://hhyhulqngdkwsxhymmcd.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeWh1bHFuZ2Rrd3N4aHltbWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzEyMDEsImV4cCI6MjA5MjcwNzIwMX0.dmSy7Q8Je5lEY4XCFzwvfPnkBYLebPE0yZMhy6Y8czI'

// Default client — used for auth only
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Per-schema clients — unique storageKey prevents multiple GoTrueClient warnings
export const db = {
  player:  createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: 'player'  }, auth: { storageKey: 'sb-player'  } }),
  game:    createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: 'game'    }, auth: { storageKey: 'sb-game'    } }),
  content: createClient(SUPABASE_URL, SUPABASE_KEY, { db: { schema: 'content' }, auth: { storageKey: 'sb-content' } }),
}
