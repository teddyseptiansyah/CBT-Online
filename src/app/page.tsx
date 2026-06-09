import LandingNavbar from "@/components/LandingNavbar";

export default function Home() {
  return (
    <div>
      <LandingNavbar />

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <span className="lp-badge">
            <span className="lp-badge-dot" />
            Open Source · Free to Use
          </span>

          <h1 className="lp-headline">
            Ujian online yang<br />
            <span className="lp-headline-accent">lebih sederhana</span>
          </h1>

          <p className="lp-sub">
            Platform CBT open-source untuk sekolah dan institusi.
            Buat soal, kelola kelas, dan pantau hasil ujian — dalam satu tempat.
          </p>

          <div className="lp-cta">
            <a href="/signin" className="lp-btn-primary">
              Mulai Sekarang
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          <div className="lp-float-cards" aria-hidden="true">
            <div className="lp-card-float lp-card-float-a">
              <div className="lp-float-icon lp-float-icon-green">✓</div>
              Sesi ujian aktif
            </div>
            <div className="lp-card-float lp-card-float-b">
              <div className="lp-float-icon lp-float-icon-amber">⏱</div>
              Lebih dari 100 peserta online
            </div>
            <div className="lp-card-float lp-card-float-c">
              <div className="lp-float-icon lp-float-icon-blue">📋</div>
              Hasil langsung tersedia
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="lp-stats">
        {[
          { num: '100%', label: 'Open Source' },
          { num: '3',    label: 'Role pengguna' },
          { num: '∞',    label: 'Soal & kelas' },
          { num: '0',    label: 'Biaya lisensi' },
        ].map(s => (
          <div className="lp-stat" key={s.label}>
            <span className="lp-stat-num">{s.num}</span>
            <span className="lp-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Features ── */}
      <section id="about" className="lp-features">
        <p className="lp-section-eyebrow">Fitur Utama</p>
        <h2 className="lp-section-title">
          Semua yang kamu butuhkan, tidak lebih.
        </h2>
        <div className="lp-grid">
          {[
            {
              icon: '🏫', cls: 'fi-blue',
              name: 'Manajemen Kelas',
              desc: 'Buat kelas, atur peserta, dan kelola akses dengan mudah. Admin, instruktur, dan siswa punya tampilan masing-masing.',
            },
            {
              icon: '📝', cls: 'fi-green',
              name: 'Bank Soal Fleksibel',
              desc: 'Buat dan simpan soal pilihan ganda. Atur urutan, bobot nilai, dan durasi ujian sesuai kebutuhan.',
            },
            {
              icon: '⏱', cls: 'fi-amber',
              name: 'Ujian Real-time',
              desc: 'Timer otomatis, submit langsung, dan hasil tersedia segera setelah sesi berakhir.',
            },
            {
              icon: '🔒', cls: 'fi-purple',
              name: 'Kontrol Akses',
              desc: 'Allow & block peserta per kelas. Autentikasi JWT yang aman untuk setiap sesi.',
            },
          ].map(f => (
            <div className="lp-feature-card" key={f.name}>
              <div className={`lp-feature-icon ${f.cls}`} aria-hidden="true">{f.icon}</div>
              <p className="lp-feature-name">{f.name}</p>
              <p className="lp-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Docs ── */}
    <section id="docs" className="lp-features">
    <p className="lp-section-eyebrow">Dokumentasi</p>
    <h2 className="lp-section-title">Panduan penggunaan</h2>
    <div className="lp-grid">
        {[
        {
            icon: '1', cls: 'fi-blue',
            name: 'Buat Akun & Login',
            desc: 'Admin mendaftarkan akun melalui halaman registrasi. Setelah akun aktif, login menggunakan username dan password yang telah dibuat.',
        },
        {
            icon: '2', cls: 'fi-green',
            name: 'Buat Kelas',
            desc: 'Masuk ke menu Kelas, klik Tambah Kelas, lalu isi nama kelas dan daftarkan peserta. Setiap kelas punya kode akses tersendiri.',
        },
        {
            icon: '3', cls: 'fi-amber',
            name: 'Buat Bank Soal',
            desc: 'Di menu Bank Soal, tambahkan soal pilihan ganda beserta kunci jawaban. Soal dapat digunakan ulang di ujian berbeda.',
        },
        {
            icon: '4', cls: 'fi-purple',
            name: 'Buat & Jalankan Ujian',
            desc: 'Buat sesi ujian, pilih soal dari bank soal, atur durasi, lalu aktifkan sesi. Peserta mengerjakan secara real-time dan hasil langsung tersedia.',
        },
        ].map(f => (
        <div className="lp-feature-card" key={f.name}>
            <div className={`lp-feature-icon ${f.cls}`} aria-hidden="true" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{f.icon}</div>
            <p className="lp-feature-name">{f.name}</p>
            <p className="lp-feature-desc">{f.desc}</p>
        </div>
        ))}
    </div>
    </section>

      {/* ── Changelog placeholder ── */}
      <section id="changelog" className="lp-features">
        <p className="lp-section-eyebrow">Changelog</p>
        <h2 className="lp-section-title">Riwayat pembaruan.</h2>
        <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.95rem', fontWeight: 300 }}>
          Belum ada entri changelog.
        </p>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="lp-cta-section">
        <h2 className="lp-cta-title">
          Siap mulai ujian<br />pertama kamu?
        </h2>
        <p className="lp-cta-sub">Uji Coba Kemampuanmu Di Sini!</p>
        <div className="lp-cta" style={{ justifyContent: 'center' }}>
          <a href="/signin" className="lp-btn-primary">
            Masuk ke Dashboard
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="lp-footer">
          <a href="/" className="lp-footer-brand">OPSCBT</a>
          <ul className="lp-footer-links">
            <li><a href="#about">About</a></li>
            <li><a href="#docs">Docs</a></li>
            <li><a href="#changelog">Changelog</a></li>
          </ul>
          <span className="lp-footer-copy">© 2026 OPSCBT</span>
        </div>
      </footer>
    </div>
  );
}