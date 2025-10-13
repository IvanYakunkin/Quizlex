"use client"

import { useState } from "react";
import styles from "../page.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
        const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim();

        if(validateForm(email, password)){
            const response = await signIn('credentials', {email, password, redirect: false});

            if(response){
                if(response.error){
                    setError("Incorrect email or password!");
                }else{
                    router.push("/modules");
                }
            }
        }
    }

    const validateForm = (email: string, password: string) => {
        if(!email || !password){
            setError("Fill the fields!");

            return false;
        }

        return true;
    }

    return (
        <main>
            <div className={styles.auth}>
                <div className={styles.title}>Sign In</div>
                <div className={styles.form}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.fields}>
                            <div className={styles.field}>
                                <label className={styles.label}>Email:</label>
                                <input type="email" name="email" required className={styles.input} placeholder='Enter your email address'/>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Password:</label>
                                <input type="password" name="password" required className={styles.input} placeholder='Enter your password'/>
                            </div>
                        </div>
                        <div className={error ? `${styles.error} ${styles.visible}` : `${styles.error}`}>
                            {error}
                        </div>
                        <button type="submit" className={styles.submit}>Sign In</button>
                        <div className={styles.navigation}>
                            <Link href={"/auth/register"} >Don&apos;t have an account?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Login;