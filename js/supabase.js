import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://hhyhulqngdkwsxhymmcd.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeWh1bHFuZ2Rrd3N4aHltbWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4OTU3NzgsImV4cCI6MjA2MTQ3MTc3OH0.pt6xqSMYcwSGGPtBDXkDSMBTI4TSdSjQBpgbEgtDyTU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Schema-aware fetch helpers
export function fromSchema(schema, table) {
  return supabase.schema(schema).from(table)
}
