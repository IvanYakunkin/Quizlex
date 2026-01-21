import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getUserModulesAction } from "@/services/moduleActions";
import { Modules } from "./components/Modules";

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
        notFound();
    }

    const userModules = await getUserModulesAction();

    return (
        <main className="main">
            <div className={styles.modules}>
                <div className={styles.title} data-testid="modules-title">Your Modules</div>
                <Modules modules={userModules.data || []} />
            </div>
        </main>
    );
}