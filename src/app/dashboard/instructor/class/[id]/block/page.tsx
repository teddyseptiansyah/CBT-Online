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
const IcoTrash = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
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
              />
            </div>
            <button className="io-btn io-btn-ghost io-btn-sm" onClick={loadUser} style={{ marginBottom: "12px" }}>
              Cari
            </button>
            <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
              <table className="io-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>User</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((v, i) => (
                    <tr key={v._id as string}>
                      <td>{i + 1}</td>
                      <td><span className="io-td-user">{v.username}</span> <span style={{ color: "oklch(55% 0.03 258)", fontSize: "0.8rem" }}>({v.information.fullname})</span></td>
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

      <div className={`io-page${load ? " hidden" : ""}`}>
        <UserData.Provider value={userData as Users}>
          <ClassroomList.Provider value={classrooms}>
            <Navbar />
          </ClassroomList.Provider>
        </UserData.Provider>

        <main className="io-main">
          <div className="io-ph">
            <div>
              <p className="io-eyebrow">Manajemen Kelas</p>
              <h1 className="io-title">Daftar <strong>User Diblokir</strong></h1>
            </div>
            <button className="io-btn io-btn-danger" onClick={async () => { openAdd(); await loadUser() }}>
              <IcoPlus /> Blokir User
            </button>
          </div>

          <div className="io-card">
            <div style={{ overflowX: "auto" }}>
              <table className="io-table">
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
                        <div className="io-empty">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M4.93 4.93l14.14 14.14"/>
                          </svg>
                          <p>Belum ada user diblokir</p>
                        </div>
                      </td>
                    </tr>
                  ) : blockUsers.map((v, i) => (
                    <tr key={v._id as string}>
                      <td>{i + 1}</td>
                      <td>{v.information.fullname}</td>
                      <td>
                        <button className="io-btn io-btn-ghost io-btn-sm" onClick={() => deleteUser(v._id as string)}>
                          Buka Blokir
                        </button>
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