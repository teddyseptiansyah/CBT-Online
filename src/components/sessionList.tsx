import { useEffect, useRef } from "react"

type SessionData = {
    show: boolean
    setShow: Function
    examSession: any[]
}

export function SessionList(p: SessionData) {
    const ref = useRef({} as HTMLDialogElement)

    useEffect(() => {
        if (p.show) ref.current.showModal()
        else ref.current.close()
    }, [p.show])

    return (
        <dialog
            ref={ref}
            onClose={() => p.setShow(false)}
            style={{ padding: 0, border: "none", borderRadius: "12px", background: "transparent", maxWidth: "90vw" }}
        >
            <style>{`dialog::backdrop { background: oklch(0% 0 0 / 0.45); }`}</style>

            <div
                className="io-card"
                style={{
                    padding: 0,
                    width: "640px",
                    maxWidth: "90vw",
                    maxHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid var(--io-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexShrink: 0,
                }}>
                    <span className="io-eyebrow">Detail Sesi</span>
                    <button
                        className="io-btn io-btn-ghost"
                        style={{ padding: "4px 10px" }}
                        onClick={() => p.setShow(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                {p.examSession.length > 0 ? (
                    <div style={{ overflowY: "auto", flex: 1, padding: "20px 24px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {["Nama Pengguna", "Total", "Jawaban Benar", "Skor"].map(h => (
                                        <th key={h} style={{
                                            padding: "10px 12px",
                                            borderBottom: "2px solid var(--io-border)",
                                            textAlign: "left",
                                            fontSize: "11px",
                                            fontWeight: 700,
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                            color: "oklch(55% 0.14 258)",
                                        }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {p.examSession.map((v, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid var(--io-border)" }}>
                                        <td style={{ padding: "12px", fontSize: "14px" }}>{v.user.information.fullname}</td>
                                        <td style={{ padding: "12px", fontSize: "14px", textAlign: "center" }}>{v.detail.total}</td>
                                        <td style={{ padding: "12px", fontSize: "14px", textAlign: "center" }}>{v.detail.correct_total}</td>
                                        <td style={{ padding: "12px", fontSize: "14px", textAlign: "center", fontWeight: 600 }}>{v.detail.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "48px 24px",
                        gap: "10px",
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                            stroke="oklch(75% 0 0)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                            <rect x="9" y="3" width="6" height="4" rx="1"/>
                            <line x1="9" y1="12" x2="15" y2="12"/>
                            <line x1="9" y1="16" x2="13" y2="16"/>
                        </svg>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--io-text)", margin: 0 }}>
                            Belum ada sesi
                        </p>
                        <p style={{ fontSize: "13px", color: "oklch(55% 0 0)", margin: 0, textAlign: "center" }}>
                            Peserta yang telah menyelesaikan ujian akan muncul di sini.
                        </p>
                    </div>
                )}
            </div>
        </dialog>
    )
}