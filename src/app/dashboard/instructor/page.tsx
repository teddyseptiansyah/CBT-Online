"use client"
import { useEffect, useState } from "react"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import Navbar from "@/components/InstructorNavbar"
import { Classroom } from "@/app/api/[[...route]]/types/class"
import { ClassroomList } from "@/context/ClassroomList"

export default function InstructorDashboard() {
  const [userData,   setUserData]   = useState<Users>()
  const [load,       setLoad]       = useState(true)
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [searchQ,    setSearchQ]    = useState("")

  function loadClassList() {
    fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "GET_ALL_CLASSROOM" }),
    }).then(r => r.json()).then(json => setClassrooms(json.data as Classroom[]))
  }

  useEffect(() => {
    fetch("/api/auth/", {
      method: "POST",
      body: JSON.stringify({ method: "AUTHENTICATION" }),
    }).then(r => r.json()).then(json => {
      if (json.status !== "OK") { document.location.href = "/signin"; return }  // ← fix: tambah return
      switch (json.data.role) {
        case "instructor":
          setUserData(json.data)
          setLoad(false)
          break
        case "user":  document.location.href = "/dashboard/user";  break
        case "admin": document.location.href = "/dashboard/admin"; break
      }
    })
  }, [])

  useEffect(() => { if (!load) loadClassList() }, [load])

  const filtered = classrooms.filter(v =>
    !searchQ || v.name.toLowerCase().includes(searchQ.toLowerCase())
  )

  /* ── icons ── */
  const IcoPlus = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
  const IcoArrow = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
  const IcoSearch = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )

  return (
    <>
      <Splash isLoad={load} />

      <div className={`io-page${load ? " hidden" : ""}`}>
        <UserData.Provider value={userData as Users}>
          <ClassroomList.Provider value={classrooms}>
            <Navbar />
          </ClassroomList.Provider>
        </UserData.Provider>

        <main className="io-main">

          <div className="io-ph">
            <div>
              <p className="io-eyebrow">Instructor</p>
              <h1 className="io-title">Daftar <strong>Classroom</strong></h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="io-count">{classrooms.length} classroom</span>
              <a href="/dashboard/instructor/class/add" className="io-btn io-btn-primary">
                <IcoPlus /> Tambah Classroom
              </a>
            </div>
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
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <p>Belum ada classroom</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="io-table">
                  <thead>
                    <tr>
                      <th>Nama Classroom</th>
                      <th>Visibilitas</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((v: Classroom, i: number) => (
                      <tr key={(v._id as string) ?? i}>
                        <td><span className="io-td-user">{v.name}</span></td>
                        <td>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: "5px",
                            fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em",
                            color: v.is_public ? "oklch(68% 0.14 165)" : "oklch(60% 0.08 258)",
                            background: v.is_public ? "oklch(68% 0.14 165 / 0.1)" : "oklch(60% 0.08 258 / 0.1)",
                            border: `1px solid ${v.is_public ? "oklch(68% 0.14 165 / 0.25)" : "oklch(60% 0.08 258 / 0.25)"}`,
                            borderRadius: "4px", padding: "2px 8px",
                          }}>
                            {v.is_public ? "Publik" : "Privat"}
                          </span>
                        </td>
                        <td>
                          <div className="io-td-actions">
                            <a
                              href={`/dashboard/instructor/class/${v._id}`}
                              className="io-btn io-btn-ghost io-btn-sm"
                            >
                              <IcoArrow /> Buka
                            </a>
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