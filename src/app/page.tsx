import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Introduce() {

    return (
        <main className={styles.main} data-testid="main-page">
            <div className={styles.introduce}>
                <div className={styles.introduce__preview}>
                    <div className={styles.introduce__previewInfo}>
                        <div><b>Quizlex</b> - free app for learning foreign words through flashcards.</div>
                        <div className={styles.introduce__additionalInfo}>
                            <div>You can <b>import</b> words from <b>Quizlet</b> </div>
                            <div>or another app and learn them with Quizlex absolutely free.</div>
                            <div className={styles.introduce__smallPreviewText}><small>Without registration</small></div>
                        </div>
                        <Link href="/import" className={styles.introduce__previewButton}>
                            GET STARTED
                        </Link>
                    </div>
                </div>
                <div className={styles.introduce__features}>
                    <div className={styles.introduce__title}>With Quizlzex you can:</div>
                    <div className={styles.introduce__featuresElements}>
                        <div className={styles.introduce__feature}>
                            <Image src="/images/create-cards.png" width={146} height={120} alt="Create Cards" className={styles.introduce__featureImage} />
                            <div className={styles.introduce__featureLabel}>Create your own modules</div>
                        </div>
                        <div className={styles.introduce__feature}>
                            <Image src="/images/import.png" width={146} height={120} alt="Import" className={styles.introduce__featureImage} />
                            <div className={styles.introduce__featureLabel}>Import words from any other application</div>
                        </div>
                        <div className={styles.introduce__feature}>
                            <Image src="/images/open-book.png" width={146} height={120} alt="Study" className={styles.introduce__featureImage} />
                            <div className={styles.introduce__featureLabel}>Study words without registration</div>
                        </div>
                        <div className={styles.introduce__feature}>
                            <Image src="/images/prize.png" width={146} height={120} alt="Free" className={styles.introduce__featureImage} />
                            <div className={styles.introduce__featureLabel}>Everything is completely FREE</div>
                        </div>
                    </div>
                </div>

                {/* <div className={styles.inroduce__import}>
                    <div className={styles.introduce__title}>Advanced module import</div>
                    <div className={styles.introduce__importElements}>
                        <Image src="/images/importModule.png" width={800} height={800} alt="Test" className={styles.introduce__importImage} />
                    </div>
                </div>
                
                <div className={styles.introduce__learning}>
                    <div className={styles.introduce__title}>Several learning methods are available</div>
                    <div className={styles.introduce__learningElements}>
                        <Image src="/images/test.png" alt="Test" width={500} height={500} className={styles.introduce__learningImage} />
                        <Image src="/images/test.png" alt="Test" width={500} height={500} className={styles.introduce__learningImage} />
                        <Image src="/images/test.png" alt="Test" width={500} height={500} className={styles.introduce__learningImage} />
                    </div>
                </div>

                <div className={styles.inroduce__import}>
                    <div className={styles.introduce__title}>Create your own modules</div>
                    <div className={styles.introduce__importElements}>
                        <Image src="/images/createModule.png" width={800} height={800} alt="Test" className={styles.introduce__importImage} />
                    </div>
                </div> */}
            </div>
        </main>
    );
}
