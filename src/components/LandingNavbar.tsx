"use client";
import { useState, useEffect } from "react";
import styles from "./LandingNavbar.module.css";

const navLinks = [
    { label: "About", href: "#about" },
    { label: "Docs", href: "#docs" },
    { label: "Changelog", href: "#changelog" },
];

export default function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function scrollTo(href: string) {
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setMenuOpen(false);
    }

    return (
        <>
            <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
                <div className={styles.inner}>
                    <a href="/" className={styles.logo}>
                        <img src="/img/HeaderLogo.svg" alt="OPSCBT" />
                    </a>
                    <ul className={styles.links}>
                        {navLinks.map((l) => (
                            <li key={l.label}>
                                <a href={l.href} onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}>
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.actions}>
                        <a href="/signin" className={styles.btnPrimary}>
                            Sign In
                        </a>
                        <button
                            className={`${styles.burger} ${menuOpen ? styles.open : ""}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menu"
                        >
                            <span /><span /><span />
                        </button>
                    </div>
                </div>
            </nav>
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    {navLinks.map((l) => (
                        <a key={l.label} href={l.href} onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}>
                            {l.label}
                        </a>
                    ))}
                    <div className={styles.sep} />
                    <a href="/signin" className={styles.btnPrimary} onClick={() => setMenuOpen(false)}>Sign In</a>
                </div>
            )}
        </>
    );
}