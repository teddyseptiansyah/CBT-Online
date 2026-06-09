/* Hallmark · macrostructure: Workbench · genre: modern-minimal
 * tone: institutional-austere · anchor hue: oklch(28% 0.14 258) navy
 * CSS → globals.css (semua class io-* ada di sana)
 */
"use client"
import { useEffect, useState } from "react"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import Navbar from "@/components/AdminNavbar"

const MENU_ITEMS = [
  {
    title: "Admin",
    desc: "Tampilkan, tambah, ubah, dan hapus daftar Admin.",
    href: "/dashboard/admin/admin",
  },
  {
    title: "Instruktur",
    desc: "Tampilkan, tambah, ubah, dan hapus daftar Instruktur.",
    href: "/dashboard/admin/instructor",
  },
  {
    title: "User",
    desc: "Tampilkan, tambah, ubah, dan hapus daftar User Ujian.",
    href: "/dashboard/admin/user",
  },
]

const IcoArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

export default function AdminDashboard() {
  const [userData, setUserData] = useState<Users>()
  const [load,     setLoad]     = useState(true)

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
            setUserData(json.data)
            setLoad(false)
            break
        }
      })
  }, [])

  return (
    <>
      <Splash isLoad={load} />

      <div className={`io-page${load ? " hidden" : ""}`}>
        <UserData.Provider value={userData as Users}>
          <Navbar />
        </UserData.Provider>

        <main className="io-main">

          {/* Page header */}
          <div className="io-ph">
            <div>
              <p className="io-eyebrow">Admin Panel</p>
              <h1 className="io-title">Selamat datang, <strong>{userData?.information?.fullname || userData?.username}</strong></h1>
            </div>
          </div>

          {/* Menu grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {MENU_ITEMS.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="io-menu-card"
                style={{ textDecoration: "none" }}
              >
                <div className="io-menu-card-body">
                  <p className="io-menu-card-title">{item.title}</p>
                  <p className="io-menu-card-desc">{item.desc}</p>
                </div>
                <div className="io-menu-card-arrow">
                  <IcoArrow />
                </div>
              </a>
            ))}
          </div>

        </main>
      </div>
    </>
  )
}