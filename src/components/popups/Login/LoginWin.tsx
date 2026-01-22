import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./login.module.css";
import Image from "next/image";
import Switcher from "../../UI/Switcher/Switcher";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Draggable from "react-draggable";
import { Spinner } from "@/components/UI/Spinner/Spinner";

interface LoginWin {
    isOpen: boolean;
    onClose: () => void;
}

const LoginWin = ({ isOpen, onClose }: LoginWin) => {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const [selectedMethod, setSelectedMethod] = useState<"login" | "signUp">("login");
    const [isEmailLogin, setIsEmailLogin] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const closeDialog = useCallback(() => {
        setSelectedMethod("login");
        setIsEmailLogin(false);
        setIsGoogleLoading(false);
        onClose();
    }, [onClose]);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            closeDialog();
        }
    }, [closeDialog]);

    useEffect(() => {
        if (dialogRef.current) {
            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
                dialogRef.current.showModal();

                return () => {
                    document.removeEventListener('mousedown', handleClickOutside);
                };
            } else {
                dialogRef.current.close();
            }
        }
    }, [isOpen, handleClickOutside]);

    useEffect(() => {
        const body = document.body;
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

            body.style.paddingRight = `${scrollBarWidth}px`;
            body.style.overflow = 'hidden';
        } else {
            body.style.paddingRight = '';
            body.style.overflow = '';
        }

        return () => {
            body.style.paddingRight = '';
            body.style.overflow = '';
        };
    }, [isOpen])

    const googleAuth = async () => {
        setIsGoogleLoading(true);
        const authResult = await signIn("google", { redirect: false });
        if (authResult && authResult.ok && authResult.url) {
            router.push("/modules");
        }
        setIsGoogleLoading(false);
    }

    return (
        <Draggable nodeRef={dialogRef} handle=".draggable" cancel=".drag-cancel">
            <dialog ref={dialogRef} className={styles.dialog} data-testid="auth-dialog">
                <div ref={popupRef}>
                    <div className={styles.header + " draggable"}>
                        <div className={styles.close + " drag-cancel"} onClick={closeDialog}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M11.9997 10.586L16.9497 5.63599L18.3637 7.04999L13.4137 12L18.3637 16.95L16.9497 18.364L11.9997 13.414L7.04974 18.364L5.63574 16.95L10.5857 12L5.63574 7.04999L7.04974 5.63599L11.9997 10.586Z" fill="white"></path>
                            </svg>
                        </div>
                    </div>
                    <div className={styles.container}>
                        <div className={styles.title}>{selectedMethod === "login" ? "Login" : "Sign Up"}</div>
                        <div className={styles.description}>
                            Please sign up or login with your details
                        </div>
                        {!isEmailLogin &&
                            <div className={styles.methods}>
                                <Switcher selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
                                <div className={styles.google} onClick={googleAuth}>{!isGoogleLoading && <Image src={"/images/google.png"} width={32} height={32} alt="Google" />}{isGoogleLoading ?
                                    <Spinner />
                                    : "Continue with Google"}</div>
                            </div>
                        }
                        {isEmailLogin && (
                            selectedMethod === "login"
                                ? <LoginForm selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} closeWindow={closeDialog} />
                                : <SignUpForm selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} closeWindow={closeDialog} />)
                        }

                        {isEmailLogin
                            ? <div className={styles.bottomOption} onClick={() => setIsEmailLogin(false)}>Go back</div>
                            : <div className={styles.bottomOption} data-testid="login-with-email" onClick={() => setIsEmailLogin(true)}>{`Or ${selectedMethod === "login" ? "login" : "sign up"} with email`}</div>
                        }
                    </div>
                </div>
            </dialog >
        </Draggable>

    );
}

export default LoginWin;