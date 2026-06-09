import { useState } from "react"
import { Answer, Attachment, Questions } from "@/app/api/[[...route]]/types/exam"

type QuestionsParam = {
    v: Questions,
    questions: Questions[],
    setQuestions: Function,
    setSaved: Function,
    i: number,
    setModalAttachment: Function,
    setSelectedQIndex: Function,
    setSelectedAIndex: Function,
    correctToggle: Function,
    addAnswer: Function,
    deleteQuestion: Function,
    saving: Function,
    deleteAttachment: Function
    deleteAnswer: Function
}

export default function QuestionsForm(p: QuestionsParam) {
    const [open, setOpen] = useState(false)

    const preview = p.v.question?.trim() ? p.v.question : "Belum ada pertanyaan"
    const answerCount = p.v.list_answer?.length ?? 0
    const correctCount = p.v.list_answer?.filter(a => a.correct).length ?? 0

    return (
        <div className="io-card" style={{ marginBottom: "8px", overflow: "hidden" }}>

            {/* Accordion header */}
            <div
                onClick={() => setOpen(o => !o)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px 20px",
                    cursor: "pointer",
                    userSelect: "none",
                    borderBottom: open ? "1px solid var(--io-border)" : "none",
                }}
            >
                <span style={{
                    flexShrink: 0,
                    width: "28px", height: "28px",
                    borderRadius: "50%",
                    background: "oklch(55% 0.14 258)",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    {p.i + 1}
                </span>

                <span style={{
                    flex: 1,
                    fontSize: "14px",
                    color: p.v.question?.trim() ? "var(--io-text)" : "oklch(60% 0 0)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}>
                    {preview}
                </span>

                {!open && (
                    <span style={{ fontSize: "12px", color: "oklch(60% 0 0)", flexShrink: 0 }}>
                        {answerCount} jawaban{correctCount > 0 ? ` · ${correctCount} benar` : ""}
                    </span>
                )}

                <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{
                        flexShrink: 0,
                        transition: "transform 0.2s",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        color: "oklch(60% 0 0)",
                    }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>

            {/* Collapsible body */}
            {open && (
                <div style={{ padding: "24px" }}>

                    {/* Question text */}
                    <div className="io-field" style={{ marginBottom: "24px" }}>
                        <label className="io-label">Pertanyaan</label>
                        <input
                            type="text"
                            className="io-input"
                            value={p.v.question}
                            onChange={(ev) => {
                                let q = [...p.questions];
                                q[p.i].question = ev.target.value;
                                p.setQuestions(q);
                                p.setSaved(false);
                            }}
                            onBlur={() => p.saving()}
                        />
                    </div>

                    {/* Attachment section */}
                    <div style={{ marginBottom: "20px" }}>
                        <label className="io-label" style={{ marginBottom: "10px" }}>Lampiran</label>

                        {p.v.attachment.map((w: Attachment, j: number) => (
                            <div
                                key={j}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                    padding: "12px",
                                    border: "1px solid var(--io-border)",
                                    borderRadius: "8px",
                                    marginBottom: "8px",
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    {w.type === "image" ? (
                                        <img
                                            width={75}
                                            height={75}
                                            src={w.source}
                                            alt="Attachment"
                                            style={{ borderRadius: "6px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <audio controls style={{ width: "100%", maxWidth: "280px" }}>
                                            <source src={w.source} />
                                        </audio>
                                    )}
                                </div>
                                <button
                                    className="io-btn io-btn-danger"
                                    onClick={() => p.deleteAttachment(p.i, j)}
                                >
                                    Hapus
                                </button>
                            </div>
                        ))}

                        <button
                            className="io-btn io-btn-ghost"
                            style={{ width: "100%", marginTop: "4px" }}
                            onClick={() => {
                                p.setModalAttachment(true);
                                p.setSelectedQIndex(p.i);
                            }}
                        >
                            + Tambah Lampiran
                        </button>
                    </div>

                    {/* Answers section */}
                    <div>
                        <label className="io-label" style={{ marginBottom: "10px" }}>Pilihan Jawaban</label>

                        {p.v.list_answer.map((w: Answer, j: number) => (
                            <div
                                key={j}
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    alignItems: "center",
                                    padding: "12px",
                                    border: "1px solid var(--io-border)",
                                    borderRadius: "8px",
                                    marginBottom: "8px",
                                    background: w.correct ? "oklch(97% 0.02 165 / 0.5)" : undefined,
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        className="io-input"
                                        value={w.text}
                                        onChange={(ev) => {
                                            let qs = [...p.questions];
                                            qs[p.i].list_answer[j].text = ev.target.value;
                                            p.setQuestions(qs);
                                            p.setSaved(false);
                                        }}
                                        onBlur={() => p.saving()}
                                    />
                                </div>
                                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                                    {w.correct ? (
                                        <button
                                            className="io-btn io-btn-danger"
                                            onClick={() => p.correctToggle(p.i, j)}
                                        >
                                            Batalkan Benar
                                        </button>
                                    ) : (
                                        <button
                                            className="io-btn io-btn-primary"
                                            onClick={() => p.correctToggle(p.i, j)}
                                        >
                                            Tandai Benar
                                        </button>
                                    )}
                                    <button
                                        className="io-btn io-btn-danger"
                                        onClick={() => p.deleteAnswer(p.i, j)}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            className="io-btn io-btn-ghost"
                            style={{ width: "100%", marginTop: "4px" }}
                            onClick={() => p.addAnswer(p.i)}
                        >
                            + Tambah Jawaban
                        </button>
                    </div>

                    {/* Delete question */}
                    <div style={{ borderTop: "1px solid var(--io-border)", marginTop: "24px", paddingTop: "20px" }}>
                        <button
                            className="io-btn io-btn-danger"
                            style={{ width: "100%" }}
                            onClick={() => p.deleteQuestion(p.i)}
                        >
                            Hapus Soal {p.i + 1}
                        </button>
                    </div>

                </div>
            )}

        </div>
    )
}