import { useEffect, useRef } from "react"

export type deletePromptObject = {
    promptText: string
    setShow: Function
    show: boolean
    deleteFunction: Function
}

export default function DeletePrompt(props: deletePromptObject) {
    const ref = useRef({} as HTMLDialogElement)

    useEffect(() => {
        if (props.show) ref.current.showModal()
        else ref.current.close()
    }, [props.show])

    return (
        <dialog
            ref={ref}
            onClose={() => props.setShow(false)}
            style={{ padding: 0, border: "none", borderRadius: "12px", background: "transparent" }}
        >
            <style>{`dialog::backdrop { background: oklch(0% 0 0 / 0.45); }`}</style>

            <div className="io-card" style={{ padding: "28px 28px 24px", width: "360px", maxWidth: "90vw" }}>
                {/* Icon */}
                <div style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    background: "oklch(95% 0.04 27)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "16px",
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="oklch(55% 0.19 27)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                </div>

                <p style={{ fontSize: "14px", color: "var(--io-text)", lineHeight: 1.6, marginBottom: "24px" }}>
                    {props.promptText}
                </p>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button
                        className="io-btn io-btn-ghost"
                        onClick={() => props.setShow(false)}
                    >
                        Batal
                    </button>
                    <button
                        className="io-btn io-btn-danger"
                        onClick={() => props.deleteFunction()}
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </dialog>
    )
}