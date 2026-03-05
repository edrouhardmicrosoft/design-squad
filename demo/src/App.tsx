import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [email, setEmail] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-brand">
          <span className="nav-logo">◆</span>
          <span className="nav-title">Design Squad Demo</span>
        </div>
        <div className="nav-links">
          <a href="#components">Components</a>
          <a href="#cards">Cards</a>
          <a href="#forms">Forms</a>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <main className="main">
        {/* Hero */}
        <section className="hero">
          <h1>Agentation Demo</h1>
          <p className="hero-subtitle">
            Annotate any element on this page to test the feedback loop.
            Click the Agentation overlay to start marking up the UI.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </section>

        {/* Typography */}
        <section id="components" className="section">
          <h2 className="section-title">Typography</h2>
          <div className="type-scale">
            <h1>Heading 1 — The quick brown fox</h1>
            <h2>Heading 2 — The quick brown fox</h2>
            <h3>Heading 3 — The quick brown fox</h3>
            <h4>Heading 4 — The quick brown fox</h4>
            <p>Body text — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p className="text-small">Small text — Ut enim ad minim veniam, quis nostrud exercitation.</p>
            <p><a href="#">This is a link</a> within body text.</p>
          </div>
        </section>

        {/* Buttons */}
        <section className="section">
          <h2 className="section-title">Buttons</h2>
          <div className="button-grid">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-outline">Outline</button>
            <button className="btn btn-danger">Danger</button>
            <button className="btn btn-primary" disabled>Disabled</button>
            <button className="btn btn-ghost">Ghost</button>
          </div>
          <div className="button-grid" style={{ marginTop: '1rem' }}>
            <button className="btn btn-primary btn-sm">Small</button>
            <button className="btn btn-primary">Medium</button>
            <button className="btn btn-primary btn-lg">Large</button>
          </div>
        </section>

        {/* Cards */}
        <section id="cards" className="section">
          <h2 className="section-title">Cards</h2>
          <div className="card-grid">
            <div className="card">
              <div className="card-img" style={{ background: '#6366f1' }} />
              <div className="card-body">
                <h3>Research Phase</h3>
                <p>User interviews, competitive analysis, and design audits to ground the project in real needs.</p>
                <span className="badge badge-blue">Research</span>
              </div>
            </div>
            <div className="card">
              <div className="card-img" style={{ background: '#f59e0b' }} />
              <div className="card-body">
                <h3>Planning Phase</h3>
                <p>Information architecture, user flows, wireframes, and detailed specifications.</p>
                <span className="badge badge-yellow">Planning</span>
              </div>
            </div>
            <div className="card">
              <div className="card-img" style={{ background: '#10b981' }} />
              <div className="card-body">
                <h3>Build Phase</h3>
                <p>Component development, design system implementation, and interactive prototyping.</p>
                <span className="badge badge-green">Building</span>
              </div>
            </div>
          </div>
        </section>

        {/* Counter */}
        <section className="section">
          <h2 className="section-title">Interactive Counter</h2>
          <div className="counter-card">
            <span className="counter-value">{count}</span>
            <div className="counter-controls">
              <button className="btn btn-outline" onClick={() => setCount(c => c - 1)}>−</button>
              <button className="btn btn-outline" onClick={() => setCount(0)}>Reset</button>
              <button className="btn btn-outline" onClick={() => setCount(c => c + 1)}>+</button>
            </div>
          </div>
        </section>

        {/* Form */}
        <section id="forms" className="section">
          <h2 className="section-title">Form Elements</h2>
          <form className="form" onSubmit={e => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" placeholder="Jane Doe" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              {email && !email.includes('@') && (
                <span className="form-error">Please enter a valid email</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role">
                <option value="">Select a role...</option>
                <option value="designer">Designer</option>
                <option value="developer">Developer</option>
                <option value="pm">Product Manager</option>
                <option value="researcher">Researcher</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" rows={3} placeholder="Any additional context..." />
            </div>
            <div className="form-group form-check">
              <input id="terms" type="checkbox" />
              <label htmlFor="terms">I agree to the terms and conditions</label>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </section>

        {/* Alerts */}
        <section className="section">
          <h2 className="section-title">Alerts & Badges</h2>
          <div className="alert-stack">
            <div className="alert alert-info">ℹ️ This is an informational message.</div>
            <div className="alert alert-success">✅ Operation completed successfully.</div>
            <div className="alert alert-warning">⚠️ Please review before continuing.</div>
            <div className="alert alert-error">❌ Something went wrong. Please try again.</div>
          </div>
          <div className="badge-row">
            <span className="badge badge-blue">Design</span>
            <span className="badge badge-green">Approved</span>
            <span className="badge badge-yellow">In Review</span>
            <span className="badge badge-red">Blocked</span>
            <span className="badge badge-gray">Archived</span>
          </div>
        </section>

        {/* Table */}
        <section className="section">
          <h2 className="section-title">Data Table</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Tasks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Oracle</td>
                  <td>Strategic Advisor</td>
                  <td><span className="badge badge-green">Active</span></td>
                  <td>12</td>
                </tr>
                <tr>
                  <td>Researcher</td>
                  <td>Research & Discovery</td>
                  <td><span className="badge badge-green">Active</span></td>
                  <td>8</td>
                </tr>
                <tr>
                  <td>Planner</td>
                  <td>Spec & Flow</td>
                  <td><span className="badge badge-yellow">Busy</span></td>
                  <td>15</td>
                </tr>
                <tr>
                  <td>Builder</td>
                  <td>Implementation</td>
                  <td><span className="badge badge-green">Active</span></td>
                  <td>23</td>
                </tr>
                <tr>
                  <td>Scribe</td>
                  <td>Documentation</td>
                  <td><span className="badge badge-gray">Silent</span></td>
                  <td>6</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Design Squad Demo — Built for testing <a href="https://agentation.dev">Agentation</a> annotations</p>
      </footer>
    </div>
  )
}

export default App
