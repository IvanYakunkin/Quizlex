import Link from "next/link";
import styles from "./Header.module.css"
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NavbarProps {
    isOpen: boolean;
    isAuthenticated: boolean;
    showLoginForm: () => void;
    onClose: () => void;
}

const Navbar = ({ isOpen, isAuthenticated, showLoginForm, onClose }: NavbarProps) => {
    const router = useRouter();
    const logout = async () => {
        await signOut({ redirect: false });
        router.push("/");
        onClose();
    }

    const loginBtnClick = () => {
        onClose();
        showLoginForm();
    }

    return (
        <nav className={isOpen ? `${styles.navbar} ${styles.active}` : styles.navbar}>
            <ul>
                <li>
                    <Link href="/import" className={styles.navbarElement} onClick={onClose}>
                        <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4m5-13v4a1 1 0 0 1-1 1H5m0 6h9m0 0-2-2m2 2-2 2" />
                        </svg>
                        <span>Import your words</span>
                    </Link>
                </li>
                {isAuthenticated ? (
                    <li>
                        <Link href="/modules" className={styles.navbarElement} onClick={onClose}>
                            <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778" />
                            </svg>
                            <span>View modules</span>
                        </Link>

                    </li>)
                    : (
                        <Link href="/module" className={styles.navbarElement} onClick={onClose}>
                            <svg aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778" />
                            </svg>
                            <span>View module</span>
                        </Link>
                    )}
                {!isAuthenticated &&
                    <li>
                        <div className={styles.navbarElement} onClick={loginBtnClick}>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                            </svg>

                            <span className={styles.normalText}>Have an account?</span><span className={styles.responsiveText}>Log in</span>
                        </div>
                    </li>
                }

                {isAuthenticated &&
                    <li>
                        <div className={styles.navbarElement} onClick={logout}>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                            </svg>
                            <span>Logout</span>
                        </div>
                    </li>
                }
            </ul>
        </nav>
    )
}

export default Navbar;