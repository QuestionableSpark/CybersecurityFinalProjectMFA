import { FormEvent, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

function App() {
  const [page, setPage] = useState<'home' | 'login' | 'register'>('home')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function goTo(next: 'home' | 'login' | 'register') {
    setPage(next)
    setMessage('')
  }
  // Added register handler
  async function register(event: FormEvent<HTMLFormElement>)  {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')
    const form = event.currentTarget
    const data = new FormData(form)
    if (data.get('password') !== data.get('confirm')) {
      setMessage('Register request failed. Passwords do not match. Please try again.')
      setSubmitting(false)
      return
    } 
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.get('username'),
          password: data.get('password')
        })
      })
      if (response.status === 201)  {
        setMessage('Account created, please return to log in screen.')
        form.reset()
      } else if (response.status === 409) {
        setMessage('Inputted Username already taken, please try another.')
      } else if (response.status === 422) {
        setMessage('Invalid username password. Username must be at least 5 characters and password must be between 8 and 64.')
      } else if (!response.ok)  {
        setMessage('Register attempt failed. Please try again.')
      }
    } catch {
        setMessage('Cannot reach the API. Start the development servers and try again.')
    } finally {
      setSubmitting(false)
    }
  }
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')
    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.get('username'),
          password: data.get('password'),
        }),
      })
      if (response.status === 501) {
        setMessage('Authentication is not implemented yet. No credentials were checked.')
      } else if (!response.ok) {
        setMessage('Login request failed. Please try again.')
      } else {
        setMessage('Password step complete. The second factor is not available yet.')
      }
    } catch {
      setMessage('Cannot reach the API. Start the development servers and try again.')
    } finally {
      // Clear the password even when the request fails.
      form.reset()
      setSubmitting(false)
    }
  }

  return (
    <div className="shell">
      <header className="topbar">
        <a href="/" className="brand" onClick={(event) => { event.preventDefault(); goTo('home') }}>
          <span className="brand-mark">M</span> MFA Portal
        </a>
        <nav aria-label="Main navigation">
          <button className={page === 'home' ? 'active' : ''} onClick={() => goTo('home')}>Home</button>
          <button className={page === 'register' ? 'active' : ''} onClick={() => goTo('register')}>Register</button>
          <button className={page === 'login' ? 'active' : ''} onClick={() => goTo('login')}>Login</button>
        </nav>
      </header>
      <main>
        {page === 'home' ? (
          <section className="panel intro">
            <span className="eyebrow">Cybersecurity course project</span>
            <h1>Explore multi-factor authentication.</h1>
            <p>A small portal for building and studying a two-step sign-in process. This homepage is public; authentication has not been implemented.</p>
            <button className="primary" onClick={() => goTo('login')}>Go to login <span aria-hidden="true">→</span></button>
          </section>
        ) : page === 'register' ? (
          <section className="panel login-panel">
            <span className="eyebrow">Create new account</span> 
            <h1>Register</h1>
            <p>Choose a new username and password. Passwords will be stored as salted Argon2 hashes.</p>
            <form onSubmit={register}>
              <label htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                name="username"
                autoComplete="username"
                required
                minLength={5}
                maxLength={32}
                pattern="[A-Za-z0-9_.\-]+"
                title="5-32 characters: letters, numbers, underscore, dot, or hyphen"
              />
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={64}
              />
              <label htmlFor="reg-confirm">Confirm password</label>
              <input
                id="reg-confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
              />
              <button className="primary" type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create account'}
              </button>
            </form>
            {message && <p role="status" className="status">{message}</p>}
          </section>
        ) : (
          <section className="panel login-panel">
            <span className="eyebrow">Step 1 of 2 · Planned</span>
            <h1>Sign in</h1>
            <p>Enter a username and password. Credential verification and the second factor are still stubs.</p>
            <form onSubmit={login}>
              <label htmlFor="username">Username</label>
              <input id="username" name="username" autoComplete="username" required />
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required />
              <button className="primary" type="submit" disabled={submitting}>{submitting ? 'Checking…' : 'Continue'}</button>
            </form>
            {message && <p role="status" className="status">{message}</p>}
          </section>
        )}
      </main>
      <footer>Educational prototype · No working authentication yet</footer>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
