/* Hallmark · macrostructure: Workbench · genre: modern-minimal
 * tone: institutional-austere · anchor hue: oklch(28% 0.14 258) navy
 * CSS → globals.css (semua class io-* ada di sana)
 */
"use client"
import { Questions } from "@/app/api/[[...route]]/types/exam"
import { Users } from "@/app/api/[[...route]]/types/user"
import DeletePrompt from "@/components/deletePrompt"
import LoadingModal from "@/components/loadingModal"
import Navbar from "@/components/InstructorNavbar"
import QuestionsForm from "@/components/questionsForm"
import { SessionList } from "@/components/sessionList"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Classroom } from "@/app/api/[[...route]]/types/class"
import { ClassroomList } from "@/context/ClassroomList"

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
const IcoSave = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
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

export default function ExamEdit() {
  const [userData,        setUserData]        = useState<Users>()
  const [load,            setLoad]            = useState(true)
  const [duration,        setDuration]        = useState("")
  const [millis,          setMillis]          = useState(0)
  const [saved,           setSaved]           = useState(true)
  const [process,         setProcess]         = useState(false)
  const [examName,        setExamName]        = useState("")
  const [modalAttachment, setModalAttachment] = useState(false)
  const [questions,       setQuestions]       = useState<Questions[]>([])
  const [drag,            setDrag]            = useState(false)
  const [file,            setFile]            = useState<File>({} as File)
  const [fileType,        setFileType]        = useState("")
  const [uploadLoading,   setUploadLoading]   = useState(false)
  const [selectedQIndex,  setSelectedQIndex]  = useState(0)
  const [selectedAIndex,  setSelectedAIndex]  = useState(0)
  const [showDelete,       setShowDelete]      = useState(false)
  const [showDeleteSession,setShowDeleteSession] = useState(false)
  const [showSession,      setShowSession]     = useState(false)
  const [examSession,      setExamSession]     = useState<any[]>([])
  const [classrooms,       setClassrooms]      = useState<Classroom[]>([])
  const [urlInput,         setUrlInput]        = useState("")

  const { id, exam_id } = useParams()
  const overlayAttachment = useRef<HTMLDivElement>(null)

  const openAttachment  = () => overlayAttachment.current?.classList.add("io-open")
  const closeAttachment = () => { overlayAttachment.current?.classList.remove("io-open"); setModalAttachment(false) }

  useEffect(() => {
    if (modalAttachment) openAttachment()
    else closeAttachment()
  }, [modalAttachment])

  function loadClassList() {
    fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "GET_ALL_CLASSROOM" }),
    })
      .then(r => r.json())
      .then(json => setClassrooms(json.data as Classroom[]))
  }

  async function loadExamData() {
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "GET_EXAM", data: { class_id: id, exam_id } }),
    })
    const json = await res.json()
    const ms   = json.data.duration
    const hours   = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    setDuration(`${hours < 10 ? "0"+hours : hours}:${minutes < 10 ? "0"+minutes : minutes}`)
    setQuestions(json.data.questions)
    setExamName(json.data.exam_name)
  }

  async function deleteExam() {
    setShowDelete(false); setLoad(true)
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "DELETE_EXAM", data: { class_id: id, exam_id } }),
    })
    const json = await res.json()
    if (json.status !== "FAIL") document.location.href = `/dashboard/instructor/class/${id}`
  }

  async function addQuestion() {
    setUploadLoading(true)
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "NEW_QUESTION", data: { class_id: id, exam_id } }),
    })
    const json = await res.json()
    if (json.status !== "FAIL") loadExamData()
    setUploadLoading(false)
  }

  async function deleteQuestion(index: number) {
    setUploadLoading(true)
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "DELETE_QUESTION", data: { class_id: id, exam_id, index } }),
    })
    const json = await res.json()
    if (json.status !== "FAIL") loadExamData()
    setUploadLoading(false)
  }

  async function deleteAttachment(index: number, aindex: number) {
    setUploadLoading(true)
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "DELETE_ATTACHMENT", data: { class_id: id, exam_id, index, aindex } }),
    })
    const json = await res.json()
    if (json.status !== "FAIL") loadExamData()
    setUploadLoading(false)
  }

  async function addAnswer(question_index: number) {
    setUploadLoading(true)
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "NEW_ANSWER", data: { class_id: id, exam_id, i: question_index } }),
    })
    const json = await res.json()
    if (json.status !== "FAIL") loadExamData()
    setUploadLoading(false)
  }

  async function deleteAnswer(question_index: number, answer_index: number) {
    setUploadLoading(true)
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "DELETE_ANSWER", data: { class_id: id, exam_id, i: question_index, ai: answer_index } }),
    })
    const json = await res.json()
    if (json.status !== "FAIL") loadExamData()
    setUploadLoading(false)
  }

  function saving() {
    setProcess(true)
    fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "SAVE_EXAM", data: { class_id: id, exam_id, exam_name: examName, duration: millis, questions } }),
    })
      .then(r => r.json())
      .then(json => { setProcess(false); if (json.status !== "FAIL") setSaved(true) })
  }

  function correctToggle(question_index: number, answer_index: number) {
    const qs = [...questions]
    qs[question_index].list_answer[answer_index].correct = !qs[question_index].list_answer[answer_index].correct
    setQuestions(qs); setSaved(false); saving()
  }

  async function newAttachment(data: object) {
    setUploadLoading(true)
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "NEW_ATTACHMENT", data: { ...data, class_id: id, exam_id } }),
    })
    const json = await res.json()
    if (json.status !== "FAIL") loadExamData()
    setUploadLoading(false)
  }

  function uploadFile() {
    closeAttachment(); setUploadLoading(true)
    const formData = new FormData()
    formData.append("file", file); formData.append("type", fileType)
    fetch("/api/instructor/uploads", { method: "POST", body: formData })
      .then(r => r.json())
      .then(async json => {
        if (json.status !== "FAIL") {
          await newAttachment({ type: fileType === "image" ? "image" : "audio", from: "upload", source: json.path, i: selectedQIndex })
          await loadExamData()
        }
        setUploadLoading(false); setFile({} as File); setFileType("")
      })
  }

  useEffect(() => {
    fetch("/api/auth/", {
      method: "post",
      body: JSON.stringify({ method: "AUTHENTICATION" }),
    })
      .then(r => r.json())
      .then(json => {
        if (json.status !== "OK") { document.location.href = "/signin"; return }
        switch (json.data.role) {
          case "instructor":
            setUserData(json.data)
            loadExamData().then(() => setLoad(false))
            break
          case "user":  document.location.href = "/dashboard/user";  break
          case "admin": document.location.href = "/dashboard/admin"; break
        }
      })
  }, [])

  useEffect(() => {
    const splt = duration.split(":")
    if (splt.length === 2) {
      setMillis((parseInt(splt[0]) * 60 * 60 * 1000) + (parseInt(splt[1]) * 60 * 1000))
    }
  }, [duration])

  useEffect(() => { if (!load) loadClassList() }, [load])

  async function resetSession() {
    setShowDeleteSession(false); setLoad(true)
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "RESET_SESSION", body: { class_id: id, exam_id } }),
    })
    const json = await res.json()
    if (json.status !== "FAIL") setLoad(false)
  }

  async function showModalSession() {
    setShowSession(true)
    const res  = await fetch("/api/instructor/", {
      method: "POST",
      body: JSON.stringify({ method: "GET_EXAM_SESSION", data: { class_id: id, exam_id } }),
    })
    const json = await res.json()
    if (json.status !== "FAIL") setExamSession(json.data)
  }

  return (
    <>
      <Splash isLoad={load} />
      <DeletePrompt promptText="Hapus ujian ini?" show={showDelete} setShow={setShowDelete} deleteFunction={deleteExam} />
      <DeletePrompt promptText="Reset sesi ujian ini?" show={showDeleteSession} setShow={setShowDeleteSession} deleteFunction={resetSession} />
      <LoadingModal show={uploadLoading} className="bg-white p-5 w-[50vw] min-h-[40vh] rounded-md flex flex-col justify-center items-center">
        <span className="io-spin" style={{ width: "2rem", height: "2rem" }} />
      </LoadingModal>
      <SessionList show={showSession} setShow={setShowSession} examSession={examSession} />

      {/* ── Attachment Modal ── */}
      <div className="io-overlay" ref={overlayAttachment} onClick={e => { if (e.target === overlayAttachment.current) closeAttachment() }}>
        <div className="io-modal" onClick={e => e.stopPropagation()}>
          <div className="io-mhead">
            <span className="io-mtitle">Tambah Lampiran</span>
            <button className="io-mclose" onClick={closeAttachment}><IcoClose /></button>
          </div>
          <div className="io-mbody">
            <div className="io-field">
              <label className="io-label">Tipe File</label>
              <select className="io-input" value={fileType} onChange={e => setFileType(e.target.value)}>
                <option value="">Pilih tipe</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
              </select>
            </div>
            {fileType !== "" && (
              <>
                <div className="io-field">
                  <label className="io-label">URL</label>
                  <input className="io-input" type="text" placeholder="https://foo.bar/"
                    value={urlInput} onChange={e => setUrlInput(e.target.value)} />
                </div>
                <p style={{ textAlign: "center", fontSize: "0.8rem", color: "oklch(55% 0.03 258)", margin: "4px 0" }}>atau</p>
                <div className="io-field">
                  <label className="io-label">Upload File</label>
                  <div
                    style={{
                      background: drag ? "oklch(92% 0.06 258)" : "oklch(97% 0.005 258)",
                      border: `1.5px dashed ${drag ? "oklch(42% 0.14 258)" : "oklch(85% 0.01 258)"}`,
                      borderRadius: "8px", minHeight: "6rem",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 150ms ease", padding: "1rem"
                    }}
                    onDragOver={e => { e.preventDefault(); setDrag(true) }}
                    onDragExit={e => { e.preventDefault(); setDrag(false) }}
                    onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]); setDrag(false) }}
                  >
                    {!file.name ? (
                      <input type="file" className="io-input" style={{ border: "none", padding: 0, background: "transparent" }}
                        onChange={e => setFile(e.target.files ? e.target.files[0] : ({} as File))} />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "0.85rem", color: "oklch(20% 0.04 258)" }}>{file.name}</span>
                        <button className="io-btn io-btn-danger io-btn-sm" onClick={() => setFile({} as File)}><IcoTrash /></button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="io-mfoot">
            <button className="io-btn io-btn-ghost" onClick={closeAttachment}>Batal</button>
            {file.name && (
              <button className="io-btn io-btn-primary" onClick={uploadFile}>Upload</button>
            )}
          </div>
        </div>
      </div>

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
          <div className="io-ph" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p className="io-eyebrow" style={{ margin: "0 0 6px 0", fontSize: "11px" }}>Instruktur</p>
              <h1 className="io-title" style={{ margin: 0, fontSize: "28px" }}>Editor <strong>Ujian</strong></h1>
            </div>
            {!saved && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button className="io-btn io-btn-primary" onClick={saving} disabled={process}>
                  {process ? <><span className="io-spin" /> Menyimpan…</> : <><IcoSave /> Simpan</>}
                </button>
              </div>
            )}
          </div>

          <div className="io-card" style={{ padding: "1.5rem" }}>
            {/* Exam meta */}
            <div className="io-field-row" style={{ marginBottom: "1rem" }}>
              <div className="io-field">
                <label className="io-label">Nama Ujian</label>
                <input className="io-input" type="text" value={examName}
                  onChange={e => { setSaved(false); setExamName(e.target.value) }} />
              </div>
              <div className="io-field">
                <label className="io-label">Durasi</label>
                <input className="io-input" type="time" value={duration}
                  onChange={e => { setSaved(false); setDuration(e.target.value) }} />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1.5rem" }}>
              <button className="io-btn io-btn-ghost io-btn-sm" onClick={showModalSession}>Lihat Sesi</button>
              <button className="io-btn io-btn-ghost io-btn-sm" onClick={() => setShowDeleteSession(true)}>Reset Sesi</button>
              <button className="io-btn io-btn-danger io-btn-sm" onClick={() => setShowDelete(true)}><IcoTrash /> Hapus Ujian</button>
            </div>

            {/* Questions */}
            <div style={{ borderTop: "1px solid oklch(93% 0.01 258)", paddingTop: "1.25rem" }}>
              <p className="io-eyebrow" style={{ marginBottom: "1rem" }}>Soal</p>
              {questions.map((v: Questions, i: number) => (
                <QuestionsForm
                  key={i}
                  v={v} i={i}
                  questions={questions}
                  setQuestions={setQuestions}
                  setSaved={setSaved}
                  setModalAttachment={setModalAttachment}
                  setSelectedQIndex={setSelectedQIndex}
                  setSelectedAIndex={setSelectedAIndex}
                  correctToggle={correctToggle}
                  addAnswer={addAnswer}
                  deleteAnswer={deleteAnswer}
                  deleteQuestion={deleteQuestion}
                  saving={saving}
                  deleteAttachment={deleteAttachment}
                />
              ))}
              <button className="io-btn io-btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }} onClick={addQuestion}>
                <IcoPlus /> Tambah Soal
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}