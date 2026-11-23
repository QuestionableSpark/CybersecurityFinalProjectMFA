import { FormEvent, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

function App() {
  const [page, setPage] = useState<'home' | 'login'>('home')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
        <a href="/" className="brand" onClick={(event) => { event.preventDefault(); setPage('home') }}>
          <span className="brand-mark">M</span> MFA Portal
        </a>
        <nav aria-label="Main navigation">
          <button className={page === 'home' ? 'active' : ''} onClick={() => setPage('home')}>Home</button>
          <button className={page === 'login' ? 'active' : ''} onClick={() => setPage('login')}>Login</button>
        </nav>
      </header>
      <main>
        {page === 'home' ? (
          <section className="panel intro">
            <span className="eyebrow">Cybersecurity course project</span>
            <h1>Explore multi-factor authentication.</h1>
            <p>A small portal for building and studying a two-step sign-in process. This homepage is public; authentication has not been implemented.</p>
            <button className="primary" onClick={() => setPage('login')}>Go to login <span aria-hidden="true">→</span></button>
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
