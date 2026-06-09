"use client"
import { ClassroomList } from "@/context/ClassroomList"
import { ExamContext } from "@/context/Exam"
import { QuestionIndex } from "@/context/QuestionIndex"
import { QuestionsContext } from "@/context/Questions"
import { Timer } from "@/context/Timer"
import { useContext, useState } from "react"

const IcoMenu  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
const IcoClose = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

export default function Navbar() {
  const { examData }              = useContext(ExamContext)
  const { setQuestions }          = useContext(QuestionsContext)
  const { index, setIndex }       = useContext(QuestionIndex)
  const timerContext               = useContext(Timer)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const pad = (n: number) => String(n).padStart(2, "0")
  const timer = timerContext.timer
    ? `${pad(timerContext.timer.hour)}:${pad(timerContext.timer.minutes)}:${pad(timerContext.timer.seconds)}`
    : null

  return (
    <>
      <header className="io-navbar">
        <button className="io-navbar-icon-btn" onClick={() => setDrawerOpen(true)} aria-label="Buka menu">
          <IcoMenu />
        </button>

        <a href="/dashboard/user" className="io-navbar-logo">
          <span className="io-navbar-wordmark">OPSCBT</span>
        </a>

        {timer && (
          <span style={{ fontSize:"14px", fontWeight:600, letterSpacing:"0.05em", color:"var(--io-text)", fontVariantNumeric:"tabular-nums" }}>
            {timer}
          </span>
        )}
      </header>

      {drawerOpen && (
        <div className="io-drawer-backdrop" onClick={() => setDrawerOpen(false)} />
      )}

      <aside className={`io-drawer${drawerOpen ? " io-drawer-open" : ""}`}>
        <div className="io-drawer-head">
          <span className="io-navbar-wordmark">OPSCBT</span>
          <button className="io-navbar-icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Tutup menu">
            <IcoClose />
          </button>
        </div>

        <p className="io-drawer-section-label">{examData?.exam_name ?? "Ujian"}</p>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"8px", padding:"12px 16px" }}>
          {examData?.questions?.map((v, i) => {
            const isActive  = i === index
            const isAnswered = v.answer != null
            return (
              <button
                key={i}
                onClick={() => { setQuestions(v); setIndex(i); setDrawerOpen(false) }}
                style={{
                  display:"flex", alignItems:"center", justifyContent:"center",
                  height:"36px", borderRadius:"6px", fontSize:"13px", fontWeight:500,
                  cursor:"pointer", border:"none",
                  background: isActive
                    ? "oklch(55% 0.14 258)"
                    : isAnswered
                    ? "oklch(45% 0.14 258)"
                    : "oklch(38% 0.1 258)",
                  color: isActive || isAnswered ? "#fff" : "oklch(75% 0.06 258)",
                }}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </aside>
    </>
  )
}