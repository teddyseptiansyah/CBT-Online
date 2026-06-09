/* Hallmark · macrostructure: Workbench · genre: modern-minimal
 * tone: institutional-austere · anchor hue: oklch(28% 0.14 258) navy
 * CSS → globals.css (semua class io-* ada di sana)
 */
import { UserData } from "@/context/UserData"
import { useContext, useState } from "react"

const IcoMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="4" y1="18" x2="20" y2="18"/>
  </svg>
)

const IcoClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const IcoDots = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="5" cy="12" r="1" fill="currentColor"/>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
    <circle cx="19" cy="12" r="1" fill="currentColor"/>
  </svg>
)

const IcoAdmin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const IcoInstructor = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const IcoUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const NAV_LINKS = [
  { label: "Admin",      href: "/dashboard/admin/admin",      icon: <IcoAdmin /> },
  { label: "Instruktur", href: "/dashboard/admin/instructor", icon: <IcoInstructor /> },
  { label: "User",       href: "/dashboard/admin/user",       icon: <IcoUser /> },
]

export default function Navbar() {
  const userData    = useContext(UserData)
  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const [dropOpen,    setDropOpen]    = useState(false)

  return (
    <>
      {/* ── Top bar ── */}
      <header className="io-navbar">
        <button
          className="io-navbar-icon-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label="Buka menu"
        >
          <IcoMenu />
        </button>

        <a href="/dashboard/admin" className="io-navbar-logo">
          <span className="io-navbar-wordmark">OPSCBT</span>
        </a>

        <div style={{ position: "relative" }}>
          <button
            className="io-navbar-icon-btn"
            onClick={() => setDropOpen(p => !p)}
            aria-label="Menu pengguna"
          >
            <IcoDots />
          </button>

          {dropOpen && (
            <>
              {/* backdrop */}
              <div
                style={{ position: "fixed", inset: 0, zIndex: 49 }}
                onClick={() => setDropOpen(false)}
              />
              <div className="io-dropdown">
                <p className="io-dropdown-name">
                  {userData?.information.fullname || userData?.username}
                </p>
                <div className="io-dropdown-divider" />
                <a className="io-dropdown-item" href="#">Profil</a>
                <a className="io-dropdown-item io-dropdown-item-danger" href="/dashboard/logout">Logout</a>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── Drawer overlay ── */}
      {drawerOpen && (
        <div
          className="io-drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Drawer ── */}
      <aside className={`io-drawer${drawerOpen ? " io-drawer-open" : ""}`}>
        <div className="io-drawer-head">
          <span className="io-navbar-wordmark">OPSCBT</span>
          <button
            className="io-navbar-icon-btn"
            onClick={() => setDrawerOpen(false)}
            aria-label="Tutup menu"
          >
            <IcoClose />
          </button>
        </div>

        <p className="io-drawer-section-label">Menu</p>

        <nav className="io-drawer-nav">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className="io-drawer-link" onClick={() => setDrawerOpen(false)}>
              <span className="io-drawer-link-icon">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  )
}