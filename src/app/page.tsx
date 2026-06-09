import LandingNavbar from "@/components/LandingNavbar";
import { Metadata } from "next";

// ── SEO Metadata Teroptimasi (Server-Side) ──
export const metadata: Metadata = {
  title: "OPSCBT | Platform Ujian Online Terpadu & Terstandardisasi",
  description: "Sistem Computer Based Test (CBT) profesional untuk institusi pendidikan dan perusahaan. Kelola bank soal, jalankan sesi ujian aman, dan dapatkan analitik hasil secara real-time.",
  keywords: ["aplikasi ujian online", "platform CBT", "sistem ujian sekolah", "tryout SNBT", "ujian SKD", "rekrutmen online", "CBT terstandardisasi"],
  openGraph: {
    title: "OPSCBT - Evaluasi Presisi Berbasis Komputer",
    description: "Infrastruktur ujian online yang stabil dan aman untuk simulasi seleksi maupun evaluasi akademik berskala besar.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div style={{ backgroundColor: "var(--color-paper)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <LandingNavbar />

      {/* ── Hero ── */}
      <section style={{ 
        backgroundColor: "var(--navy)", 
        color: "white", 
        padding: "160px 24px 100px", 
        position: "relative", 
        overflow: "hidden",
        borderBottom: "1px solid var(--navy-mid)"
      }}>
        {/* Accent Circle */}
        <div style={{ 
          position: "absolute", 
          bottom: "-240px", right: "-100px", 
          width: "600px", height: "600px", 
          borderRadius: "50%", 
          border: "1px solid oklch(99% 0.005 250 / 0.10)", 
          pointerEvents: "none" 
        }} />

        <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
          
          <span style={{ 
            display: "inline-flex", alignItems: "center", gap: "8px", 
            padding: "6px 14px", borderRadius: "999px", 
            backgroundColor: "oklch(99% 0.005 250 / 0.1)", border: "1px solid oklch(99% 0.005 250 / 0.2)",
            fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase"
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-paper)" }} />
            PLATFORM CBT TERPADU
          </span>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem, 7vw, 5.2rem)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.03em", margin: 0 }}>
            Ujian online yang<br />
            <strong style={{ fontWeight: 600 }}>lebih terukur.</strong>
          </h1>

          <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", fontWeight: 300, color: "oklch(99% 0.005 250 / 0.7)", maxWidth: "600px", lineHeight: 1.7, margin: 0 }}>
            Sistem Computer Based Test yang andal untuk institusi pendidikan dan perusahaan. Mendukung penuh format ujian terstandardisasi untuk evaluasi yang presisi, aman, dan berintegritas.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "12px" }}>
            <a href="/signin" style={{ 
              display: "inline-flex", alignItems: "center", gap: "8px", 
              padding: "14px 32px", borderRadius: "8px", 
              backgroundColor: "var(--color-paper)", color: "var(--navy)", 
              fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 600, textDecoration: "none",
              transition: "transform 150ms ease"
            }}>
              Masuk / Sign In
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginTop: "24px" }}>
            {[
              { icon: '✓', text: 'Infrastruktur skalabel' },
              { icon: '⏱', text: 'Stabilitas server tinggi' },
              { icon: '🔒', text: 'Keamanan data terpusat' }
            ].map((badge, i) => (
              <div key={i} style={{ 
                display: "flex", alignItems: "center", gap: "10px", 
                padding: "10px 16px", borderRadius: "8px", 
                backgroundColor: "oklch(99% 0.005 250 / 0.05)", border: "1px solid oklch(99% 0.005 250 / 0.15)",
                fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 500, color: "var(--color-paper)"
              }}>
                <span style={{ color: "oklch(99% 0.005 250 / 0.6)" }}>{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div style={{ 
        borderBottom: "1px solid var(--color-line)", padding: "4rem 24px", 
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "3rem", 
        maxWidth: "1100px", margin: "0 auto", backgroundColor: "var(--color-paper)"
      }}>
        {[
          { num: '100%',     label: 'Terstandardisasi' },
          { num: '3',        label: 'Tingkat Otorisasi' },
          { num: '∞',        label: 'Kapasitas Bank Soal' },
          { num: 'Real-time',label: 'Kalkulasi Skor' },
        ].map(s => (
          <div style={{ textAlign: "center" }} key={s.label}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--color-ink)", display: "block", lineHeight: 1 }}>{s.num}</span>
            <span style={{ fontSize: "0.82rem", color: "var(--color-ink-muted)", marginTop: "8px", fontWeight: 500, display: "block", letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Features ── */}
      <section id="about" style={{ padding: "8rem 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy-light)", margin: "0 0 16px" }}>Infrastruktur</p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--color-ink)", margin: "0 0 64px", maxWidth: "500px" }}>
          Dibangun untuk skenario ujian yang presisi.
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          {[
            { icon: '🏫', name: 'Isolasi Classroom', desc: 'Setiap sesi ujian berjalan dalam ruang lingkup kelas yang terisolasi. Akses peserta dikendalikan melalui sistem allowlist/blocklist absolut.' },
            { icon: '📝', name: 'Manajemen Sub-tes', desc: 'Struktur database yang siap menangani format ujian bertingkat seperti TWK, TIU, TKP, maupun literasi numerik secara sekuensial.' },
            { icon: '⏱', name: 'Penetrasi Real-time', desc: 'Validasi skor sisi server secara instan segera setelah peserta menyelesaikan batch soal. Mengurangi waktu tunggu rekapitulasi data.' },
            { icon: '🔒', name: 'Autentikasi Aman', desc: 'Distribusi peran (Admin, Instruktur, User) yang tegas dengan autentikasi berbasis sesi untuk meminimalisir kebocoran akses.' },
          ].map(f => (
            <div key={f.name} style={{ background: "white", border: "1px solid var(--color-line)", borderRadius: "12px", padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--navy-fog)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", border: "1px solid var(--border)" }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 600, color: "var(--color-ink)", margin: 0 }}>{f.name}</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-ink-soft)", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ backgroundColor: "var(--navy)", padding: "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.08, color: "white", margin: "0 0 24px" }}>
            Siap menjalankan<br />
            <strong style={{ fontWeight: 600 }}>evaluasi berikutnya?</strong>
          </h2>
          <p style={{ fontSize: "1rem", color: "oklch(99% 0.005 250 / 0.7)", margin: "0 0 40px", fontWeight: 300 }}>
            Login untuk mengakses dasbor administratif atau mulai sesi sebagai peserta.
          </p>
          <a href="/signin" style={{ 
              display: "inline-flex", alignItems: "center", gap: "8px", 
              padding: "14px 32px", borderRadius: "8px", 
              backgroundColor: "white", color: "var(--navy)", 
              fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 600, textDecoration: "none",
          }}>
            Menuju Dasbor
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: "var(--navy)", borderTop: "1px solid oklch(99% 0.005 250 / 0.15)" }}>
        <div style={{ padding: "40px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px", maxWidth: "1100px", margin: "0 auto" }}>
          <a href="/" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "white", textDecoration: "none", letterSpacing: "0.08em" }}>OPSCBT</a>
          <ul style={{ display: "flex", gap: "32px", listStyle: "none", margin: 0, padding: 0, flexWrap: "wrap" }}>
            <li><a href="#about" style={{ fontSize: "0.85rem", color: "oklch(99% 0.005 250 / 0.7)", textDecoration: "none" }}>Fitur</a></li>
            <li><a href="/signin" style={{ fontSize: "0.85rem", color: "oklch(99% 0.005 250 / 0.7)", textDecoration: "none" }}>Sign In</a></li>
          </ul>
          <span style={{ fontSize: "0.78rem", color: "oklch(99% 0.005 250 / 0.5)" }}>© 2026 OPSCBT Core</span>
        </div>
      </footer>
    </div>
  );
}
