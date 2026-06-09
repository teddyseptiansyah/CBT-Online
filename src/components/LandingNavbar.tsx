"use client"
import Link from "next/link";

export default function LandingNavbar() {
  return (
    <nav style={{
      position: "absolute",
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 50,
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between",
      padding: "24px 40px",
      backgroundColor: "transparent",
      borderBottom: "1px solid oklch(99% 0.005 250 / 0.15)",
    }}>
      
      {/* ── Logo ── */}
      <Link href="/" style={{ 
        fontFamily: "var(--font-display)",
        fontSize: "1.2rem", 
        fontWeight: 700, 
        color: "white",
        textDecoration: "none", 
        letterSpacing: "0.08em" 
      }}>
        OPSCBT
      </Link>

      {/* ── Menu Links ── */}
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        <Link href="#about" style={{ 
            fontFamily: "var(--font-body)", 
            fontSize: "0.95rem", 
            color: "oklch(99% 0.005 250 / 0.75)", 
            textDecoration: "none",
            fontWeight: 400
        }}>
          Fitur
        </Link>
        <Link href="#docs" style={{ 
            fontFamily: "var(--font-body)", 
            fontSize: "0.95rem", 
            color: "oklch(99% 0.005 250 / 0.75)", 
            textDecoration: "none",
            fontWeight: 400
        }}>
          Docs
        </Link>
        <Link href="#changelog" style={{ 
            fontFamily: "var(--font-body)", 
            fontSize: "0.95rem", 
            color: "oklch(99% 0.005 250 / 0.75)", 
            textDecoration: "none",
            fontWeight: 400
        }}>
          Changelog
        </Link>
      </div>

      {/* ── Sign In Button ── */}
      <div>
        <Link href="/signin" style={{ 
          fontFamily: "var(--font-display)",
          fontSize: "0.95rem", 
          fontWeight: 600, 
          color: "white",
          textDecoration: "none",
          padding: "10px 24px", 
          backgroundColor: "oklch(99% 0.005 250 / 0.12)",
          border: "1px solid oklch(99% 0.005 250 / 0.25)", 
          borderRadius: "8px",
          transition: "all 150ms ease"
        }}>
          Sign In
        </Link>
      </div>
      
    </nav>
  );
}