"use client"

import { UserData } from "@/context/UserData"
import { ClassroomList } from "@/context/ClassroomList"
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

const IcoHome = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const IcoClass = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)

const IcoPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

export default function Navbar() {
  const userData   = useContext(UserData)
  const classrooms = useContext(ClassroomList)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dropOpen,   setDropOpen]   = useState(false)

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

        <a href="/dashboard/instructor" className="io-navbar-logo">
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
          <a
            href="/dashboard/instructor"
            className="io-drawer-link"
            onClick={() => setDrawerOpen(false)}
          >
            <span className="io-drawer-link-icon"><IcoHome /></span>
            Home
          </a>

          {classrooms.map((v) => (
            <a
              key={v._id}
              href={`/dashboard/instructor/class/${v._id}`}
              className="io-drawer-link"
              onClick={() => setDrawerOpen(false)}
            >
              <span className="io-drawer-link-icon"><IcoClass /></span>
              {v.name}
            </a>
          ))}

          <a
            href="/dashboard/instructor/class/add"
            className="io-drawer-link"
            onClick={() => setDrawerOpen(false)}
          >
            <span className="io-drawer-link-icon"><IcoPlus /></span>
            Add Classroom
          </a>
        </nav>
      </aside>
    </>
  )
}