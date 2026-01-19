import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./Module.module.css";

export const LearningTypes = () => {
    const { id } = useParams();

    return (
        <div className={styles.learningTypes}>
            <Link href={id ? `/learn/module/${id}/cards` : "/learn/cards"} className={styles.learningBtn}> <Image src="/images/file.png" width={50} height={50} alt="Cards" />Cards</Link>
            <Link href={id ? `/learn/module/${id}/test` : "/learn/test"} className={styles.learningBtn}> <Image src="/images/file.png" width={50} height={50} alt="Test" />Test</Link>
            <Link href={id ? `/learn/module/${id}/writing` : "/learn/writing"} className={styles.learningBtn}><Image src="/images/edit.png" width={50} height={50} alt="Writing" />Writing</Link>
            <Link href={"#"} className={styles.learningBtn}><Image src="/images/choose.png" width={50} height={50} alt="Match" />Match</Link>
        </div>
    );
}