"use client"

import { useState } from "react";
import styles from "../page.module.css";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const Register = () => {

    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const form = event.currentTarget;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
        const login = (form.elements.namedItem('login') as HTMLInputElement).value.trim();
        const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim();
        const passwordConfirm = (form.elements.namedItem('passwordConfirm') as HTMLInputElement).value.trim();
        
        if(validateForm(email, login, password, passwordConfirm)){
             try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({ email, login, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    const signInResponse = await signIn('credentials', {
                        redirect: false,
                        email,
                        password,
                    });

                    if (signInResponse?.error) {
                        setError("Login failed!");
                    } else {
                        router.push("/modules/");
                    }
                } else {
                    setError(data.message || "Registration failed!");
                }
            } catch (error) {
                console.error("Error:", error);
                setError("An error occurred!");
            }
        }
    }

    // Simple validation rules
    const validateForm = (email: string, login: string, password: string, passwordConfirm: string) => {
        if(!email || !login || !password || !passwordConfirm){
            setError("Fill the fields!");

            return false;
        }
        if(password !== passwordConfirm){
            setError("Passwords don't match!");

            return false;
        }
        if(password.length <= 4){
            setError("The password must contain at least 5 characters!")

            return false;
        }

        return true;
    }

    return (
        <main>
            <div className={styles.auth}>
                <div className={styles.title}>Create an account</div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.fields}>
                        <div className={styles.field}>
                            <label className={styles.label}>Email:</label>
                            <input type="email" name="email" required className={styles.input} placeholder='your_address@example.net'/>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Login:</label>
                            <input type="text" name="login" required className={styles.input} placeholder='Custom Name'/>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Password:</label>
                            <input type="password" name="password" required className={styles.input} placeholder='********'/>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Confirm password:</label>
                            <input type="password" name="passwordConfirm" required className={styles.input} placeholder='********'/>
                        </div>
                    </div>
                    <div className={error ? `${styles.error} ${styles.visible}` : `${styles.error}`}>
                        {error}
                    </div>
                    <button type="submit" className={styles.submit}>Create</button>
                    <div className={styles.navigation}>
                        <Link href={"/auth/login"} >Already have an account?</Link>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default Register;