import { useState, useRef, useEffect } from 'react';

const STORAGE_KEY = 'blueprint-auth';
const PASS_HASH = '4851b05b6fe7b1909986c0f3ede3a8f4680a133d7c5218f6aa94c23cf327db7e';

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!authenticated && inputRef.current) inputRef.current.focus();
  }, [authenticated]);

  if (authenticated) return children;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const hash = await hashPassword(password);
    if (hash === PASS_HASH) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setAuthenticated(true);
    } else {
      setError('Wrong password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="bg-bg-secondary border border-border rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-accent font-bold text-xl mb-1">Blueprint</h1>
        <p className="text-xs text-text-muted mb-6">Enter password to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
          />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          <button
            type="submit"
            disabled={!password}
            className="w-full mt-4 px-4 py-2.5 bg-accent text-bg-primary rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-40"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
