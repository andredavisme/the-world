import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.0'

const SUPABASE_URL = 'https://hhyhulqngdkwsxhymmcd.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeWh1bHFuZ2Rrd3N4aHltbWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzEyMDEsImV4cCI6MjA5MjcwNzIwMX0.dmSy7Q8Je5lEY4XCFzwvfPnkBYLebPE0yZMhy6Y8czI'

// Auth client — single instance, handles session/login
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Helper: inject the current session token into a schema client header
async function schemaClient(schema) {
  const { data: { session } } = await supabase.auth.getSession()
  const headers = session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {}
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    db: { schema },
    global: { headers },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}

// Pre-built schema clients — token injected at module load
// For queries made after login these will have the correct token.
// If the token refreshes mid-session, call refreshDb() to rebuild them.
async function buildDb() {
  const [player, game, content] = await Promise.all([
    schemaClient('player'),
    schemaClient('game'),
    schemaClient('content'),
  ])
  return { player, game, content }
}

export let db = await buildDb()

// Call this if you need to refresh the auth token in schema clients
export async function refreshDb() {
  db = await buildDb()
}
