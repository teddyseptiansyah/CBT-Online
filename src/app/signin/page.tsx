/* Hallmark · macrostructure: Asymmetric Typographic · genre: modern-minimal
 * tone: institutional-austere · anchor hue: oklch(28% 0.14 258) navy
 * pre-emit critique: P5 H5 E5 S4 R5 V5
 */
"use client"
import Splash from "@/components/splash";
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [process, setProcess] = useState(false);
    const [load, setLoad] = useState(true);
    const [fail, setFail] = useState(false);
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        fetch("/api/auth", {
            method: "post",
            body: JSON.stringify({ method: "AUTHENTICATION" })
        }).then(r => r.json()).then(json => {
            if (json.status === "OK") {
                document.location.href = "/dashboard/"
            } else {
                setTimeout(() => setLoad(false), 800)
            }
        })
    }, [])

    function submit(ev: FormEvent) {
        ev.preventDefault()
        setProcess(true)
        setFail(false)
        fetch("/api/auth", {
            method: "post",
            body: JSON.stringify({ method: "SIGN_IN", data: { username, password } })
        }).then(r => {
            setProcess(false)
            return r.json()
        }).then(r => {
            if (r.status === "FAIL") setFail(true)
            else document.location.href = "/dashboard/"
        })
    }

    return (
        <>
            <Splash isLoad={load} />

            <div className={`lo${load ? " hidden" : ""}`}>

                {/* Left panel */}
                <div className="lo-l" aria-hidden="true">
                    <div className="lo-l-mark">
                        <a href="/" className="lo-brand">OPSCBT</a>
                    </div>
                    <div className="lo-l-body">
                        <span className="lo-eyebrow">Platform CBT Open Source</span>
                        <h1 className="lo-headline">
                            Ujian online<br />
                            <strong>yang lebih mudah.</strong>
                        </h1>
                        <p className="lo-desc">
                            Dirancang untuk sekolah dan institusi.
                            Gratis selamanya, tanpa biaya lisensi.
                        </p>
                    </div>
                    <div className="lo-l-foot">
                        <span className="lo-l-foot-line" />
                        <span className="lo-l-foot-text">Open Source · Free Forever</span>
                        <span className="lo-l-foot-line" />
                    </div>
                </div>

                {/* Right form panel */}
                <div className="lo-r">
                    <div className="lo-form-wrap">
                        <a href="/" className="lo-mob-brand">OPSCBT</a>

                        <a href="/" className="lo-back">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                            Kembali ke beranda
                        </a>

                        <h2 className="lo-title">Masuk</h2>
                        <p className="lo-sub">Masukkan kredensial akun kamu</p>

                        <div className="lo-divider" />

                        <form onSubmit={submit}>
                            <div className="lo-fields">
                                <div className="lo-field">
                                    <label className="lo-label" htmlFor="lo-username">Username</label>
                                    <input
                                        id="lo-username"
                                        value={username}
                                        onChange={(ev: ChangeEvent<HTMLInputElement>) => setUsername(ev.target.value)}
                                        type="text"
                                        placeholder="Masukkan username"
                                        className="lo-input"
                                        autoComplete="username"
                                        required
                                    />
                                </div>
                                <div className="lo-field">
                                    <label className="lo-label" htmlFor="lo-password">Password</label>
                                    <div className="lo-input-wrap">
                                        <input
                                            id="lo-password"
                                            value={password}
                                            onChange={(ev: ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value)}
                                            type={showPass ? "text" : "password"}
                                            placeholder="Masukkan password"
                                            className={`lo-input${!showPass ? " lo-input-pr" : ""}`}
                                            autoComplete="current-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="lo-eye"
                                            onClick={() => setShowPass(p => !p)}
                                            aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
                                        >
                                            {showPass ? (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                                </svg>
                                            ) : (
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {fail && (
                                <div className="lo-error" role="alert">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    Username atau password salah
                                </div>
                            )}

                            <button type="submit" className="lo-btn" disabled={process}>
                                {process ? (
                                    <span className="lo-btn-inner">
                                        <span className="lo-spinner" aria-hidden="true" />
                                        Memproses…
                                    </span>
                                ) : "Masuk"}
                            </button>
                        </form>

                        <p className="lo-note">OPSCBT · Open Source CBT Platform</p>
                    </div>
                </div>

            </div>
        </>
    )
}