import { useState, useRef } from 'react';
import { isUsernameTaken, signUp, logIn } from '../lib/auth';
import { DIGIT_COLORS } from '../data/categories';

const KEY_LAYOUT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

function BackspaceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 4H8l-6 8 6 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
      <line x1="18" y1="9" x2="12" y2="15" />
      <line x1="12" y1="9" x2="18" y2="15" />
    </svg>
  );
}

function Keypad({ pin, onDigit, onBack }) {
  return (
    <div className="keypad">
      {KEY_LAYOUT.map((k, i) => {
        if (k === '') return <button key={i} className="key blank" disabled />;
        if (k === 'back') {
          return (
            <button key={i} className="key k-back" onClick={onBack}>
              <BackspaceIcon />
            </button>
          );
        }
        const dc = DIGIT_COLORS[k];
        return (
          <button
            key={i}
            className="key"
            style={{ background: dc.t, color: dc.c }}
            onClick={() => onDigit(k)}
            disabled={pin.length >= 4}
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}

function PinDots({ mode, count, error }) {
  return (
    <div className="pin-dots">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`pin-dot ${mode}${i < count ? ' filled' : ''}${error ? ' error' : ''}`}
        />
      ))}
    </div>
  );
}

export default function AuthScreen({ onAuthed }) {
  const [tab, setTab] = useState('signup'); // 'signup' | 'login'
  const [username, setUsername] = useState('');
  const [nameStatus, setNameStatus] = useState(null); // null | 'checking' | 'available' | 'taken'
  const [stage, setStage] = useState('enter'); // signup only: 'enter' | 'confirm' | 'done'
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinLabel, setPinLabel] = useState('Pick a 4-digit code');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const checkTimeout = useRef(null);

  function switchTab(next) {
    setTab(next);
    setPin('');
    setFirstPin('');
    setStage('enter');
    setPinError(false);
    setSubmitError('');
    setPinLabel(next === 'signup' ? 'Pick a 4-digit code' : 'Your 4-digit code');
  }

  function handleUsernameChange(value) {
    setUsername(value);
    setSubmitError('');
    clearTimeout(checkTimeout.current);
    if (!value.trim()) {
      setNameStatus(null);
      return;
    }
    setNameStatus('checking');
    checkTimeout.current = setTimeout(async () => {
      try {
        const taken = await isUsernameTaken(value);
        setNameStatus(taken ? 'taken' : 'available');
      } catch {
        setNameStatus(null);
      }
    }, 400);
  }

  function handleDigit(k) {
    if (tab === 'login') {
      if (pin.length < 4) setPin(pin + k);
      return;
    }

    // signup flow
    const next = pin + k;
    setPin(next);
    setPinError(false);

    if (next.length === 4) {
      if (stage === 'enter') {
        setTimeout(() => {
          setFirstPin(next);
          setStage('confirm');
          setPin('');
          setPinLabel('Confirm your code');
        }, 150);
      } else if (stage === 'confirm') {
        setTimeout(() => {
          if (next === firstPin) {
            setStage('done');
            setPinLabel('Code confirmed ✓');
          } else {
            setPinLabel("Codes didn't match — try again");
            setPinError(true);
            setTimeout(() => {
              setPin('');
              setPinError(false);
              setPinLabel('Confirm your code');
            }, 900);
          }
        }, 150);
      }
    }
  }

  function handleBack() {
    setPin(pin.slice(0, -1));
    setPinError(false);
  }

  async function handleSubmit() {
    setSubmitError('');
    setSubmitting(true);
    try {
      const session =
        tab === 'signup' ? await signUp(username, firstPin) : await logIn(username, pin);
      onAuthed(session);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  const signupReady = stage === 'done' && !submitting;
  const loginReady = pin.length === 4 && username.trim() && !submitting;

  return (
    <div className="auth-wrap">
      <div className="brand">
        <div className="confetti">
          <span style={{ width: 11, height: 11, background: '#00B889', top: 2, left: 0, borderRadius: 3, transform: 'rotate(20deg)' }} />
          <span style={{ width: 8, height: 8, background: '#E11D48', top: -2, right: 4 }} />
          <span style={{ width: 9, height: 9, background: '#FFC107', bottom: 2, left: 8, borderRadius: 3, transform: 'rotate(-15deg)' }} />
          <span style={{ width: 7, height: 7, background: '#9B4DFF', top: 10, right: -2 }} />
        </div>
        <div className="logo-mark" style={{ marginBottom: 10 }}>
          <span style={{ background: '#3E5FFF' }} />
          <span style={{ background: '#E11D48' }} />
          <span style={{ background: '#FFC107' }} />
          <span style={{ background: '#00B889' }} />
        </div>
        <h1>Currents</h1>
        <p>Your daily rundown, across everything you care about.</p>
      </div>

      <div className="toggle-row">
        <button className={`toggle-btn signup${tab === 'signup' ? ' active' : ''}`} onClick={() => switchTab('signup')}>
          Sign up
        </button>
        <button className={`toggle-btn login${tab === 'login' ? ' active' : ''}`} onClick={() => switchTab('login')}>
          Log in
        </button>
      </div>

      {tab === 'signup' ? (
        <>
          <label className="field-label">Username</label>
          <input
            className="name-input signup"
            placeholder="Pick a username"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
          />
          <div className={`name-status${nameStatus === 'taken' ? ' taken' : nameStatus === 'available' ? ' available' : ''}`}>
            {nameStatus === 'taken' && 'That username is taken — try another.'}
            {nameStatus === 'available' && 'Available'}
          </div>

          <label className={`field-label pin-label${pinError ? ' error' : ''}`} style={{ textAlign: 'center', display: 'block' }}>
            {pinLabel}
          </label>
          <PinDots mode="signup" count={pin.length} error={pinError} />
          <Keypad pin={pin} onDigit={handleDigit} onBack={handleBack} />

          <button className="primary-btn signup" disabled={!signupReady} onClick={handleSubmit}>
            {submitting ? 'Creating…' : 'Create account'}
          </button>
          {submitError && <div className="auth-error">{submitError}</div>}

          <div className="switch-note on-signup">
            Already have an account? <a onClick={() => switchTab('login')}>Log in</a>
          </div>
        </>
      ) : (
        <>
          <label className="field-label">Username</label>
          <input
            className="name-input login"
            placeholder="Your username"
            style={{ marginBottom: 14 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="field-label pin-label" style={{ textAlign: 'center', display: 'block' }}>
            Your 4-digit code
          </label>
          <PinDots mode="login" count={pin.length} />
          <Keypad pin={pin} onDigit={handleDigit} onBack={handleBack} />

          <button className="primary-btn login" disabled={!loginReady} onClick={handleSubmit}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
          {submitError && <div className="auth-error">{submitError}</div>}

          <div className="switch-note on-login">
            New here? <a onClick={() => switchTab('signup')}>Create an account</a>
          </div>
        </>
      )}
    </div>
  );
}
