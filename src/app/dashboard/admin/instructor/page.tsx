/* Hallmark · macrostructure: Workbench · genre: modern-minimal
 * tone: institutional-austere · anchor hue: oklch(28% 0.14 258) navy
 * CSS → globals.css (semua class io-* ada di sana)
 */
"use client"
import { Users } from "@/app/api/[[...route]]/types/user";
import Navbar from "@/components/AdminNavbar";
import Splash from "@/components/splash";
import { UserData } from "@/context/UserData";
import { useEffect, useRef, useState } from "react";
import crypto from "crypto";

const BLANK: Users = {
  username: "",
  password: "",
  role: "instructor",
  information: { fullname: "", email: "", phone: "", avatar: "" },
};

export default function InstructorEditorPage() {
  const [userData,     setUserData]     = useState<Users>();
  const [load,         setLoad]         = useState(true);
  const [dataList,     setDataList]     = useState<Users[]>([]);
  const [indexData,    setIndexData]    = useState(0);
  const [process,      setProcess]      = useState(false);
  const [newIns,       setNewIns]       = useState<Users>({ ...BLANK, information: { ...BLANK.information } });
  const [searchQ,      setSearchQ]      = useState("");
  const [toast,        setToast]        = useState<{ msg: string; ok: boolean } | null>(null);
  const [deleteTgt,    setDeleteTgt]    = useState<{ id: string; name: string } | null>(null);

  const toastTimer  = useRef<ReturnType<typeof setTimeout>>();
  const overlayNew  = useRef<HTMLDivElement>(null);
  const overlayEdit = useRef<HTMLDivElement>(null);
  const overlayDel  = useRef<HTMLDivElement>(null);

  /* ── auth ── */
  useEffect(() => {
    fetch("/api/auth/", {
      method: "post",
      body: JSON.stringify({ method: "AUTHENTICATION" }),
    })
      .then(r => r.json())
      .then(json => {
        if (json.status !== "OK") { document.location.href = "/signin"; return; }
        switch (json.data.role) {
          case "instructor": document.location.href = "/dashboard/instructor"; break;
          case "user":       document.location.href = "/dashboard/user";       break;
          case "admin":
            setUserData(json.data);
            setLoad(false);
            break;
        }
      });
  }, []);

  function loadDataList() {
    fetch("/api/admin/", {
      method: "post",
      body: JSON.stringify({ method: "GET_INSTRUCTOR" }),
    })
      .then(r => r.json())
      .then(json => { if (json.status !== "FAIL") setDataList(json.data); });
  }

  useEffect(() => { if (!load) loadDataList(); }, [load]);

  /* ── toast ── */
  function showToast(msg: string, ok = true) {
    clearTimeout(toastTimer.current);
    setToast({ msg, ok });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  /* ── modal helpers ── */
  const openNew   = () => overlayNew.current?.classList.add("io-open");
  const closeNew  = () => overlayNew.current?.classList.remove("io-open");
  const openEdit  = () => overlayEdit.current?.classList.add("io-open");
  const closeEdit = () => overlayEdit.current?.classList.remove("io-open");
  const openDel   = () => overlayDel.current?.classList.add("io-open");
  const closeDel  = () => { overlayDel.current?.classList.remove("io-open"); setDeleteTgt(null); };

  /* ── save new ── */
  async function saveNew() {
    setProcess(true);
    const res  = await fetch("/api/admin/", {
      method: "POST",
      body: JSON.stringify({ method: "ADD_INSTRUCTOR", data: newIns }),
    });
    const json = await res.json();
    setProcess(false);
    if (json.status !== "FAIL") {
      setNewIns({ ...BLANK, information: { ...BLANK.information } });
      loadDataList();
      closeNew();
      showToast("Instruktur berhasil ditambahkan.");
    } else {
      showToast("Gagal menambahkan instruktur.", false);
    }
  }

  /* ── save edit ── */
  async function saveEdit() {
    setProcess(true);
    const res  = await fetch("/api/admin/", {
      method: "POST",
      body: JSON.stringify({ method: "MODIFY", data: dataList[indexData] }),
    });
    const json = await res.json();
    setProcess(false);
    if (json.status !== "FAIL") {
      loadDataList();
      closeEdit();
      showToast("Data instruktur diperbarui.");
    } else {
      showToast("Gagal menyimpan perubahan.", false);
    }
  }

  /* ── delete ── */
  async function doDelete() {
    if (!deleteTgt) return;
    const res  = await fetch("/api/admin/", {
      method: "POST",
      body: JSON.stringify({ method: "DELETE", data: { id: deleteTgt.id } }),
    });
    const json = await res.json();
    if (json.status !== "FAIL") {
      loadDataList();
      closeDel();
      showToast("Instruktur dihapus.");
    } else {
      showToast("Gagal menghapus instruktur.", false);
    }
  }

  const filtered = dataList.filter(v => {
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return (
      v.username.toLowerCase().includes(q) ||
      v.information.fullname.toLowerCase().includes(q) ||
      v.information.email.toLowerCase().includes(q)
    );
  });

  /* ── icon helpers ── */
  const IcoPlus = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
  const IcoClose = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
  const IcoCheck = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
  const IcoEdit = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
  const IcoTrash = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
  const IcoSearch = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );

  return (
    <>
      <Splash isLoad={load} />

      {/* Container utama dengan min-height agar bisa di-scroll secara alami */}
      <div className={`io-page${load ? " hidden" : ""}`} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <UserData.Provider value={userData as Users}>
          <Navbar />
        </UserData.Provider>

        {/* Main Content Area */}
        <main className="io-main" style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            gap: "24px", 
            padding: "88px 24px 40px", /* 88px di atas memastikan tidak tertutup Navbar */
            maxWidth: "1200px", 
            margin: "0 auto", 
            width: "100%",
        }}>

          {/* Page header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p className="io-eyebrow" style={{ margin: "0 0 6px 0", fontSize: "11px" }}>Manajemen Pengguna</p>
              <h1 className="io-title" style={{ margin: 0, fontSize: "28px" }}>Daftar <strong>Instruktur</strong></h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="io-count">{dataList.length} instruktur</span>
              <button className="io-btn io-btn-primary" onClick={openNew}>
                <IcoPlus /> Tambah Instruktur
              </button>
            </div>
          </div>

          {/* Table card */}
          <div className="io-card" style={{ width: "100%" }}>
            <div className="io-toolbar" style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
              <div className="io-search-wrap">
                <span className="io-search-icon"><IcoSearch /></span>
                <input
                  className="io-search"
                  type="text"
                  placeholder="Cari instruktur…"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                />
              </div>
              <span className="io-meta">
                Menampilkan {filtered.length} dari {dataList.length}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="io-empty" style={{ padding: "40px 20px" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                <p style={{ fontSize: "14px", margin: "10px 0 0" }}>Belum ada instruktur terdaftar</p>
              </div>
            ) : (
              <div style={{ width: "100%", overflowX: "auto" }}>
                <table className="io-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Nama Lengkap</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((v, i) => (
                      <tr key={(v._id as string) ?? i} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td><span className="io-td-user">{v.username}</span></td>
                        <td style={{ fontSize: "14px" }}>{v.information.fullname}</td>
                        <td><span className="io-td-email">{v.information.email}</span></td>
                        <td><span className="io-badge io-badge-active">Aktif</span></td>
                        <td>
                          <div className="io-td-actions">
                            <button
                              className="io-btn io-btn-ghost io-btn-sm"
                              onClick={() => { setIndexData(dataList.indexOf(v)); openEdit(); }}
                            >
                              <IcoEdit /> Edit
                            </button>
                            <button
                              className="io-btn io-btn-danger io-btn-sm"
                              onClick={() => { setDeleteTgt({ id: v._id as string, name: v.information.fullname }); openDel(); }}
                            >
                              <IcoTrash /> Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── MODAL: TAMBAH ── */}
      <div className="io-overlay" ref={overlayNew} onClick={e => { if (e.target === overlayNew.current) closeNew(); }}>
        <div className="io-modal" onClick={e => e.stopPropagation()}>
          <div className="io-mhead">
            <span className="io-mtitle">Tambah Instruktur Baru</span>
            <button className="io-mclose" onClick={closeNew} aria-label="Tutup"><IcoClose /></button>
          </div>
          <div className="io-mbody">
            <div className="io-field-row">
              <div className="io-field">
                <label className="io-label">Username</label>
                <input className="io-input" type="text" placeholder="cth. joko.widodo"
                  value={newIns.username}
                  onChange={e => setNewIns(p => ({ ...p, username: e.target.value }))}
                  autoComplete="off" />
              </div>
              <div className="io-field">
                <label className="io-label">Password</label>
                <input className="io-input" type="password" placeholder="••••••••"
                  onChange={e => setNewIns(p => ({
                    ...p,
                    password: crypto.createHash("sha256").update(e.target.value).digest("hex"),
                  }))}
                  autoComplete="new-password" />
              </div>
            </div>
            <div className="io-field">
              <label className="io-label">Nama Lengkap</label>
              <input className="io-input" type="text" placeholder="cth. Joko Widodo"
                value={newIns.information.fullname}
                onChange={e => setNewIns(p => ({ ...p, information: { ...p.information, fullname: e.target.value } }))} />
            </div>
            <div className="io-field-row">
              <div className="io-field">
                <label className="io-label">Email</label>
                <input className="io-input" type="email" placeholder="email@sekolah.id"
                  value={newIns.information.email}
                  onChange={e => setNewIns(p => ({ ...p, information: { ...p.information, email: e.target.value } }))} />
              </div>
              <div className="io-field">
                <label className="io-label">No. Telepon</label>
                <input className="io-input" type="text" placeholder="08xx-xxxx-xxxx"
                  value={newIns.information.phone}
                  onChange={e => setNewIns(p => ({ ...p, information: { ...p.information, phone: e.target.value } }))} />
              </div>
            </div>
          </div>
          <div className="io-mfoot">
            <button className="io-btn io-btn-ghost" onClick={closeNew}>Batal</button>
            <button className="io-btn io-btn-primary" onClick={saveNew} disabled={process}>
              {process ? <><span className="io-spin" /> Menyimpan…</> : <><IcoCheck /> Simpan</>}
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL: EDIT ── */}
      <div className="io-overlay" ref={overlayEdit} onClick={e => { if (e.target === overlayEdit.current) closeEdit(); }}>
        <div className="io-modal" onClick={e => e.stopPropagation()}>
          <div className="io-mhead">
            <span className="io-mtitle">Detail Instruktur</span>
            <button className="io-mclose" onClick={closeEdit} aria-label="Tutup"><IcoClose /></button>
          </div>
          <div className="io-mbody">
            <div className="io-field-row">
              <div className="io-field">
                <label className="io-label">Username</label>
                <input className="io-input" type="text"
                  value={dataList[indexData]?.username ?? ""}
                  onChange={e => {
                    const next = [...dataList];
                    next[indexData] = { ...next[indexData], username: e.target.value };
                    setDataList(next);
                  }}
                  autoComplete="off" />
              </div>
              <div className="io-field">
                <label className="io-label">Password Baru</label>
                <input className="io-input" type="password" placeholder="Kosongkan jika tidak diubah"
                  onChange={e => {
                    if (!e.target.value) return;
                    const next = [...dataList];
                    next[indexData] = {
                      ...next[indexData],
                      password: crypto.createHash("sha256").update(e.target.value).digest("hex"),
                    };
                    setDataList(next);
                  }}
                  autoComplete="new-password" />
              </div>
            </div>
            <div className="io-field">
              <label className="io-label">Nama Lengkap</label>
              <input className="io-input" type="text"
                value={dataList[indexData]?.information.fullname ?? ""}
                onChange={e => {
                  const next = [...dataList];
                  next[indexData] = { ...next[indexData], information: { ...next[indexData].information, fullname: e.target.value } };
                  setDataList(next);
                }} />
            </div>
            <div className="io-field-row">
              <div className="io-field">
                <label className="io-label">Email</label>
                <input className="io-input" type="email"
                  value={dataList[indexData]?.information.email ?? ""}
                  onChange={e => {
                    const next = [...dataList];
                    next[indexData] = { ...next[indexData], information: { ...next[indexData].information, email: e.target.value } };
                    setDataList(next);
                  }} />
              </div>
              <div className="io-field">
                <label className="io-label">No. Telepon</label>
                <input className="io-input" type="text"
                  value={dataList[indexData]?.information.phone ?? ""}
                  onChange={e => {
                    const next = [...dataList];
                    next[indexData] = { ...next[indexData], information: { ...next[indexData].information, phone: e.target.value } };
                    setDataList(next);
                  }} />
              </div>
            </div>
          </div>
          <div className="io-mfoot">
            <button className="io-btn io-btn-ghost" onClick={closeEdit}>Batal</button>
            <button className="io-btn io-btn-primary" onClick={saveEdit} disabled={process}>
              {process ? <><span className="io-spin" /> Menyimpan…</> : <><IcoEdit /> Simpan Perubahan</>}
            </button>
          </div>
        </div>
      </div>

      {/* ── CONFIRM DELETE ── */}
      <div className="io-overlay" ref={overlayDel} onClick={e => { if (e.target === overlayDel.current) closeDel(); }}>
        <div className="io-confirm-box" onClick={e => e.stopPropagation()}>
          <div className="io-confirm-icon"><IcoTrash /></div>
          <p className="io-confirm-title">Hapus instruktur?</p>
          <p className="io-confirm-msg">
            Instruktur <strong>{deleteTgt?.name}</strong> akan dihapus permanen.
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <button className="io-btn io-btn-ghost io-btn-sm" onClick={closeDel}>Batal</button>
            <button className="io-btn io-btn-danger io-btn-sm" onClick={doDelete}>
              <IcoTrash /> Hapus
            </button>
          </div>
        </div>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div className={`io-toast ${toast ? "io-toast-show" : "io-toast-hide"}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={toast.ok ? "oklch(68% 0.14 165)" : "oklch(68% 0.19 27)"}
            strokeWidth="2.2" strokeLinecap="round">
            {toast.ok
              ? <polyline points="20 6 9 17 4 12" />
              : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}
          </svg>
          {toast.msg}
        </div>
      )}
    </>
  );
}