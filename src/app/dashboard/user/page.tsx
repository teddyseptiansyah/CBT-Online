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
      padding: "16px 20px",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "white", zIndex: 10
    }}>
      <span style={{
        fontSize: "15px",
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
      {/* Container utama dengan min-height agar bisa di-scroll secara alami */}
      <div className={`io-page${load ? " hidden" : ""}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <UserData.Provider value={userData as Users}>
          <ClassroomDataList.Provider value={classrooms}>
            <Navbar />
          </ClassroomDataList.Provider>
        </UserData.Provider>

        {/* Main Content Area */}
        <main className="io-main" style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            gap: "24px", 
            padding: "88px 24px 40px", /* 88px di atas memastikan tidak tertutup Navbar */
            maxWidth: "1200px", 
            margin: "0 auto", 
            width: "100%",
        }}>

          {/* Page header */}
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div>
              <p className="io-eyebrow" style={{ margin: "0 0 6px 0", fontSize: "11px" }}>Dashboard</p>
              <h1 className="io-title" style={{ margin: 0, fontSize: "28px" }}>Halo, <strong>{userData?.information.fullname.split(" ")[0]}</strong></h1>
            </div>
          </div>

          {/* Stats Grid */}
          {history.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}>
              {[
                { label: "Ujian Selesai", value: String(history.length), unit: "ujian", color: "var(--navy)" },
                { label: "Rata-rata Skor", value: String(avgScore), unit: "%", color: scoreColor(avgScore ?? 0) },
                { label: "Skor Terbaik", value: String(bestScore), unit: "%", color: scoreColor(bestScore ?? 0) },
              ].map(s => (
                <div key={s.label} className="io-card" style={{ padding: "16px 20px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: "8px", marginTop: 0 }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: "28px", fontWeight: 700, color: s.color, lineHeight: 1, margin: 0 }}>
                    {s.value}
                    <span style={{ fontSize: "13px", fontWeight: 400, marginLeft: "4px", color: "var(--ink-3)" }}>{s.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Table Container - Split Left & Right, Mengikuti Konten */}
          <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "24px",
              alignItems: "start" /* <-- Ini kuncinya agar card tabel tidak melar (adjustable mengikuti tinggi konten) */
          }}>
              
            {/* Classroom Card */}
            <div className="io-card">
              <CardHeader label="Daftar Classroom" count={`${classrooms.length} classroom`} />
              <div className="io-toolbar" style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
                <div className="io-search-wrap">
                  <span className="io-search-icon"><IcoSearch /></span>
                  <input className="io-search" type="text" placeholder="Cari classroom…"
                    value={searchQ} onChange={e => setSearchQ(e.target.value)} />
                </div>
              </div>
              <div style={{ width: "100%", overflowX: "auto" }}>
                {filtered.length === 0 ? (
                  <div className="io-empty" style={{ padding: "40px 20px" }}>
                    <p style={{ fontSize: "14px", margin: 0 }}>Belum ada classroom tersedia</p>
                  </div>
                ) : (
                  <table className="io-table" style={{ margin: 0 }}>
                    <thead>
                      <tr><th>Nama Classroom</th><th>Status</th><th>Aksi</th></tr>
                    </thead>
                    <tbody>
                      {filtered.map((v: ClassroomData, i: number) => (
                        <tr key={(v.classes._id as string) ?? i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td><span className="io-td-user">{v.classes.name}</span></td>
                          <td>
                            {v.is_blocked ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 600, color: "var(--red)", background: "var(--red-bg)", borderRadius: "6px", padding: "4px 8px" }}>
                                <IcoBan /> Diblokir
                              </span>
                            ) : (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 600, color: "var(--green)", background: "var(--green-bg)", borderRadius: "6px", padding: "4px 8px" }}>
                                Aktif
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="io-td-actions">
                              {v.is_blocked ? (
                                <button className="io-btn io-btn-ghost io-btn-sm" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
                                  Diblokir
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
                )}
              </div>
            </div>

            {/* History Card */}
            <div className="io-card">
              <CardHeader label="Histori Ujian" count={`${history.length} selesai`} />
              <div style={{ width: "100%", overflowX: "auto" }}>
                {history.length === 0 ? (
                  <div className="io-empty" style={{ padding: "40px 20px" }}>
                    <p style={{ fontSize: "14px", margin: 0 }}>Belum ada ujian yang diselesaikan</p>
                  </div>
                ) : (
                  <table className="io-table" style={{ margin: 0 }}>
                    <thead>
                      <tr><th>Nama Ujian</th><th style={{ textAlign: "center" }}>Benar / Total</th><th style={{ textAlign: "right" }}>Skor</th></tr>
                    </thead>
                    <tbody>
                      {history.map((v, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td><span className="io-td-user">{v.exam_name}</span></td>
                          <td style={{ textAlign: "center", color: "var(--ink-2)", fontSize: "13px", fontWeight: 500 }}>
                            {v.correct_total} / {v.total}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <span style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: 700,
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
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}