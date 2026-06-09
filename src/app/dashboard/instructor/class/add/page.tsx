"use client"

import { Users } from "@/app/api/[[...route]]/types/user";
import Navbar from "@/components/InstructorNavbar";
import Splash from "@/components/splash";
import { UserData } from "@/context/UserData";
import { ClassroomList } from "@/context/ClassroomList";
import { useEffect, useRef, useState } from "react";
import { Classroom } from "@/app/api/[[...route]]/types/class";

export default function AddClass() {
  const [userData,  setUserData]  = useState<Users>()
  const [load,      setLoad]      = useState(true)
  const [input,     setInput]     = useState({ classname: "", ispublic: false })
  const [process,   setProcess]   = useState(false)
  const [errorMsg,  setErrorMsg]  = useState("")
  const [classrooms,setClassrooms]= useState<Classroom[]>([])
  const [toast,     setToast]     = useState<{ msg: string; ok: boolean } | null>(null)
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
        document.location.href = "/dashboard"
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
              <h1 className="io-title">Buat <strong>Classroom Baru</strong></h1>
            </div>
          </div>

          <div className="io-card" style={{ padding: "32px" }}>
            <div style={{ borderBottom: "1px solid var(--io-border)", paddingBottom: "20px", marginBottom: "32px" }}>
              <span className="io-mtitle">Detail Classroom</span>
            </div>

            <form onSubmit={e => { e.preventDefault(); setProcess(true); submit() }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

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
                    <p style={{ color: "oklch(68% 0.19 27)", fontSize: "12px", marginTop: "6px" }}>{errorMsg}</p>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input
                    id="cbx-public"
                    type="checkbox"
                    checked={input.ispublic}
                    onChange={() => setInput({ ...input, ispublic: !input.ispublic })}
                    style={{ accentColor: "oklch(55% 0.14 258)", width: "16px", height: "16px", cursor: "pointer", flexShrink: 0 }}
                  />
                  <label htmlFor="cbx-public" className="io-label" style={{ margin: 0, cursor: "pointer" }}>
                    Jadikan Publik
                  </label>
                </div>

              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "36px", borderTop: "1px solid var(--io-border)", marginTop: "36px" }}>
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

      {toast && (
        <div className={`io-toast ${toast ? "io-toast-show" : "io-toast-hide"}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={toast.ok ? "oklch(68% 0.14 165)" : "oklch(68% 0.19 27)"}
            strokeWidth="2.2" strokeLinecap="round">
            {toast.ok
              ? <polyline points="20 6 9 17 4 12" />
              : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}
          </svg>
          {toast.msg}
        </div>
      )}
    </>
  )
}