"use client"
import Link from "next/link";

export default function LandingNavbar() {
  return (
    <nav 
      /* Menggunakan Tailwind untuk responsivitas: 
         px-6 untuk mobile, md:px-10 untuk desktop */
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 md:py-6 border-b"
      style={{ borderColor: "oklch(99% 0.005 250 / 0.15)" }}
    >
      
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
      {/* class "hidden md:flex" akan menyembunyikan menu ini di HP agar tidak sesak */}
      <div className="hidden md:flex items-center gap-8">
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
      </div>

      {/* ── Sign In Button ── */}
      <div>
        <Link href="/signin" style={{ 
          fontFamily: "var(--font-display)",
          fontSize: "0.9rem", 
          fontWeight: 600, 
          color: "white",
          textDecoration: "none",
          padding: "8px 20px", 
          backgroundColor: "oklch(99% 0.005 250 / 0.12)",
          border: "1px solid oklch(99% 0.005 250 / 0.25)", 
          borderRadius: "8px",
          whiteSpace: "nowrap", /* Kunci utama agar teks tidak turun ke baris baru */
          transition: "all 150ms ease"
        }}>
          Sign In
        </Link>
      </div>
      
    </nav>
  );
}
