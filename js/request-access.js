import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.0'

const SUPABASE_URL = 'https://nmemmfblpzrkwyljpmvp.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZW1tZmJscHpya3d5bGpwbXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNDUzNzUsImV4cCI6MjA5MjcyMTM3NX0.iAEq-vnY481qdX0nmsonoDZWNFyFrao02GB_MS5BPzs'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// --- Panel helpers ---
const panels = ['entry-choice', 'invite-panel', 'request-panel', 'confirmed-panel']
const show = (id) => panels.forEach(p => document.getElementById(p).classList.toggle('hidden', p !== id))

const showErr = (el, msg) => { el.textContent = msg; el.classList.remove('hidden') }
const hideEl  = (el) => el.classList.add('hidden')

// --- Entry choice ---
document.getElementById('btn-have-invite').addEventListener('click', () => show('invite-panel'))
document.getElementById('btn-request-access').addEventListener('click', () => show('request-panel'))
document.getElementById('back-from-invite').addEventListener('click', e => { e.preventDefault(); show('entry-choice') })
document.getElementById('back-from-request').addEventListener('click', e => { e.preventDefault(); show('request-panel'); show('entry-choice') })

// --- Token verification ---
document.getElementById('verify-token-btn').addEventListener('click', async () => {
  const token  = document.getElementById('invite-token').value.trim()
  const errEl  = document.getElementById('token-error')
  const sucEl  = document.getElementById('token-success')
  hideEl(errEl); hideEl(sucEl)

  if (!token) { showErr(errEl, 'Please paste your invite token.'); return }

  const { data, error } = await supabase
    .from('invitations')
    .select('id, email, role, status, expires_at')
    .eq('token', token)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (error || !data) {
    showErr(errEl, 'Invite not found, already used, or expired.')
    return
  }

  // Valid — store token in sessionStorage and redirect to registration
  sessionStorage.setItem('invite_token', token)
  sessionStorage.setItem('invite_email', data.email)
  sessionStorage.setItem('invite_role',  data.role)
  window.location.href = `index.html?invite=1`
})

// --- Access request submission ---
document.getElementById('submit-request-btn').addEventListener('click', async () => {
  const name    = document.getElementById('req-name').value.trim()
  const email   = document.getElementById('req-email').value.trim()
  const message = document.getElementById('req-message').value.trim()
  const errEl   = document.getElementById('req-error')
  hideEl(errEl)

  if (!name)  { showErr(errEl, 'Name is required.'); return }
  if (!email) { showErr(errEl, 'Email is required.'); return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr(errEl, 'Please enter a valid email address.'); return }

  const btn = document.getElementById('submit-request-btn')
  btn.disabled = true
  btn.textContent = 'Submitting…'

  // Guard: check if this email already has a pending/approved request
  const { data: existing } = await supabase
    .from('access_requests')
    .select('id, status')
    .eq('email', email)
    .in('status', ['pending', 'approved'])
    .maybeSingle()

  if (existing) {
    const msg = existing.status === 'approved'
      ? 'This email has already been approved — check your inbox for an invite link.'
      : 'A request from this email is already pending review.'
    showErr(errEl, msg)
    btn.disabled = false
    btn.textContent = 'Submit Request'
    return
  }

  const { error } = await supabase
    .from('access_requests')
    .insert({ name, email, message: message || null })

  if (error) {
    showErr(errEl, 'Something went wrong. Please try again.')
    btn.disabled = false
    btn.textContent = 'Submit Request'
    return
  }

  show('confirmed-panel')
})
