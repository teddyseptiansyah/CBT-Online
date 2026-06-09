/* Hallmark · macrostructure: Workbench · genre: modern-minimal
 * tone: institutional-austere · anchor hue: oklch(28% 0.14 258) navy
 * CSS → globals.css (semua class io-* ada di sana)
 */
"use client"
import { Answer, Exam, Questions } from "@/app/api/[[...route]]/types/exam"
import { Users } from "@/app/api/[[...route]]/types/user"
import Navbar from "@/components/ExamNavbar"
import QuestionsDisplay from "@/components/questions"
import Splash from "@/components/splash"
import { ExamContext } from "@/context/Exam"
import { QuestionIndex } from "@/context/QuestionIndex"
import { QuestionsContext } from "@/context/Questions"
import { Timer } from "@/context/Timer"
import { UserData } from "@/context/UserData"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const IcoBack = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
)

const IcoResult = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)

export default function ExamView() {
  const { examid, classid } = useParams()
  const [userData,   setUserData]   = useState<Users>()
  const [load,       setLoad]       = useState(true)
  const [fail,       setFail]       = useState(false)
  const [examData,   setExamData]   = useState<Exam>({} as Exam)
  const [questions,  setQuestions]  = useState<Questions>({} as Questions)
  const [timer,      setTimer]      = useState({ hour: 0, minutes: 0, seconds: 0 })
  const [index,      setIndex]      = useState(0)

  const ExamContextData      = { examData, setExamData }
  const QuestionsContextData = { questions, setQuestions }

  useEffect(() => {
    fetch("/api/auth/", {
      method: "post",
      body: JSON.stringify({ method: "AUTHENTICATION" }),
    })
      .then(r => r.json())
      .then(json => {
        if (json.status !== "OK") { document.location.href = "/signin"; return; }
        switch (json.data.role) {
          case "user":
            setLoad(false)
            setUserData(json.data)
            break
          case "instructor": document.location.href = "/dashboard/instructor"; break
          case "admin":      document.location.href = "/dashboard/admin";      break
        }
      })
  }, [])

  useEffect(() => {
    if (!load) {
      fetch("/api/user/", {
        method: "post",
        body: JSON.stringify({
          method: "CREATE_EXAM_SESSION",
          data: { class_id: classid, exam_id: examid },
        }),
      })
        .then(r => r.json())
        .then(json => {
          // 1. Jika gagal, set fail dan hentikan proses di sini
          if (json.status !== "OK") {
            setFail(true)
            return
          }

          // 2. Jika sukses, baru set data ujiannya
          setExamData(json.data as Exam)
          
          // 3. Pastikan questions benar-benar ada dan tidak kosong
          if (json.data.questions && json.data.questions.length > 0) {
            setQuestions(json.data.questions[0] as Questions)
          }
        })
        .catch(err => {
          console.error(err)
          setFail(true)
        })
    }
  }, [load, classid, examid])

  return (
    <>
      <Splash isLoad={load} />

      <div className={`io-page${load ? " hidden" : ""}`}>
        <UserData.Provider value={userData as Users}>
          <Timer.Provider value={{ timer, setTimer }}>
            <ExamContext.Provider value={ExamContextData}>
              <QuestionsContext.Provider value={QuestionsContextData}>
                <QuestionIndex.Provider value={{ index, setIndex }}>
                  <Navbar />
                </QuestionIndex.Provider>
              </QuestionsContext.Provider>
            </ExamContext.Provider>
          </Timer.Provider>
        </UserData.Provider>

        {fail ? (
          /* ── Exam ended ── */
          <main className="io-main" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
            <div style={{
              textAlign: "center",
              background: "white",
              border: "1px solid oklch(90% 0.01 258)",
              borderRadius: "12px",
              padding: "2.5rem 2rem",
              maxWidth: "360px",
              width: "100%"
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="oklch(62% 0.03 258)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: "1rem" }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "oklch(12% 0.04 258)",
                marginBottom: "0.5rem"
              }}>Ujian telah berakhir</h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.875rem",
                color: "oklch(50% 0.03 258)",
                marginBottom: "1.5rem",
                fontWeight: 300
              }}>Sesi ujian ini sudah tidak tersedia.</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <a
                  href={`/dashboard/user/class/${classid}`}
                  className="io-btn io-btn-ghost"
                >
                  <IcoBack /> Kembali
                </a>
                <a
                  href={`/dashboard/user/result/${classid}/${examid}`}
                  className="io-btn io-btn-primary"
                >
                  <IcoResult /> Hasil
                </a>
              </div>
            </div>
          </main>
        ) : (
          <ExamContext.Provider value={ExamContextData}>
            <QuestionsContext.Provider value={QuestionsContextData}>
              <Timer.Provider value={{ timer, setTimer }}>
                <QuestionIndex.Provider value={{ index, setIndex }}>
                  <div className={`io-page${load ? " hidden" : ""}`}>
                    <QuestionsDisplay />
                  </div>
                </QuestionIndex.Provider>
              </Timer.Provider>
            </QuestionsContext.Provider>
          </ExamContext.Provider>
        )}
      </div>
    </>
  )
}