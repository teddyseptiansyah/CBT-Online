type modalObject = {
    show: boolean
    className?: string
    setShow: Function
    children: React.ReactNode
}

export default function Modal(props: modalObject) {
    return (
        <>
            {/* Backdrop */}
            <div
                onClick={() => props.setShow(false)}
                style={{
                    display: props.show ? "block" : "none",
                    position: "fixed",
                    inset: 0,
                    background: "oklch(0% 0 0 / 0.4)",
                    zIndex: 40,
                }}
            />

            {/* Modal panel */}
            <div
                className={props.className ?? ""}
                onClick={ev => ev.stopPropagation()}
                style={{
                    display: props.show ? "flex" : "none",
                    flexDirection: "column",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 50,
                    background: "var(--io-surface, #fff)",
                    border: "1px solid var(--io-border)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px oklch(0% 0 0 / 0.12)",
                    minWidth: "320px",
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    overflow: "auto",
                }}
            >
                {props.children}
            </div>
        </>
    )
}