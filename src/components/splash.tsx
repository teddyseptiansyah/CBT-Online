"use client"
import { useEffect, useState } from "react"

export default function Splash({isLoad}: {isLoad: boolean}){
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
    }, [])

    return (
        <div className={"flex flex-col items-center justify-center min-h-[100vh]" + (isLoad ? "" : " hidden")}>
            <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: "oklch(28% 0.14 258)",
                transition: "opacity 500ms ease, transform 500ms ease",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)"
            }}>
                OPSCBT
            </span>
        </div>
    )
}