"use client"
import Link from "next/link";
import { useState } from "react";
import Navbar from "./Navbar";
import styles from "./Header.module.css";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginWin from "../popups/Login/LoginWin";

export default function Header() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginPopup, setIsLoginPopup] = useState(false);
    const { status } = useSession();

    const logout = async () => {
        await signOut({ redirect: false });
        router.push("/");
    }

    const showLoginForm = () => {
        setIsLoginPopup(true);
    }

    return (
        <header className={styles.header}>
            <div className={styles.content}>
                <div className={styles.logo}><Link href="/">Quizlex</Link></div>

                <div className={styles.elements}>
                    <Link href="/import" className={styles.buttonElement}>
                        <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 12V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4m5-13v4a1 1 0 0 1-1 1H5m0 6h9m0 0-2-2m2 2-2 2" />
                        </svg>
                        <span>Import your words</span>
                    </Link>
                    {status === "authenticated" &&
                        <Link href="/modules" className={styles.buttonElement}>
                            <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778" />
                            </svg>
                            <span>View Modules</span>
                        </Link>
                    }
                    {status !== "authenticated" && <Link href="/module" className={styles.buttonElement}>
                        <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778" />
                        </svg>
                        <span>View module</span>
                    </Link>
                    }
                </div>

                {status === "authenticated" ? (

                    <div className={styles.auth}>
                        <div className={styles.authElement} data-testid="logout-button" onClick={logout}>
                            <div>
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                                </svg>

                                <span>Logout</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.auth}>
                        <div className={styles.authElement} onClick={showLoginForm} data-testid="auth-login-button">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                    <path d="M21 12h-13l3 -3" />
                                    <path d="M11 15l-3 -3" />
                                </svg>

                                <span className={styles.normalText}>Log In</span><span className={styles.responsiveText}>Log in</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.navbarButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
                    </svg>
                </div>
            </div>

            <Navbar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                isAuthenticated={status === "authenticated"} showLoginForm={showLoginForm}
            />

            <LoginWin isOpen={isLoginPopup} onClose={() => setIsLoginPopup(false)} />

        </header>
    );
}