import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Spinner } from "@/components/UI/Spinner/Spinner";
import { AuthSwitcher } from "@/components/UI/AuthSwitcher/AuthSwitcher";

interface LoginFormProps {
    selectedMethod: "login" | "signUp";
    setSelectedMethod: Dispatch<SetStateAction<"login" | "signUp">>;
    closeWindow: () => void;
}

const LoginForm = ({ selectedMethod, setSelectedMethod, closeWindow }: LoginFormProps) => {
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [error, setError] = useState("");

    const focusInput = (inputRef: RefObject<HTMLInputElement | null>) => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitLoading(true);
        const form = event.currentTarget;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
        const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim();

        const response = await signIn('credentials', { email, password, redirect: false });

        if (response) {
            if (response.error) {
                if (response.error === "Invalid credentials") {
                    setError("Email/password combination incorrect. Let's try that again.");
                } else {
                    setError("Server error. Try again later.");
                }
            } else {
                closeWindow();
                router.push("/modules");
            }
        }

        setSubmitLoading(false);
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <AuthSwitcher selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />

            <div className={styles.formBlock} onClick={() => focusInput(emailRef)}>
                <div className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="#7D7D7D"></path></svg>
                </div>
                <div className={styles.field}>
                    <label>
                        Email Address
                    </label>
                    <input type="email" name="email" ref={emailRef} placeholder="Enter valid email address" required />
                </div>
            </div>
            <div className={styles.formBlock} onClick={() => focusInput(passwordRef)}>
                <div className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17ZM18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM8.9 6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8H8.9V6ZM18 20H6V10H18V20Z" fill="#7D7D7D"></path></svg>
                </div>
                <div className={styles.field}>
                    <label>
                        Enter Password
                    </label>
                    <input type="password" name="password" ref={passwordRef} placeholder="Enter your password" required />
                </div>
            </div>
            {error !== "" &&
                <div className={styles.error} data-testid="auth-error">{error}</div>
            }
            <button type="submit" className={styles.button} disabled={submitLoading}>
                {submitLoading ?
                    <Spinner />
                    : "Login"}
            </button>
        </form>
    );
}

export default LoginForm;