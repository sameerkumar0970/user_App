import React, { useEffect, useMemo, useState } from 'react'
import { fetchUsers, User } from './api'

type KramKundli = 'name' | 'createdAt'


function prashthKaro<T>(samu: T[], prashth: number, prPrashth: number) {
  const aarambh = (prashth - 1) * prPrashth
  return samu.slice(aarambh, aarambh + prPrashth)
}


function prarambhikAkshar(naam: string) {
  const tukde = naam.trim().split(' ')
  if (tukde.length === 1) return tukde[0][0].toUpperCase()
  return (tukde[0][0] + tukde[tukde.length - 1][0]).toUpperCase()
}


function rangNaamSe(naam: string) {
  const rang = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  const sankhya = naam.split('').reduce((yog, akshar) => yog + akshar.charCodeAt(0), 0)
  return rang[sankhya % rang.length]
}

export default function UpbhoktaDirectory() {
  const [upbhoktaSuchi, setUpbhoktaSuchi] = useState<User[] | null>(null)
  const [trutiSthiti, setTrutiSthiti] = useState<string | null>(null)
  const [pratikshaSthiti, setPratikshaSthiti] = useState(true)

  const [khojShabd, setKhojShabd] = useState('')
  const [kramKundli, setKramKundli] = useState<KramKundli>('name')
  const [dishaKram, setDishaKram] = useState<'asc' | 'desc'>('asc')
  const [vartamanPrashth, setVartamanPrashth] = useState(1)
  const [prPrashthSankhya, setPrPrashthSankhya] = useState(9) // 3×3 grid
  const [chayanitUpbhokta, setChayanitUpbhokta] = useState<User | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUsers()
        setUpbhoktaSuchi(data)
      } catch (e: any) {
        setTrutiSthiti(e.message || 'Failed to load')
      } finally {
        setPratikshaSthiti(false)
      }
    })()
  }, [])

  const chhantaSuchi = useMemo(() => {
    if (!upbhoktaSuchi) return []
    const khojShabdTrim = khojShabd.trim().toLowerCase()
    const aadhaarSuchi = khojShabdTrim
      ? upbhoktaSuchi.filter(
          (u) =>
            u.name?.toLowerCase().includes(khojShabdTrim) ||
            u.email?.toLowerCase().includes(khojShabdTrim),
        )
      : upbhoktaSuchi
    const kramitSuchi = [...aadhaarSuchi].sort((a, b) => {
      const aMoolyaSuchi = (a as any)[kramKundli] ?? ''
      const bMoolyaSuchi = (b as any)[kramKundli] ?? ''
      if (kramKundli === 'createdAt') {
        const antarSuchi = +new Date(aMoolyaSuchi) - +new Date(bMoolyaSuchi)
        return dishaKram === 'asc' ? antarSuchi : -antarSuchi
      } else {
        const antarSuchi = String(aMoolyaSuchi).localeCompare(String(bMoolyaSuchi))
        return dishaKram === 'asc' ? antarSuchi : -antarSuchi
      }
    })
    return kramitSuchi
  }, [upbhoktaSuchi, khojShabd, kramKundli, dishaKram])

  const kulPrashthSankhya = Math.max(1, Math.ceil(chhantaSuchi.length / prPrashthSankhya))
  const prashthVastuSuchi = prashthKaro(chhantaSuchi, vartamanPrashth, prPrashthSankhya)

  useEffect(() => {
    if (vartamanPrashth > kulPrashthSankhya) setVartamanPrashth(1)
  }, [kulPrashthSankhya])

  return (
    <div className="container">
      <h1 className="title">Users Directory</h1>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="stack">
          <input
            className="input"
            placeholder="Search by name or email"
            value={khojShabd}
            onChange={(e) => setKhojShabd(e.target.value)}
          />
          <select
            className="input"
            value={kramKundli}
            onChange={(e) => setKramKundli(e.target.value as KramKundli)}
          >
            <option value="name">Sort by Name</option>
            <option value="createdAt">Sort by Created Date</option>
          </select>
          <button
            className="btn ghost"
            onClick={() => setDishaKram((d) => (d === 'asc' ? 'desc' : 'asc'))}
          >
            {dishaKram === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      {pratikshaSthiti && <div className="card">Loading…</div>}
      {trutiSthiti && <div className="card">Error: {trutiSthiti}</div>}

      {upbhoktaSuchi && (
        <>
          <div className="grid-cards">
            {prashthVastuSuchi.map((u) => (
              <div
                key={u.id}
                className="user-card"
                onClick={() => setChayanitUpbhokta(u)}
              >
                <div className="avatar-wrapper">
                  {u.avatar ? (
                    <img
                      className="avatar-lg"
                      src={u.avatar}
                      alt={u.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const parent = e.currentTarget.parentElement
                        if (parent) {
                          parent.innerHTML = `<div class='avatar-fallback' style='background:${rangNaamSe(
                            u.name,
                          )}'>${prarambhikAkshar(u.name)}</div>`
                        }
                      }}
                    />
                  ) : (
                    <div
                      className="avatar-fallback"
                      style={{ background: rangNaamSe(u.name) }}
                    >
                      {prarambhikAkshar(u.name)}
                    </div>
                  )}
                </div>
                <h3 className="user-name">{u.name}</h3>
                <p className="muted">{u.email}</p>
                <div className="muted small">
                  Joined: {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          <div
            className="row"
            style={{ marginTop: 20, justifyContent: 'space-between' }}
          >
            <div className="muted">
              Page {vartamanPrashth} of {kulPrashthSankhya} — {chhantaSuchi.length} results
            </div>
            <div className="stack">
              <button
                className="btn ghost"
                onClick={() => setVartamanPrashth(1)}
                disabled={vartamanPrashth === 1}
              >
                First
              </button>
              <button
                className="btn"
                onClick={() => setVartamanPrashth((p) => Math.max(1, p - 1))}
                disabled={vartamanPrashth === 1}
              >
                Prev
              </button>
              <button
                className="btn"
                onClick={() => setVartamanPrashth((p) => Math.min(kulPrashthSankhya, p + 1))}
                disabled={vartamanPrashth === kulPrashthSankhya}
              >
                Next
              </button>
              <button
                className="btn ghost"
                onClick={() => setVartamanPrashth(kulPrashthSankhya)}
                disabled={vartamanPrashth === kulPrashthSankhya}
              >
                Last
              </button>
            </div>
          </div>
        </>
      )}

      {chayanitUpbhokta && (
        <div className="modal-backdrop" onClick={() => setChayanitUpbhokta(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>{chayanitUpbhokta.name}</h3>
              <button className="btn ghost" onClick={() => setChayanitUpbhokta(null)}>
                Close
              </button>
            </div>
            <div className="row" style={{ marginTop: 10 }}>
              <div className="avatar-wrapper">
                {chayanitUpbhokta.avatar ? (
                  <img
                    className="avatar-lg"
                    src={chayanitUpbhokta.avatar}
                    alt={chayanitUpbhokta.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        parent.innerHTML = `<div class='avatar-fallback' style='background:${rangNaamSe(
                          chayanitUpbhokta.name,
                        )}'>${prarambhikAkshar(chayanitUpbhokta.name)}</div>`
                      }
                    }}
                  />
                ) : (
                  <div
                    className="avatar-fallback"
                    style={{ background: rangNaamSe(chayanitUpbhokta.name) }}
                  >
                    {prarambhikAkshar(chayanitUpbhokta.name)}
                  </div>
                )}
              </div>
              <div>
                <div>
                  <span className="muted">Email:</span> {chayanitUpbhokta.email}
                </div>
                <div>
                  <span className="muted">Joined:</span>{' '}
                  {new Date(chayanitUpbhokta.createdAt).toLocaleString()}
                </div>
                <div className="stack" style={{ marginTop: 10 }}>
                  <span className="tag">ID: {chayanitUpbhokta.id}</span>
                  <span className="tag">
                    {chayanitUpbhokta.avatar ? 'Has Avatar' : 'No Avatar'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
