/* Hallmark · macrostructure: Workbench · genre: modern-minimal
 * tone: institutional-austere · anchor hue: oklch(28% 0.14 258) navy
 * CSS → globals.css (semua class io-* ada di sana)
 */
"use client"
import { useEffect, useState } from "react"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import Navbar from "@/components/UserNavbar"
import { useParams } from "next/navigation"
import { Exam } from "@/app/api/[[...route]]/types/exam"
import { ClassroomDataList } from "@/context/ClassroomDataList"
import { ClassroomData } from "@/app/api/[[...route]]/types/class"

const IcoArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const IcoExam = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
)

export default function ClassView() {
  const { classid } = useParams()
  const [userData,   setUserData]   = useState<Users>()
  const [load,       setLoad]       = useState(true)
  const [exam,       setExam]       = useState<Exam[]>([])
  const [classrooms, setClassrooms] = useState<ClassroomData[]>([])

  function loadExamList() {
    fetch("/api/user/", {
      method: "post",
      body: JSON.stringify({ method: "GET_EXAM_LIST", data: { id: classid } }),
    })
      .then(r => r.json())
      .then(json => setExam(json.data as Exam[]))
  }

  function loadClassList() {
    fetch("/api/user/", {
      method: "post",
      body: JSON.stringify({ method: "GET_CLASSROOM" }),
    })
      .then(r => r.json())
      .then(json => setClassrooms(json.data as ClassroomData[]))
  }

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
            setUserData(json.data)
            setLoad(false)
            break
          case "instructor": document.location.href = "/dashboard/instructor"; break
          case "admin":      document.location.href = "/dashboard/admin";      break
        }
      })
  }, [])

  useEffect(() => {
    if (!load) {
      loadExamList()
      loadClassList()
    }
  }, [load])

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
              <p className="io-eyebrow">Kelas</p>
              <h1 className="io-title">Daftar <strong>Ujian</strong></h1>
            </div>
            <span className="io-count">{exam.length} ujian</span>
          </div>

          {exam.length === 0 ? (
            <div className="io-empty">
              <IcoExam />
              <p>Belum ada ujian tersedia</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {exam.map((v: Exam) => (
                <a
                  key={v._id as string}
                  href={`/dashboard/user/exam/${classid}/${v._id}`}
                  className="io-menu-card"
                  style={{ textDecoration: "none" }}
                >
                  <div className="io-menu-card-body">
                    <p className="io-menu-card-title">{v.exam_name}</p>
                  </div>
                  <div className="io-menu-card-arrow">
                    <IcoArrow />
                  </div>
                </a>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}