import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { findUserModules } from "@/services/moduleService";
import Modules from "./components/Modules";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";

const Page = async () => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.id) {
        notFound();
    }

    const userModules = await findUserModules(+session.user.id);

    return (
        <main className="main">
            <div className={styles.modules}>
                <div className={styles.title} data-testid="modules-title">Your Modules</div>
                <Modules modules={userModules} />
            </div>
        </main>
    );
}

export default Page;