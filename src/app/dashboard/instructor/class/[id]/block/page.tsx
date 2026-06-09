/* Hallmark · macrostructure: Workbench · genre: modern-minimal
 * tone: institutional-austere · anchor hue: oklch(28% 0.14 258) navy
 * CSS → globals.css (semua class io-* ada di sana)
 */
"use client"
import { Users } from "@/app/api/[[...route]]/types/user"
import Navbar from "@/components/InstructorNavbar"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ClassroomList } from "@/context/ClassroomList"
import { Classroom } from "@/app/api/[[...route]]/types/class"

const IcoPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IcoClose = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IcoSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

export default function BlockPage() {
  const [userData,   setUserData]   = useState<Users>()
  const [load,       setLoad]       = useState(true)
  const [users,      setUsers]      = useState<Users[]>([])
  const [blockUsers, setBlockUsers] = useState<Users[]>([])
  const [src,        setSrc]        = useState("")
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const { id } = useParams()
  const overlayAdd = useRef<HTMLDivElement>(null)

  const openAdd  = () => overlayAdd.current?.classList.add("io-open")
  const closeAdd = () => overlayAdd.current?.classList.remove("io-open")

  useEffect(() => {
    fetch("/api/auth/", {
      method: "POST",
      body: JSON.stringify({ method: "AUTHENTICATION" }),
    })
      .then(r => r.json())
      .then(json => {
        if (json.status !== "OK") { document.location.href = "/signin"; return }
        switch (json.data.role) {
          case "instructor":
            setUserData(json.data)
            setLoad(false)
            loadBlockUser()
            loadClassList()
            break
          case "user":  document.location.href = "/dashboard/user";  break
          case "admin": document.location.href = "/dashboard/admin"; break
        }
      })
  }, [])

  function loadClassList() {
    fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "GET_ALL_CLASSROOM" }),
    })
      .then(r => r.json())
      .then(json => setClassrooms(json.data as Classroom[]))
  }

  async function loadUser() {
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "GET_BLOCK_USERS_NOT_IN", data: { class_id: id, q: src } }),
    })
    const json = await res.json()
    setUsers(json.data)
  }

  async function loadBlockUser() {
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "GET_BLOCK_USERS", data: { class_id: id } }),
    })
    const json = await res.json()
    setBlockUsers(json.data)
  }

  async function addUser(userid: string) {
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "SET_BLOCK_USERS", data: { class_id: id, user_id: userid } }),
    })
    const json = await res.json()
    if (json.status === "FAIL") return
    await loadUser(); await loadBlockUser()
  }

  async function deleteUser(userid: string) {
    const res  = await fetch("/api/instructor", {
      method: "POST",
      body: JSON.stringify({ method: "UNSET_BLOCK_USERS", data: { class_id: id, user_id: userid } }),
    })
    const json = await res.json()
    if (json.status === "FAIL") return
    await loadBlockUser()
  }

  return (
    <>
      <Splash isLoad={load} />

      {/* ── Add Block Modal ── */}
      <div className="io-overlay" ref={overlayAdd} onClick={e => { if (e.target === overlayAdd.current) closeAdd() }}>
        <div className="io-modal" onClick={e => e.stopPropagation()}>
          <div className="io-mhead">
            <span className="io-mtitle">Blokir User</span>
            <button className="io-mclose" onClick={closeAdd}><IcoClose /></button>
          </div>
          <div className="io-mbody">
            <div className="io-search-wrap" style={{ marginBottom: "12px" }}>
              <span className="io-search-icon"><IcoSearch /></span>
              <input
                className="io-search"
                type="text"
                placeholder="Cari user…"
                value={src}
                onChange={e => setSrc(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") loadUser() }}
                style={{ width: "100%" }}
              />
            </div>
            <button className="io-btn io-btn-ghost io-btn-sm" onClick={loadUser} style={{ marginBottom: "12px" }}>
              Cari
            </button>
            <div style={{ maxHeight: "50vh", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "8px" }}>
              <table className="io-table" style={{ margin: 0 }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 5 }}>
                  <tr>
                    <th>No</th>
                    <th>User</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center", padding: "24px 12px", color: "var(--ink-3)", fontSize: "13px" }}>
                        Pencarian kosong
                      </td>
                    </tr>
                  ) : users.map((v, i) => (
                    <tr key={v._id as string} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td>{i + 1}</td>
                      <td>
                        <span className="io-td-user">{v.username}</span> 
                        <span style={{ color: "var(--ink-3)", fontSize: "0.8rem", marginLeft: "4px" }}>({v.information.fullname})</span>
                      </td>
                      <td>
                        <button className="io-btn io-btn-danger io-btn-sm" onClick={() => addUser(v._id as string)}>
                          <IcoPlus /> Blokir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="io-mfoot">
            <button className="io-btn io-btn-ghost" onClick={closeAdd}>Tutup</button>
          </div>
        </div>
      </div>

      {/* Container utama dengan min-height agar bisa di-scroll secara alami */}
      <div className={`io-page${load ? " hidden" : ""}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <UserData.Provider value={userData as Users}>
          <ClassroomList.Provider value={classrooms}>
            <Navbar />
          </ClassroomList.Provider>
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
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p className="io-eyebrow" style={{ margin: "0 0 6px 0", fontSize: "11px" }}>Manajemen Kelas</p>
              <h1 className="io-title" style={{ margin: 0, fontSize: "28px" }}>Daftar <strong>User Diblokir</strong></h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="io-count">{blockUsers.length} user</span>
              <button className="io-btn io-btn-danger" onClick={async () => { openAdd(); await loadUser() }}>
                <IcoPlus /> Blokir User
              </button>
            </div>
          </div>

          {/* Table card */}
          <div className="io-card" style={{ width: "100%" }}>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table className="io-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Peserta</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {blockUsers.length === 0 ? (
                    <tr>
                      <td colSpan={3}>
                        <div className="io-empty" style={{ padding: "60px 20px" }}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M4.93 4.93l14.14 14.14"/>
                          </svg>
                          <p style={{ fontSize: "14px", margin: "10px 0 0" }}>Belum ada user diblokir</p>
                        </div>
                      </td>
                    </tr>
                  ) : blockUsers.map((v, i) => (
                    <tr key={v._id as string} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td>{i + 1}</td>
                      <td style={{ fontSize: "14px" }}>{v.information.fullname}</td>
                      <td>
                        <div className="io-td-actions">
                          <button className="io-btn io-btn-ghost io-btn-sm" onClick={() => deleteUser(v._id as string)}>
                            Buka Blokir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}