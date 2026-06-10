import LandingNavbar from "@/components/LandingNavbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OPSCBT | Platform Ujian Online Terpadu & Terstandardisasi",
  description:
    "Sistem Computer Based Test profesional untuk institusi pendidikan, pemerintah, dan perusahaan. Kelola bank soal, jalankan sesi ujian aman, dan dapatkan analitik hasil secara real-time.",
  keywords: [
    "aplikasi ujian online", "platform CBT", "sistem ujian sekolah",
    "tryout SNBT", "ujian SKD", "rekrutmen online", "CBT terstandardisasi",
  ],
  openGraph: {
    title: "OPSCBT – Evaluasi Presisi Berbasis Komputer",
    description:
      "Infrastruktur ujian online yang stabil dan aman untuk simulasi seleksi maupun evaluasi akademik berskala besar.",
    type: "website",
  },
};

const globalStyles = `
  @keyframes grad-shift {
    0%   { background-position: 0%   50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0%   50%; }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes line-grow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  /* ── Aurora blob movements ── */
  @keyframes blob-1 {
    0%   { transform: translate(0px,    0px)    scale(1);    }
    20%  { transform: translate(120px, -80px)   scale(1.2);  }
    40%  { transform: translate(60px,   100px)  scale(0.85); }
    60%  { transform: translate(-80px,  40px)   scale(1.15); }
    80%  { transform: translate(40px,  -60px)   scale(0.9);  }
    100% { transform: translate(0px,    0px)    scale(1);    }
  }
  @keyframes blob-2 {
    0%   { transform: translate(0px,    0px)    scale(1);    }
    25%  { transform: translate(-100px,  60px)  scale(1.3);  }
    50%  { transform: translate(80px,   -90px)  scale(0.8);  }
    75%  { transform: translate(-40px,   80px)  scale(1.1);  }
    100% { transform: translate(0px,    0px)    scale(1);    }
  }
  @keyframes blob-3 {
    0%   { transform: translate(0px,    0px)    scale(1);    }
    30%  { transform: translate(90px,   70px)   scale(1.25); }
    60%  { transform: translate(-70px, -50px)   scale(0.9);  }
    100% { transform: translate(0px,    0px)    scale(1);    }
  }
  @keyframes blob-4 {
    0%   { transform: translate(0px,    0px)    scale(1);    }
    35%  { transform: translate(-110px, -70px)  scale(1.2);  }
    70%  { transform: translate(60px,   90px)   scale(0.85); }
    100% { transform: translate(0px,    0px)    scale(1);    }
  }
  @keyframes blob-5 {
    0%   { transform: translate(0px,    0px)    scale(1);    }
    40%  { transform: translate(70px,  -100px)  scale(1.35); }
    80%  { transform: translate(-90px,  50px)   scale(0.8);  }
    100% { transform: translate(0px,    0px)    scale(1);    }
  }

  /* mesh background gradient yg ikut bergerak */
  @keyframes mesh-drift {
    0%   { background-position: 0% 50%;   }
    33%  { background-position: 100% 0%;  }
    66%  { background-position: 50% 100%; }
    100% { background-position: 0% 50%;   }
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }

  .hero-accent-word {
    background: linear-gradient(135deg, #FFFFFF 0%, #A0B9FF 50%, #FFFFFF 100%);
    background-size: 200% 200%;
    animation: grad-shift 4s ease infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .grad-line {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent);
    background-size: 200% 100%;
    animation: grad-shift 6s ease infinite;
  }
  .grad-line-light {
    background: linear-gradient(90deg, transparent, rgba(8,21,74,0.15) 30%, rgba(8,21,74,0.15) 70%, transparent);
    background-size: 200% 100%;
    animation: grad-shift 7s ease infinite;
  }
  .grad-line-accent {
    background: linear-gradient(90deg, transparent, #2955E8 30%, #08154A 70%, transparent);
    background-size: 200% 100%;
    animation: grad-shift 5s ease infinite;
  }
  .grad-divider {
    background: linear-gradient(90deg, #0C1D60, rgba(41,85,232,0.4) 30%, rgba(41,85,232,0.4) 70%, #0C1D60);
    background-size: 200% 100%;
    animation: grad-shift 8s ease infinite;
  }
  .who-num {
    background: linear-gradient(135deg, #FFFFFF, rgba(160,185,255,0.8));
    background-size: 200% 200%;
    animation: grad-shift 5s ease infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Aurora layer ── */
  .aurora-layer {
    position: absolute;
    inset: -50%;
    width: 200%;
    height: 200%;
    pointer-events: none;
    z-index: 0;
  }

  /* mesh animated background */
  .aurora-mesh {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background:
      radial-gradient(ellipse 80% 60% at 20% 30%, rgba(41,85,232,0.35) 0%, transparent 55%),
      radial-gradient(ellipse 60% 80% at 80% 70%, rgba(120,40,255,0.3) 0%, transparent 55%),
      radial-gradient(ellipse 70% 50% at 60% 10%, rgba(0,180,220,0.2) 0%, transparent 50%),
      radial-gradient(ellipse 50% 70% at 10% 80%, rgba(80,0,200,0.25) 0%, transparent 50%);
    background-size: 200% 200%;
    animation: mesh-drift 15s ease-in-out infinite;
  }

  .aurora-blob {
    position: absolute;
    border-radius: 50%;
    mix-blend-mode: screen;
    pointer-events: none;
    will-change: transform;
  }

  /* Blob 1 — electric blue, top-right */
  .blob-1 {
    width: 680px; height: 680px;
    background: radial-gradient(circle at 40% 40%,
      rgba(41,120,255,0.9)  0%,
      rgba(41,85,232,0.7)  30%,
      rgba(20,50,180,0.3)  60%,
      transparent          80%
    );
    filter: blur(45px);
    top: -200px; right: -150px;
    animation: blob-1 12s ease-in-out infinite;
  }

  /* Blob 2 — violet/purple, left-center */
  .blob-2 {
    width: 600px; height: 600px;
    background: radial-gradient(circle at 50% 50%,
      rgba(140,40,255,0.85) 0%,
      rgba(100,20,220,0.6)  35%,
      rgba(60,0,180,0.25)   65%,
      transparent           80%
    );
    filter: blur(50px);
    top: 50px; left: -180px;
    animation: blob-2 16s ease-in-out infinite;
  }

  /* Blob 3 — cyan/teal, bottom-center */
  .blob-3 {
    width: 500px; height: 500px;
    background: radial-gradient(circle at 50% 50%,
      rgba(0,210,255,0.7)   0%,
      rgba(0,160,220,0.5)  35%,
      rgba(0,100,180,0.2)  65%,
      transparent          80%
    );
    filter: blur(55px);
    bottom: -100px; left: 25%;
    animation: blob-3 19s ease-in-out infinite;
  }

  /* Blob 4 — magenta/pink accent, center */
  .blob-4 {
    width: 420px; height: 420px;
    background: radial-gradient(circle at 50% 50%,
      rgba(200,50,255,0.65)  0%,
      rgba(160,30,220,0.45) 40%,
      rgba(100,0,180,0.15)  70%,
      transparent           85%
    );
    filter: blur(45px);
    top: 30%; left: 35%;
    animation: blob-4 14s ease-in-out infinite;
  }

  /* Blob 5 — indigo deep, bottom-right */
  .blob-5 {
    width: 560px; height: 560px;
    background: radial-gradient(circle at 40% 60%,
      rgba(60,80,255,0.75)  0%,
      rgba(30,50,200,0.5)  40%,
      rgba(10,20,150,0.2)  70%,
      transparent          85%
    );
    filter: blur(40px);
    bottom: -80px; right: -100px;
    animation: blob-5 17s ease-in-out infinite;
  }

  /* vignette agar tepi tetap gelap dan teks terbaca */
  .aurora-vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background:
      radial-gradient(ellipse 100% 100% at 50% 50%,
        transparent 30%,
        rgba(8,21,74,0.55) 70%,
        rgba(8,21,74,0.85) 100%
      );
  }

  .feat-card {
    background: #FFFFFF;
    border: 1px solid rgba(8,21,74,0.08);
    border-radius: 12px;
    padding: 28px 24px;
    display: flex; flex-direction: column; gap: 13px;
    transition: border-color 200ms, transform 200ms;
  }
  .feat-card:hover {
    border-color: rgba(41,85,232,0.25);
    transform: translateY(-2px);
  }
  .who-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 24px 20px;
    position: relative; overflow: hidden;
    transition: border-color 200ms;
  }
  .who-card:hover { border-color: rgba(255,255,255,0.2); }
  .who-card::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(41,85,232,0.6), transparent);
    background-size: 200% 100%;
    animation: grad-shift 5s ease infinite;
    opacity: 0; transition: opacity 200ms;
  }
  .who-card:hover::after { opacity: 1; }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 13px 22px; border-radius: 8px;
    background: transparent; color: rgba(255,255,255,0.55);
    border: 1px solid rgba(255,255,255,0.08);
    font-family: var(--font-display); font-size: 0.88rem; font-weight: 500;
    text-decoration: none; transition: border-color 150ms, color 150ms;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #FFFFFF; }

  @media (max-width: 700px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
    .stat-divider { display: none !important; }
  }
`;

