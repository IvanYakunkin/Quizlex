import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { findUserModules } from "@/services/moduleService";
import { findUserIdByEmail } from "@/services/userService";
import Modules from "./components/Modules";

const Page = async () => {
    const session = await getServerSession();

    if(!session || !session.user?.email){
        return null;
    }
    
    const userId = await findUserIdByEmail(session.user.email);
    if(!userId){
        return null;
    }

    const userModules = await findUserModules(userId);
        
    return (
        <main className="main">
            <div className={styles.modules}>
                <div className={styles.title}>Your Modules</div>
                <Modules modules={userModules} />
            </div>
        </main>
    );
}

export default Page;