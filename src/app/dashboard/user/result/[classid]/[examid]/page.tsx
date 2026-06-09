/* Hallmark · macrostructure: Workbench · genre: modern-minimal
 * tone: institutional-austere · anchor hue: oklch(28% 0.14 258) navy
 * CSS → globals.css (semua class io-* ada di sana)
 */
"use client"
import { ClassroomData } from "@/app/api/[[...route]]/types/class"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import Navbar from "@/components/UserNavbar"
import { ClassroomDataList } from "@/context/ClassroomDataList"
import { UserData } from "@/context/UserData"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const IcoBack = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
)

const IcoCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IcoX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function ResultView() {
  const { examid, classid } = useParams()
  const [load,       setLoad]       = useState(true)
  const [result,     setResult]     = useState<any>({})
  const [userData,   setUserData]   = useState<Users>()
  const [classrooms, setClassrooms] = useState<ClassroomData[]>([])

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
      loadClassList()
      fetch("/api/user/", {
        method: "post",
        body: JSON.stringify({
          method: "GET_RESULT",
          data: { class_id: classid, exam_id: examid },
        }),
      })
        .then(r => r.json())
        .then(json => setResult(json.data))
    }
  }, [load])

  return (
    <>
      <Splash isLoad={load} />

      <UserData.Provider value={userData as Users}>
        <ClassroomDataList.Provider value={classrooms}>
          <Navbar />
        </ClassroomDataList.Provider>
      </UserData.Provider>

      <main style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "5rem 1rem 2rem",
        background: "oklch(97% 0.005 258)"
      }}>
        <div style={{
          background: "white",
          border: "1px solid oklch(90% 0.01 258)",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          overflow: "hidden",
          boxShadow: "0 4px 24px oklch(10% 0.04 258 / 0.07)"
        }}>
          {/* Header */}
          <div style={{
            background: "oklch(28% 0.14 258)",
            padding: "1.25rem 1.5rem",
            textAlign: "center"
          }}>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(70% 0.06 258)",
              marginBottom: "4px"
            }}>Hasil Ujian</p>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em"
            }}>{result?.score?.toFixed(2) ?? "—"}</h2>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid oklch(93% 0.01 258)"
          }}>
            {[
              { label: "Total Soal",    value: result.total },
              { label: "Jawaban Benar", value: result.correct_total },
            ].map(stat => (
              <div key={stat.label} style={{
                padding: "1rem 1.25rem",
                borderRight: "1px solid oklch(93% 0.01 258)",
                textAlign: "center"
              }}>
                <p style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  color: "oklch(12% 0.04 258)"
                }}>{stat.value ?? "—"}</p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.75rem",
                  color: "oklch(55% 0.03 258)",
                  fontWeight: 300
                }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Detail list */}
          <div style={{ padding: "1rem 1.25rem" }}>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "oklch(45% 0.03 258)",
              marginBottom: "8px"
            }}>Detail</p>
            <div style={{
              maxHeight: "200px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}>
              {result?.detail?.map(
                (v: { question: string; correct: boolean }, i: number) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    background: v.correct ? "oklch(95% 0.04 165)" : "oklch(96% 0.03 25)"
                  }}>
                    <span style={{
                      marginTop: "1px",
                      color: v.correct ? "oklch(45% 0.14 165)" : "oklch(45% 0.14 25)",
                      flexShrink: 0
                    }}>
                      {v.correct ? <IcoCheck /> : <IcoX />}
                    </span>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.82rem",
                      color: "oklch(20% 0.04 258)",
                      lineHeight: 1.4,
                      fontWeight: 300
                    }}>{i + 1}. {v.question}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "0 1.25rem 1.25rem" }}>
            <a
              href={`/dashboard/user/class/${classid}`}
              className="io-btn io-btn-primary"
              style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}
            >
              <IcoBack /> Kembali ke Kelas
            </a>
          </div>
        </div>
      </main>
    </>
  )
}