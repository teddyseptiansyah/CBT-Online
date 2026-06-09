/* Hallmark · macrostructure: Workbench · genre: modern-minimal
 * tone: institutional-austere · anchor hue: oklch(28% 0.14 258) navy
 */
"use client"
import { Users } from "@/app/api/[[...route]]/types/user"
import Navbar from "@/components/InstructorNavbar"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import { useEffect, useRef, useState } from "react"
import { ClassroomList } from "@/context/ClassroomList"
import { Classroom } from "@/app/api/[[...route]]/types/class"

export default function AddClass() {
  const [userData,   setUserData]   = useState<Users>()
  const [load,       setLoad]       = useState(true)
  const [input,      setInput]      = useState({ classname: "", ispublic: false })
  const [process,    setProcess]    = useState(false)
  const [errorMsg,   setErrorMsg]   = useState("")
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [toast,      setToast]      = useState<{ msg: string; ok: boolean } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  function showToast(msg: string, ok = true) {
    clearTimeout(toastTimer.current)
    setToast({ msg, ok })
    toastTimer.current = setTimeout(() => setToast(null), 3200)
  }

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
      if (json.status !== "OK") { document.location.href = "/signin"; return }
      switch (json.data.role) {
        case "instructor":
          setUserData(json.data)
          setLoad(false)
          loadClassList()
          break
        case "user":  document.location.href = "/dashboard/user";  break
        case "admin": document.location.href = "/dashboard/admin"; break
      }
    })
  }, [])

  function submit() {
    fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({
        method: "CREATE_CLASSROOM",
        data: { class_name: input.classname, is_public: input.ispublic },
      }),
    }).then(r => r.json()).then(json => {
      if (json.status === "OK") {
        document.location.href = "/dashboard/instructor"
      } else if (json.status === "EXIST") {
        setProcess(false)
        setErrorMsg("Classroom sudah ada.")
        showToast("Classroom sudah ada.", false)
      } else {
        setProcess(false)
        setErrorMsg("Terjadi kesalahan pada server.")
        showToast("Terjadi kesalahan pada server.", false)
      }
    })
  }

  const IcoCheck = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )

  return (
    <>
      <Splash isLoad={load} />

      <div className={`io-page${load ? " hidden" : ""}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <UserData.Provider value={userData as Users}>
          <ClassroomList.Provider value={classrooms}>
            <Navbar />
          </ClassroomList.Provider>
        </UserData.Provider>

        {/* Padding top 88px untuk menghindari navbar */}
        <main className="io-main" style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            padding: "88px 24px 40px", 
            maxWidth: "600px", 
            margin: "0 auto", 
            width: "100%",
        }}>

          <div className="io-ph" style={{ border: "none", marginBottom: "24px" }}>
            <div>
              <p className="io-eyebrow" style={{ fontSize: "11px", marginBottom: "6px" }}>Instructor</p>
              <h1 className="io-title" style={{ fontSize: "28px" }}>Buat <strong>Classroom Baru</strong></h1>
            </div>
          </div>

          <div className="io-card" style={{ padding: "24px" }}>
            <form onSubmit={e => { e.preventDefault(); setProcess(true); submit() }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                <div className="io-field">
                  <label className="io-label">Nama Classroom</label>
                  <input
                    className="io-input"
                    type="text"
                    placeholder="cth. Kelas 101"
                    value={input.classname}
                    onChange={e => setInput({ ...input, classname: e.target.value })}
                    required
                  />
                  {errorMsg && (
                    <p style={{ color: "var(--red)", fontSize: "12px", marginTop: "8px", fontWeight: 500 }}>{errorMsg}</p>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    id="cbx-public"
                    type="checkbox"
                    checked={input.ispublic}
                    onChange={() => setInput({ ...input, ispublic: !input.ispublic })}
                    style={{ accentColor: "var(--navy)", width: "16px", height: "16px", cursor: "pointer", flexShrink: 0 }}
                  />
                  <label htmlFor="cbx-public" style={{ margin: 0, cursor: "pointer", fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>
                    Jadikan Publik
                  </label>
                </div>

              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "24px", borderTop: "1px solid var(--border)", marginTop: "24px" }}>
                <button
                  type="button"
                  className="io-btn io-btn-ghost"
                  onClick={() => document.location.href = "/dashboard/instructor"}
                >
                  Batal
                </button>
                <button type="submit" className="io-btn io-btn-primary" disabled={process}>
                  {process
                    ? <><span className="io-spin" /> Menyimpan…</>
                    : <><IcoCheck /> Buat Classroom</>}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}