const FEATURES = [
  {
    icon: "🏫",
    title: "Isolasi Classroom",
    desc: "Setiap sesi berjalan dalam ruang kelas terisolasi. Akses peserta dikendalikan lewat allowlist dan blocklist absolut.",
  },
  {
    icon: "📝",
    title: "Manajemen Sub-tes",
    desc: "Mendukung format bertingkat seperti TWK, TIU, TKP, dan literasi numerik secara sekuensial.",
  },
  {
    icon: "⏱",
    title: "Skor Real-time",
    desc: "Validasi sisi server secara instan setelah peserta menyelesaikan batch soal. Rekapitulasi tanpa tunda.",
  },
  {
    icon: "🔒",
    title: "Autentikasi Berlapis",
    desc: "Distribusi peran Admin, Instruktur, dan User yang tegas dengan autentikasi berbasis sesi.",
  },
];

const WHO = [
  {
    num: "01",
    title: "Institusi Pendidikan",
    desc: "Sekolah, universitas, dan lembaga kursus yang menyelenggarakan ujian terstandar secara digital.",
  },
  {
    num: "02",
    title: "Instansi Pemerintah",
    desc: "Seleksi aparatur negara, SKD/SKB, dan ujian sertifikasi yang membutuhkan integritas tinggi.",
  },
  {
    num: "03",
    title: "Korporasi & Swasta",
    desc: "Rekrutmen, tes kompetensi internal, dan penilaian karyawan yang efisien dan dapat diaudit.",
  },
];

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <div style={{ backgroundColor: "#08154A", minHeight: "100vh", fontFamily: "var(--font-body)", overflowX: "clip" }}>
        <LandingNavbar />

        {/* ── Hero ── */}
        <section style={{ background: "#07123E", padding: "96px 48px 100px", position: "relative", overflow: "hidden", minHeight: "520px" }}>

          {/* Animated mesh base */}
          <div className="aurora-mesh" />

          {/* Aurora blobs */}
          <div className="aurora-blob blob-1" />
          <div className="aurora-blob blob-2" />
          <div className="aurora-blob blob-3" />
          <div className="aurora-blob blob-4" />
          <div className="aurora-blob blob-5" />

          {/* Vignette — keeps edges dark & readable */}
          <div className="aurora-vignette" />

          {/* Bottom border */}
          <div className="grad-line" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", zIndex: 2 }} />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 2, maxWidth: "1040px", margin: "0 auto" }}>
            <div style={{ animation: "fade-up 0.7s ease both", maxWidth: "620px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-display)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(160,185,255,1)", marginBottom: "24px" }}>
                <span style={{ width: "28px", height: "1px", background: "rgba(160,185,255,0.5)", display: "inline-block" }} />
                Platform CBT Terpadu
              </div>

              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.035em", color: "#FFFFFF", margin: "0 0 20px" }}>
                Ujian online yang<br />
                <strong style={{ fontWeight: 700 }}>
                  <span className="hero-accent-word">lebih terukur.</span>
                </strong>
              </h1>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 300, lineHeight: 1.75, color: "rgba(255,255,255,0.65)", maxWidth: "480px", margin: "0 0 36px" }}>
                Infrastruktur Computer Based Test untuk institusi pendidikan, instansi pemerintah, dan korporasi. Presisi, aman, dan siap diaudit.
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <a href="/signin" style={{ display: "inline-flex", alignItems: "center", gap: "9px", padding: "13px 26px", borderRadius: "8px", background: "#FFFFFF", color: "#08154A", fontFamily: "var(--font-display)", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none" }}>
                  Masuk ke Platform <ArrowIcon />
                </a>
                <a href="#about" className="btn-ghost">Lihat Fitur</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats band ── */}
        <div style={{ background: "#FFFFFF", padding: "52px 48px" }}>
          <div className="stats-grid" style={{ maxWidth: "1040px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
            {[
              ["100%", "Terstandardisasi"],
              ["3", "Tingkat otorisasi"],
              ["∞", "Kapasitas bank soal"],
              ["Real‑time", "Kalkulasi skor"],
            ].map(([num, label], i) => (
              <div key={label} style={{ textAlign: "center", padding: "0 32px", position: "relative" }}>
                {i > 0 && <span className="stat-divider" style={{ position: "absolute", left: 0, top: "15%", height: "70%", width: "1px", background: "rgba(8,21,74,0.1)" }} />}
                <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.04em", color: "#08154A", display: "block", lineHeight: 1, marginBottom: "7px" }}>{num}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 500, color: "#4A5585", letterSpacing: "0.07em", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Features ── */}
        <section id="about" style={{ background: "#F7F8FC", padding: "88px 48px", position: "relative", overflow: "hidden" }}>
          <div className="grad-line-light" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px" }} />
          <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2955E8", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "20px", height: "1px", background: "#2955E8", opacity: 0.5, display: "inline-block" }} />
              Infrastruktur
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,3.2vw,2.4rem)", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#08154A", margin: "0 0 52px", maxWidth: "500px" }}>
              Dibangun untuk skenario ujian yang presisi.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: "16px" }}>
              {FEATURES.map((f) => (
                <div className="feat-card" key={f.title}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: "#EEF2FF", fontSize: "15px", flexShrink: 0 }}>
                    {f.icon}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 600, color: "#08154A" }}>{f.title}</div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.845rem", color: "#4A5585", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Animated divider ── */}
        <div className="grad-divider" style={{ height: "1px" }} />

        {/* ── Who ── */}
        <section style={{ background: "#0C1D60", padding: "80px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 600px 400px at 90% 50%, rgba(41,85,232,0.2) 0%, transparent 60%), radial-gradient(ellipse 400px 500px at 5% 60%, rgba(120,40,255,0.15) 0%, transparent 55%)",
          }} />
          <div style={{ maxWidth: "1040px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(160,185,255,1)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "20px", height: "1px", background: "rgba(160,185,255,0.4)", display: "inline-block" }} />
              Cocok untuk
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#FFFFFF", margin: "0 0 40px", maxWidth: "480px" }}>
              Satu platform, berbagai kebutuhan evaluasi.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "14px" }}>
              {WHO.map((w) => (
                <div className="who-card" key={w.num}>
                  <span className="who-num" style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.04em", display: "block", lineHeight: 1, marginBottom: "10px" }}>{w.num}</span>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 600, color: "#FFFFFF", marginBottom: "6px" }}>{w.title}</div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ background: "#FFFFFF", padding: "96px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div className="grad-line-accent" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#08154A", margin: "0 0 14px" }}>
            Siap menjalankan<br />
            <strong style={{ fontWeight: 700 }}>evaluasi berikutnya?</strong>
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 300, color: "#4A5585", margin: "0 0 32px" }}>
            Login untuk mengakses dasbor administratif atau mulai sesi sebagai peserta.
          </p>
          <a href="/signin" style={{ display: "inline-flex", alignItems: "center", gap: "9px", padding: "13px 28px", borderRadius: "8px", background: "#08154A", color: "#FFFFFF", fontFamily: "var(--font-display)", fontSize: "0.88rem", fontWeight: 600, textDecoration: "none" }}>
            Menuju Dasbor <ArrowIcon />
          </a>
        </section>

        {/* ── Footer ── */}
        <footer style={{ background: "#08154A", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <a href="/" style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.12em", color: "#FFFFFF", textDecoration: "none" }}>OPSCBT</a>
          <div style={{ display: "flex", gap: "28px" }}>
            {["Fitur", "Sign In"].map((l) => (
              <a key={l} href={l === "Sign In" ? "/signin" : "#about"} style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.73rem", color: "rgba(255,255,255,0.3)" }}>© 2026 OPSCBT Core</span>
        </footer>
      </div>
    </>
  );
}
