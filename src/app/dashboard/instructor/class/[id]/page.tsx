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
    <div className="io-card" style={{ width:"380px", padding:"24px" }}>
      <p className="io-mtitle" style={{ marginBottom:"16px" }}>{title}</p>
      {children}
    </div>
  </div>
)

const Divider = () => <div style={{ borderTop:"1px solid var(--io-border)", margin:"16px 0" }} />

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

      {modal === "delete" && (
        <Modal title="Hapus Classroom?">
          <p style={{ fontSize:"13px", color:"var(--io-text-muted)", marginBottom:"20px" }}>Tindakan ini tidak bisa dibatalkan.</p>
          <div style={{ display:"flex", gap:"8px", justifyContent:"flex-end" }}>
            <button className="io-btn io-btn-ghost" onClick={() => setModal(null)}>Batal</button>
            <button className="io-btn io-btn-danger" onClick={deleteClass}><IcoTrash /> Hapus</button>
          </div>
        </Modal>
      )}

      {modal === "exam" && (
        <Modal title="Tambah Ujian">
          <form onSubmit={addExam}>
            <div className="io-field" style={{ marginBottom:"16px" }}>
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

      <div className={`io-page${load ? " hidden" : ""}`}>
        <UserData.Provider value={userData as Users}>
          <ClassroomList.Provider value={classrooms}>
            <Navbar />
          </ClassroomList.Provider>
        </UserData.Provider>

        <main className="io-main" style={{ paddingTop:"72px" }}>
          {/* compact page header */}
          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:"16px" }}>
            <div>
              <p className="io-eyebrow" style={{ marginBottom:"2px" }}>Instructor</p>
              <h1 className="io-title" style={{ margin:0 }}>Detail <strong>Classroom</strong></h1>
            </div>
          </div>
          <div style={{ borderTop:"1px solid var(--io-border)", marginBottom:"16px" }} />

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", alignItems:"start" }}>

            {/* ── Kiri: semua dalam 1 card ── */}
            <div className="io-card" style={{ padding:"24px" }}>

              <p className="io-mtitle" style={{ marginBottom:"16px" }}>Informasi Classroom</p>
              <form onSubmit={e => { e.preventDefault(); setProcess(true); updateClass() }}>
                <div className="io-field" style={{ marginBottom:"14px" }}>
                  <label className="io-label">Nama Classroom</label>
                  <input className="io-input" type="text" value={classes.name}
                    onChange={e => { setClasses({ ...classes, name:e.target.value }); setChange(true) }} />
                  {errorMsg && <p style={{ color:"oklch(68% 0.19 27)", fontSize:"12px", marginTop:"4px" }}>{errorMsg}</p>}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom: change ? "14px" : "0" }}>
                  <input id="cbx-public" type="checkbox" checked={classes.is_public}
                    onChange={() => { setClasses({ ...classes, is_public:!classes.is_public }); setChange(true) }}
                    style={{ accentColor:"oklch(55% 0.14 258)", width:"14px", height:"14px", cursor:"pointer" }} />
                  <label htmlFor="cbx-public" className="io-label" style={{ margin:0, cursor:"pointer" }}>Jadikan Publik</label>
                </div>
                {change && (
                  <div style={{ display:"flex", justifyContent:"flex-end" }}>
                    <button type="submit" className="io-btn io-btn-primary" disabled={process}>
                      {process ? <><span className="io-spin" /> Menyimpan…</> : <><IcoSave /> Simpan</>}
                    </button>
                  </div>
                )}
              </form>

              <Divider />
              <p className="io-mtitle" style={{ marginBottom:"12px" }}>Akses</p>
              <div style={{ display:"flex", gap:"8px", marginBottom:"0" }}>
                <a href={`/dashboard/instructor/class/${id}/allow`} className="io-btn io-btn-ghost">Allow Users</a>
                <a href={`/dashboard/instructor/class/${id}/block`} className="io-btn io-btn-ghost">Block Users</a>
              </div>

              <Divider />
              <p className="io-mtitle" style={{ marginBottom:"12px" }}>Tindakan</p>
              <button className="io-btn io-btn-danger" onClick={() => setModal("delete")}><IcoTrash /> Hapus Classroom</button>
            </div>

            {/* ── Kanan: Exam ── */}
            <div className="io-card" style={{ padding:"24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
                <p className="io-mtitle">Daftar Ujian</p>
                <button className="io-btn io-btn-primary" onClick={() => setModal("exam")}><IcoPlus /> Tambah</button>
              </div>
              {examList.length === 0
                ? <p style={{ fontSize:"13px", color:"var(--io-text-muted)" }}>Belum ada ujian.</p>
                : <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                    {examList.map((v: Exam) => (
                      <a key={v._id} href={`/dashboard/instructor/class/${id}/${v._id}`}
                        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", border:"1px solid var(--io-border)", borderRadius:"8px", textDecoration:"none", color:"inherit" }}>
                        <span style={{ fontSize:"14px", fontWeight:500 }}>{v.exam_name}</span>
                        <IcoArrow />
                      </a>
                    ))}
                  </div>
              }
            </div>

          </div>
        </main>
      </div>
    </>
  )
}