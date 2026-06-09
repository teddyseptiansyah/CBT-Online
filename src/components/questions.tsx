import { Answer } from "@/app/api/[[...route]]/types/exam"
import { ExamContext } from "@/context/Exam"
import { QuestionIndex } from "@/context/QuestionIndex"
import { QuestionsContext } from "@/context/Questions"
import { Timer } from "@/context/Timer"
import { useParams } from "next/navigation"
import { FormEvent, useContext, useEffect, useRef, useState } from "react"

export default function QuestionsDisplay() {
    const { examid, classid } = useParams()
    const { examData, setExamData } = useContext(ExamContext)
    const { questions, setQuestions } = useContext(QuestionsContext)
    const timerContext = useContext(Timer)
    const { index, setIndex } = useContext(QuestionIndex)
    const ConfirmModal = useRef({} as HTMLDialogElement)

    function setAnswer(answer: number) {
        questions.answer = answer
        setQuestions({ ...questions })

        const listQuestions = examData.questions
        if (listQuestions) listQuestions[index] = questions
        examData.questions = listQuestions
        setExamData({ ...examData })

        fetch("/api/user/", {
            method: "post",
            body: JSON.stringify({
                method: "SET_ANSWER",
                data: {
                    class_id: classid,
                    exam_id: examid,
                    question_index: examData.questions?.[index].index,
                    answer,
                },
            }),
        })
            .then(r => r.json())
            .then(json => {
                if (json.status === "FAIL")
                    document.location.href = `/dashboard/user/exam/${classid}/${examid}`
            })
    }

    function endSession() {
        fetch("/api/user/", {
            method: "post",
            body: JSON.stringify({
                method: "END_EXAM",
                data: { class_id: classid, exam_id: examid },
            }),
        })
            .then(r => r.json())
            .then(json => {
                if (json.status === "OK")
                    document.location.href = `/dashboard/user/class/${classid}/`
            })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now()
            const remain = (examData.due ?? 0) - now
            if (remain >= 0) {
                if (remain < 1000) {
                    document.location.href = `/dashboard/user/exam/${classid}/${examid}`
                    return
                }
                const hour = Math.floor(remain / 1000 / 60 / 60)
                const minutes = Math.floor((remain / 1000 / 60 / 60 - hour) * 60)
                const seconds = Math.floor(((remain / 1000 / 60 / 60 - hour) * 60 - minutes) * 60)
                timerContext.setTimer({ hour, minutes, seconds })
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [examData])

    const total = examData?.questions?.length ?? 0
    const isLast = index === total - 1

    return (
        <>
            {/* Confirm End Dialog */}
            <dialog
                ref={ConfirmModal}
                onClose={() => {}}
                style={{ padding: 0, border: "none", borderRadius: "12px", background: "transparent", maxWidth: "90vw" }}
            >
                <style>{`dialog::backdrop { background: oklch(0% 0 0 / 0.45); }`}</style>
                <div className="io-card" style={{ padding: "32px", width: "360px", maxWidth: "90vw", textAlign: "center" }}>
                    <span className="io-eyebrow" style={{ display: "block", marginBottom: "12px" }}>Akhiri Sesi Ujian?</span>
                    <p style={{ fontSize: "14px", color: "oklch(55% 0 0)", marginBottom: "28px" }}>
                        Jawaban yang sudah diisi akan tetap tersimpan.
                    </p>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                        <button
                            className="io-btn io-btn-ghost"
                            style={{ minWidth: "100px" }}
                            onClick={() => ConfirmModal.current.close()}
                        >
                            Batal
                        </button>
                        <button
                            className="io-btn io-btn-danger"
                            style={{ minWidth: "100px" }}
                            onClick={() => endSession()}
                        >
                            Akhiri
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Main layout */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                padding: "80px 16px 24px",
            }}>
                <div className="io-card" style={{
                    width: "100%",
                    maxWidth: "720px",
                    padding: 0,
                    overflow: "hidden",
                }}>
                    {/* Card header */}
                    <div style={{
                        padding: "14px 24px",
                        borderBottom: "1px solid var(--io-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <span className="io-eyebrow">Soal</span>
                        <span className="io-mtitle">
                            {index + 1}
                            <span style={{ fontWeight: 400, color: "oklch(60% 0 0)", fontSize: "13px" }}>
                                {" "}/ {total}
                            </span>
                        </span>
                    </div>

                    {/* Question body */}
                    <div style={{ padding: "28px 28px 20px" }}>
                        <p style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "20px" }}>
                            {questions?.question}
                        </p>

                        {/* Attachments */}
                        {questions?.attachment?.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                {questions.attachment
                                    .filter(v => v.type === "image")
                                    .map((v, i) => (
                                        <img key={i} src={v.source} alt={`Lampiran ${i + 1}`}
                                            style={{ maxWidth: "100%", maxHeight: "280px", borderRadius: "8px", objectFit: "contain" }}
                                        />
                                    ))}
                                {questions.attachment
                                    .filter(v => v.type === "audio")
                                    .map((v, i) => (
                                        <audio key={i} controls style={{ width: "100%" }}>
                                            <source src={v.source} />
                                        </audio>
                                    ))}
                            </div>
                        )}

                        {/* Answer options */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {questions?.list_answer?.map((v: Answer, i) => {
                                const selected = questions.answer === v.index
                                return (
                                    <label
                                        key={i}
                                        htmlFor={v.index?.toString()}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "14px",
                                            padding: "13px 16px",
                                            border: `1px solid ${selected ? "oklch(55% 0.14 258)" : "var(--io-border)"}`,
                                            borderRadius: "8px",
                                            background: selected ? "oklch(97% 0.03 258 / 0.5)" : undefined,
                                            cursor: "pointer",
                                            transition: "border-color 0.15s, background 0.15s",
                                        }}
                                    >
                                        <input
                                            id={v.index?.toString()}
                                            type="radio"
                                            value={v.index}
                                            checked={selected}
                                            onChange={() => setAnswer(v.index as number)}
                                            style={{ accentColor: "oklch(55% 0.14 258)", flexShrink: 0 }}
                                        />
                                        <span style={{ fontSize: "14px" }}>{v.text}</span>
                                    </label>
                                )
                            })}
                        </div>
                    </div>

                    {/* Navigation footer */}
                    <div style={{
                        padding: "16px 24px",
                        borderTop: "1px solid var(--io-border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        {index > 0 ? (
                            <button
                                className="io-btn io-btn-ghost"
                                onClick={() => { setQuestions(examData.questions?.[index - 1]); setIndex(index - 1) }}
                            >
                                ← Sebelumnya
                            </button>
                        ) : <div />}

                        {!isLast ? (
                            <button
                                className="io-btn io-btn-primary"
                                onClick={() => { setQuestions(examData.questions?.[index + 1]); setIndex(index + 1) }}
                            >
                                Selanjutnya →
                            </button>
                        ) : (
                            <button
                                className="io-btn io-btn-danger"
                                onClick={() => ConfirmModal.current.showModal()}
                            >
                                Akhiri Sesi
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}