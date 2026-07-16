import { supabase } from './supabaseClient';

// Username + 4-digit code is presented to the person, but under the hood this
// rides on Supabase's own battle-tested email+password auth so that logging in
// from a brand new device actually works (not just "remembered on this browser").
//
// - username -> slugified into a deterministic, fake internal "email"
// - 4-digit code -> padded into a real password Supabase will accept
//
// IMPORTANT SETUP STEP (do this once in the Supabase dashboard):
// Authentication -> Providers -> Email -> turn OFF "Confirm email".
// Without this, signUp() won't return an active session until an email is
// confirmed -- which can't happen here since the "email" isn't real.

const FAKE_EMAIL_DOMAIN = 'currents.local';

function slugifyUsername(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function toFakeEmail(name) {
  return `${slugifyUsername(name)}@${FAKE_EMAIL_DOMAIN}`;
}

function toPassword(pin) {
  // Pads the 4-digit code so it clears Supabase's default minimum password
  // length. The padding is fixed/public -- it adds no real security, it just
  // satisfies the length check. Security here rests on the PIN space itself,
  // which was an explicit, accepted tradeoff for this low-stakes personal app.
  return `cur-${pin}`;
}

/** Returns true if a username is already taken (case-insensitive). */
export async function isUsernameTaken(username) {
  const clean = slugifyUsername(username);
  if (!clean) return false;
  const { data, error } = await supabase.rpc('currents_name_taken', {
    check_name: clean,
  });
  if (error) throw error;
  return data === true;
}

/** Creates a new account and returns the signed-in session. */
export async function signUp(username, pin) {
  const clean = slugifyUsername(username);
  if (!clean) throw new Error('Please enter a username.');
  if (!/^\d{4}$/.test(pin)) throw new Error('Code must be exactly 4 digits.');

  const taken = await isUsernameTaken(clean);
  if (taken) throw new Error('That username is taken -- try another.');

  const { data, error } = await supabase.auth.signUp({
    email: toFakeEmail(clean),
    password: toPassword(pin),
  });
  if (error) throw error;
  if (!data.session) {
    // This means email confirmation is still turned on for the project --
    // see the setup note above.
    throw new Error(
      'Account created but not signed in automatically. Ask the site owner to disable "Confirm email" in Supabase Auth settings.'
    );
  }

  const { error: profileError } = await supabase
    .from('currents_users')
    .insert({ id: data.user.id, name: clean });
  if (profileError) throw profileError;

  return data.session;
}

/** Logs into an existing account from any device and returns the session. */
export async function logIn(username, pin) {
  const clean = slugifyUsername(username);
  if (!clean) throw new Error('Please enter a username.');
  if (!/^\d{4}$/.test(pin)) throw new Error('Code must be exactly 4 digits.');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: toFakeEmail(clean),
    password: toPassword(pin),
  });
  if (error) throw new Error('Username or code is incorrect.');
  return data.session;
}

export async function logOut() {
  await supabase.auth.signOut();
}

/** Subscribes to auth state changes; returns an unsubscribe function. */
export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
