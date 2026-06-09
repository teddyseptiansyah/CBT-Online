"use client"
import { Classroom } from "@/app/api/[[...route]]/types/class"
import { Exam } from "@/app/api/[[...route]]/types/exam"
import { Users } from "@/app/api/[[...route]]/types/user"
import Navbar from "@/components/InstructorNavbar"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import { ClassroomList } from "@/context/ClassroomList"
import { useParams } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

const IcoSave  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
const IcoTrash = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const IcoPlus  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IcoArrow = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>

const Modal = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ position:"fixed", inset:0, zIndex:99, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center" }}>
    <div className="io-card" style={{ width:"380px", padding:"24px", transform: "scale(1)", transition: "all 150ms ease" }}>
      <p className="io-mtitle" style={{ marginBottom:"16px" }}>{title}</p>
      {children}
    </div>
  </div>
)

const Divider = () => <div style={{ borderTop:"1px solid var(--border)", margin:"20px 0" }} />

export default function ClassDetail() {
  const { id } = useParams()
  const [userData,   setUserData]   = useState<Users>()
  const [load,       setLoad]       = useState(true)
  const [classes,    setClasses]    = useState<Classroom>({ _id:"", instructor:"", name:"", is_public:false, allow_users:[], block_users:[] })
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [examList,   setExamList]   = useState<Exam[]>([])
  const [examName,   setExamName]   = useState("")
  const [change,     setChange]     = useState(false)
  const [process,    setProcess]    = useState(false)
  const [errorMsg,   setErrorMsg]   = useState("")
  const [modal,      setModal]      = useState<"delete"|"exam"|null>(null)

  const api = (body: object) => fetch("/api/instructor/", { method:"POST", body:JSON.stringify(body) }).then(r => r.json())
  const loadClassData = () => api({ method:"GET_CLASSROOM_BY_ID", data:{ class_id:id } }).then(j => setClasses(j.data))
  const loadClassList = () => api({ method:"GET_ALL_CLASSROOM" }).then(j => setClassrooms(j.data))
  const loadExamList  = () => api({ method:"GET_EXAM_LIST", data:{ class_id:id } }).then(j => setExamList(j.data))

  useEffect(() => {
    fetch("/api/auth/", { method:"POST", body:JSON.stringify({ method:"AUTHENTICATION" }) }).then(r => r.json()).then(j => {
      if (j.status !== "OK") { document.location.href = "/signin"; return }
      if (j.data.role === "user")  { document.location.href = "/dashboard/user";  return }
      if (j.data.role === "admin") { document.location.href = "/dashboard/admin"; return }
      setUserData(j.data); setLoad(false); loadClassList()
    })
  }, [])

  useEffect(() => { if (!load) { loadClassData(); loadExamList() } }, [load])
  useEffect(() => { if (!load) loadExamList() }, [process])

  const updateClass = () =>
    api({ method:"UPDATE_CLASSROOM", data:classes }).then(j => {
      setProcess(false)
      j.status !== "FAIL" ? (setErrorMsg(""), setChange(false)) : setErrorMsg("Gagal menyimpan perubahan.")
    })

  const deleteClass = () => {
    setModal(null); setLoad(true)
    api({ method:"DELETE_CLASSROOM", data:{ class_id:classes._id } }).then(j =>
      j.status === "OK" ? (document.location.href = "/dashboard/instructor/") : setLoad(false)
    )
  }

  const addExam = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setProcess(true)
    await api({ method:"CREATE_NEW_EXAM", data:{ class_id:id, exam_name:examName } }).then(j => {
      setProcess(false); if (j.status !== "FAIL") setChange(false)
    })
    setModal(null)
  }

  return (
    <>
      <Splash isLoad={load} />

      {/* MODAL: HAPUS */}
      {modal === "delete" && (
        <Modal title="Hapus Classroom?">
          <p style={{ fontSize:"13px", color:"var(--ink-3)", marginBottom:"24px" }}>Tindakan ini tidak bisa dibatalkan. Semua ujian terkait akan terhapus.</p>
          <div style={{ display:"flex", gap:"8px", justifyContent:"flex-end" }}>
            <button type="button" className="io-btn io-btn-ghost" onClick={() => setModal(null)}>Batal</button>
            <button type="button" className="io-btn io-btn-danger" onClick={deleteClass}><IcoTrash /> Hapus</button>
          </div>
        </Modal>
      )}

      {/* MODAL: TAMBAH UJIAN */}
      {modal === "exam" && (
        <Modal title="Tambah Ujian">
          <form onSubmit={addExam}>
            <div className="io-field" style={{ marginBottom:"20px" }}>
              <label className="io-label">Nama Ujian</label>
              <input className="io-input" type="text" placeholder="cth. Ujian Tengah Semester" value={examName} onChange={e => setExamName(e.target.value)} required />
            </div>
            <div style={{ display:"flex", gap:"8px", justifyContent:"flex-end" }}>
              <button type="button" className="io-btn io-btn-ghost" onClick={() => setModal(null)}>Batal</button>
              <button type="submit" className="io-btn io-btn-primary" disabled={process}>
                {process ? <><span className="io-spin" /> Menyimpan…</> : <><IcoPlus /> Tambah</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <div className={`io-page${load ? " hidden" : ""}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <UserData.Provider value={userData as Users}>
          <ClassroomList.Provider value={classrooms}>
            <Navbar />
          </ClassroomList.Provider>
        </UserData.Provider>

        <main className="io-main" style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            gap: "24px", 
            padding: "88px 24px 40px", 
            maxWidth: "1200px", 
            margin: "0 auto", 
            width: "100%",
        }}>
          
          {/* Page header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
            <div>
              <p className="io-eyebrow" style={{ margin: "0 0 6px 0", fontSize: "11px" }}>Instruktur</p>
              <h1 className="io-title" style={{ margin: 0, fontSize: "28px" }}>Detail <strong>Classroom</strong></h1>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))", gap:"24px", alignItems:"start" }}>

            {/* ── KIRI: PENGATURAN CLASSROOM ── */}
            <div className="io-card" style={{ padding:"24px" }}>
              <p className="io-eyebrow" style={{ color: "var(--ink-2)", marginBottom:"16px", fontSize: "12px", letterSpacing: "0.1em" }}>Pengaturan</p>
              
              <form onSubmit={e => { e.preventDefault(); setProcess(true); updateClass() }}>
                <div className="io-field" style={{ marginBottom:"14px" }}>
                  <label className="io-label">Nama Classroom</label>
                  <input className="io-input" type="text" value={classes.name}
                    onChange={e => { setClasses({ ...classes, name:e.target.value }); setChange(true) }} />
                  {errorMsg && <p style={{ color:"var(--red)", fontSize:"12px", marginTop:"6px", fontWeight: 500 }}>{errorMsg}</p>}
                </div>
                
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom: change ? "16px" : "0" }}>
                  <input id="cbx-public" type="checkbox" checked={classes.is_public}
                    onChange={() => { setClasses({ ...classes, is_public:!classes.is_public }); setChange(true) }}
                    style={{ accentColor:"var(--navy)", width:"16px", height:"16px", cursor:"pointer" }} />
                  <label htmlFor="cbx-public" style={{ margin:0, cursor:"pointer", fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>Jadikan Publik</label>
                </div>

                {change && (
                  <div style={{ display:"flex", justifyContent:"flex-end" }}>
                    <button type="submit" className="io-btn io-btn-primary" disabled={process}>
                      {process ? <><span className="io-spin" /> Menyimpan…</> : <><IcoSave /> Simpan Perubahan</>}
                    </button>
                  </div>
                )}
              </form>

              <Divider />
              
              <p className="io-eyebrow" style={{ color: "var(--ink-2)", marginBottom:"12px", fontSize: "12px", letterSpacing: "0.1em" }}>Akses Peserta</p>
              <div style={{ display:"flex", flexWrap: "wrap", gap:"8px", marginBottom:"0" }}>
                <a href={`/dashboard/instructor/class/${id}/allow`} className="io-btn io-btn-ghost">Allow Users</a>
                <a href={`/dashboard/instructor/class/${id}/block`} className="io-btn io-btn-ghost">Block Users</a>
              </div>

              <Divider />
              
              <p className="io-eyebrow" style={{ color: "var(--red)", marginBottom:"12px", fontSize: "12px", letterSpacing: "0.1em" }}>Zona Berbahaya</p>
              <button className="io-btn io-btn-danger" onClick={() => setModal("delete")}>
                <IcoTrash /> Hapus Classroom
              </button>
            </div>

            {/* ── KANAN: DAFTAR UJIAN ── */}
            <div className="io-card" style={{ display: "flex", flexDirection: "column", minHeight: "300px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
                <p className="io-eyebrow" style={{ color: "var(--ink-2)", margin: 0, fontSize: "12px", letterSpacing: "0.1em" }}>Daftar Ujian</p>
                <button className="io-btn io-btn-primary io-btn-sm" onClick={() => setModal("exam")}><IcoPlus /> Tambah Ujian</button>
              </div>
              
              <div style={{ padding: "24px", flex: 1 }}>
                {examList.length === 0 ? (
                  <div className="io-empty" style={{ padding: "40px 10px" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    <p style={{ fontSize: "13px", marginTop: "12px" }}>Belum ada ujian yang dibuat.</p>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                    {examList.map((v: Exam) => (
                      <a key={v._id} href={`/dashboard/instructor/class/${id}/${v._id}`}
                        style={{ 
                          display:"flex", alignItems:"center", justifyContent:"space-between", 
                          padding:"14px 18px", border:"1px solid var(--border)", 
                          borderRadius:"8px", textDecoration:"none", color:"var(--ink)",
                          transition: "border-color 150ms ease, background 150ms ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--navy-light)"
                          e.currentTarget.style.background = "var(--navy-fog)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--border)"
                          e.currentTarget.style.background = "transparent"
                        }}
                      >
                        <span style={{ fontSize:"14px", fontWeight:500 }}>{v.exam_name}</span>
                        <span style={{ color: "var(--navy-light)" }}><IcoArrow /></span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}