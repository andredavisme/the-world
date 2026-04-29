import { supabase } from './supabase.js'

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) { window.location.href = 'index.html'; return null }
  return session
}

export async function register(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error }
  if (!data.user) return { error: { message: 'Signup failed — no user returned.' } }
  await new Promise(r => setTimeout(r, 800))
  const { data: onboard, error: oErr } = await supabase
    .rpc('onboard_player', { p_auth_uid: data.user.id, p_display_name: displayName })
  if (oErr) console.error('onboard_player error:', oErr)
  return { data: onboard, error: oErr }
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function logout() {
  await supabase.auth.signOut()
  window.location.href = 'index.html'
}
