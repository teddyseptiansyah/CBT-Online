"use client";
import Link from "next/link";

export default function LandingNavbar() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 48px", height: "62px",
      background: "rgba(8,21,74,0.92)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}>
      <Link href="/" style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem",
        letterSpacing: "0.12em", color: "#FFFFFF", textDecoration: "none",
      }}>
        OPSCBT
      </Link>

      <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
        <Link href="#about" style={{
          fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 400,
          color: "rgba(255,255,255,0.55)", textDecoration: "none",
        }}>
          Fitur
        </Link>
        <Link href="#docs" style={{
          fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 400,
          color: "rgba(255,255,255,0.55)", textDecoration: "none",
        }}>
          Docs
        </Link>
      </div>

      <Link href="/signin" style={{
        fontFamily: "var(--font-display)", fontSize: "0.82rem", fontWeight: 600,
        color: "#08154A", textDecoration: "none",
        padding: "8px 20px", borderRadius: "6px",
        backgroundColor: "#FFFFFF",
      }}>
        Sign In
      </Link>
    </nav>
  );
}
