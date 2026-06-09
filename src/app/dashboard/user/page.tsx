"use client"
import { useEffect, useState } from "react"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import Navbar from "@/components/UserNavbar"
import { ClassroomData } from "@/app/api/[[...route]]/types/class"
import { ClassroomDataList } from "@/context/ClassroomDataList"

type HistoryItem = {
  exam_id: string
  exam_name: string
  class_id: string
  total: number
  correct_total: number
  score: number
}

const IcoSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IcoArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IcoBan = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
  </svg>
)

function scoreColor(s: number) {
  if (s >= 80) return "var(--green)"
  if (s >= 60) return "oklch(58% 0.14 75)"
  return "var(--red)"
}
function scoreBg(s: number) {
  if (s >= 80) return "var(--green-bg)"
  if (s >= 60) return "oklch(96% 0.04 75)"
  return "var(--red-bg)"
}

export default function UserDashboard() {
  const [userData,   setUserData]   = useState<Users>()
  const [load,       setLoad]       = useState(true)
  const [classrooms, setClassrooms] = useState<ClassroomData[]>([])
  const [history,    setHistory]    = useState<HistoryItem[]>([])
  const [searchQ,    setSearchQ]    = useState("")

  function loadClassList() {
    fetch("/api/user/", { method: "POST", body: JSON.stringify({ method: "GET_CLASSROOM" }) })
      .then(r => r.json()).then(json => setClassrooms(json.data as ClassroomData[]))
  }
  function loadHistory() {
    fetch("/api/user/", { method: "POST", body: JSON.stringify({ method: "GET_HISTORY" }) })
      .then(r => r.json()).then(json => { if (json.status === "OK") setHistory(json.data as HistoryItem[]) })
  }

  useEffect(() => {
    fetch("/api/auth/", { method: "POST", body: JSON.stringify({ method: "AUTHENTICATION" }) })
      .then(r => r.json()).then(json => {
        if (json.status !== "OK") { document.location.href = "/signin"; return }
        switch (json.data.role) {
          case "user": setUserData(json.data); setLoad(false); break
          case "instructor": document.location.href = "/dashboard/instructor"; break
          case "admin":      document.location.href = "/dashboard/admin"; break
        }
      })
  }, [])

  useEffect(() => { if (!load) { loadClassList(); loadHistory() } }, [load])

  const filtered = classrooms.filter(v =>
    !searchQ || v.classes.name.toLowerCase().includes(searchQ.toLowerCase())
  )

  const avgScore  = history.length ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length) : null
  const bestScore = history.length ? Math.max(...history.map(h => h.score)) : null

  const CardHeader = ({ label, count }: { label: string; count?: string }) => (
    <div style={{
      padding: "14px 20px",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <span style={{
        fontFamily: "var(--ff-d)",
        fontSize: "14px",
        fontWeight: 600,
        color: "var(--ink)",
        letterSpacing: "-0.01em",
      }}>{label}</span>
      {count && <span className="io-count">{count}</span>}
    </div>
  )

  return (
    <>
      <Splash isLoad={load} />
      <div className={`io-page${load ? " hidden" : ""}`}>
        <UserData.Provider value={userData as Users}>
          <ClassroomDataList.Provider value={classrooms}>
            <Navbar />
          </ClassroomDataList.Provider>
        </UserData.Provider>

        <main className="io-main">

          {/* Page header */}
          <div className="io-ph">
            <div>
              <p className="io-eyebrow">Dashboard</p>
              <h1 className="io-title">Halo, <strong>{userData?.information.fullname.split(" ")[0]}</strong></h1>
            </div>
          </div>

          {/* Stats */}
          {history.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: "12px",
              marginBottom: "20px",
            }}>
              {[
                { label: "Ujian Selesai", value: String(history.length), unit: "ujian", color: "var(--navy)" },
                { label: "Rata-rata Skor", value: String(avgScore), unit: "%", color: scoreColor(avgScore ?? 0) },
                { label: "Skor Terbaik", value: String(bestScore), unit: "%", color: scoreColor(bestScore ?? 0) },
              ].map(s => (
                <div key={s.label} className="io-card" style={{ padding: "18px 20px" }}>
                  <p style={{ fontFamily: "var(--ff-m)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: "10px" }}>
                    {s.label}
                  </p>
                  <p style={{ fontFamily: "var(--ff-d)", fontSize: "26px", fontWeight: 700, color: s.color, lineHeight: 1, margin: 0 }}>
                    {s.value}
                    <span style={{ fontSize: "13px", fontWeight: 400, marginLeft: "4px", color: "var(--ink-3)" }}>{s.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Classroom */}
          <div className="io-card" style={{ marginBottom: "20px" }}>
            <CardHeader label="Daftar Classroom" count={`${classrooms.length} classroom`} />
            <div className="io-toolbar">
              <div className="io-search-wrap">
                <span className="io-search-icon"><IcoSearch /></span>
                <input className="io-search" type="text" placeholder="Cari classroom…"
                  value={searchQ} onChange={e => setSearchQ(e.target.value)} />
              </div>
              <span className="io-meta">Menampilkan {filtered.length} dari {classrooms.length}</span>
            </div>
            {filtered.length === 0 ? (
              <div className="io-empty">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <p>Belum ada classroom tersedia</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="io-table">
                  <thead>
                    <tr><th>Nama Classroom</th><th>Status</th><th>Aksi</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map((v: ClassroomData, i: number) => (
                      <tr key={(v.classes._id as string) ?? i}>
                        <td><span className="io-td-user">{v.classes.name}</span></td>
                        <td>
                          {v.is_blocked ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 500, color: "var(--red)", background: "var(--red-bg)", border: "1px solid oklch(68% 0.19 27 / 0.25)", borderRadius: "4px", padding: "2px 8px" }}>
                              <IcoBan /> Diblokir
                            </span>
                          ) : (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 500, color: "var(--green)", background: "var(--green-bg)", border: "1px solid oklch(68% 0.14 165 / 0.25)", borderRadius: "4px", padding: "2px 8px" }}>
                              Aktif
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="io-td-actions">
                            {v.is_blocked ? (
                              <button className="io-btn io-btn-ghost io-btn-sm" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
                                <IcoBan /> Diblokir
                              </button>
                            ) : (
                              <a href={`/dashboard/user/class/${v.classes._id}`} className="io-btn io-btn-ghost io-btn-sm">
                                <IcoArrow /> Masuk
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* History */}
          <div className="io-card">
            <CardHeader label="Histori Ujian" count={`${history.length} selesai`} />
            {history.length === 0 ? (
              <div className="io-empty">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <p>Belum ada ujian yang diselesaikan</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="io-table">
                  <thead>
                    <tr><th>Nama Ujian</th><th style={{ textAlign: "center" }}>Benar / Total</th><th style={{ textAlign: "right" }}>Skor</th></tr>
                  </thead>
                  <tbody>
                    {history.map((v, i) => (
                      <tr key={i}>
                        <td><span className="io-td-user">{v.exam_name}</span></td>
                        <td style={{ textAlign: "center", color: "var(--ink-2)", fontSize: "13px", fontFamily: "var(--ff-m)" }}>
                          {v.correct_total} / {v.total}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 700,
                            fontFamily: "var(--ff-m)",
                            color: scoreColor(v.score),
                            background: scoreBg(v.score),
                          }}>
                            {v.score}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  )
}