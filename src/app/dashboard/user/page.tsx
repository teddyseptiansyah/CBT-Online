"use client"
import { useEffect, useState } from "react"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import Navbar from "@/components/UserNavbar"
import { ClassroomData } from "@/app/api/[[...route]]/types/class"
import { ClassroomDataList } from "@/context/ClassroomDataList"

export default function UserDashboard() {
  const [userData,  setUserData]  = useState<Users>()
  const [load,      setLoad]      = useState(true)
  const [classrooms,setClassrooms]= useState<ClassroomData[]>([])
  const [searchQ,   setSearchQ]   = useState("")

  function loadClassList() {
    fetch("/api/user/", {
      method: "POST",
      body: JSON.stringify({ method: "GET_CLASSROOM" }),
    }).then(r => r.json()).then(json => setClassrooms(json.data as ClassroomData[]))
  }

  useEffect(() => {
    fetch("/api/auth/", {
      method: "POST",
      body: JSON.stringify({ method: "AUTHENTICATION" }),
    }).then(r => r.json()).then(json => {
      if (json.status !== "OK") { document.location.href = "/signin"; return }
      switch (json.data.role) {
        case "user":
          setUserData(json.data)
          setLoad(false)
          break
        case "instructor": document.location.href = "/dashboard/instructor"; break
        case "admin":      document.location.href = "/dashboard/admin";      break
      }
    })
  }, [])

  useEffect(() => { if (!load) loadClassList() }, [load])

  const filtered = classrooms.filter(v =>
    !searchQ || v.classes.name.toLowerCase().includes(searchQ.toLowerCase())
  )

  /* ── icons ── */
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
  const IcoClass = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
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

          <div className="io-ph">
            <div>
              <p className="io-eyebrow">Dashboard</p>
              <h1 className="io-title">Daftar <strong>Classroom</strong></h1>
            </div>
            <span className="io-count">{classrooms.length} classroom</span>
          </div>

          <div className="io-card">
            <div className="io-toolbar">
              <div className="io-search-wrap">
                <span className="io-search-icon"><IcoSearch /></span>
                <input
                  className="io-search"
                  type="text"
                  placeholder="Cari classroom…"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                />
              </div>
              <span className="io-meta">
                Menampilkan {filtered.length} dari {classrooms.length}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="io-empty">
                <IcoClass />
                <p>Belum ada classroom tersedia</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="io-table">
                  <thead>
                    <tr>
                      <th>Nama Classroom</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((v: ClassroomData, i: number) => (
                      <tr key={(v.classes._id as string) ?? i}>
                        <td><span className="io-td-user">{v.classes.name}</span></td>
                        <td>
                          {v.is_blocked ? (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "5px",
                              fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em",
                              color: "oklch(68% 0.19 27)",
                              background: "oklch(68% 0.19 27 / 0.1)",
                              border: "1px solid oklch(68% 0.19 27 / 0.25)",
                              borderRadius: "4px", padding: "2px 8px",
                            }}>
                              <IcoBan /> Diblokir
                            </span>
                          ) : (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: "5px",
                              fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em",
                              color: "oklch(68% 0.14 165)",
                              background: "oklch(68% 0.14 165 / 0.1)",
                              border: "1px solid oklch(68% 0.14 165 / 0.25)",
                              borderRadius: "4px", padding: "2px 8px",
                            }}>
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
                              <a
                                href={`/dashboard/user/class/${v.classes._id}`}
                                className="io-btn io-btn-ghost io-btn-sm"
                              >
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

        </main>
      </div>
    </>
  )
}