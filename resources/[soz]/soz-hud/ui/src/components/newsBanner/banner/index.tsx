import {ComponentProps, FunctionalComponent} from "preact";
import {News} from "../../../types/news";
import {useEffect, useState} from "preact/hooks";
import styles from "./styles.module.css";

const Banner: FunctionalComponent<ComponentProps<any>> = ({ news, onDelete }: {news: News, onDelete: any}) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isClosing) {
            const timeoutId = setTimeout(onDelete, 300);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [isClosing, onDelete]);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsClosing(true), 10000);

        return () => clearTimeout(timeoutId)
    }, []);

    return (
        <div className={`${styles.news} ${styles[news.type]} ${isClosing ? styles.slideOut : styles.slideIn}`}>
            <h3 className={styles.header}>{news.type}</h3>
            <p className={styles.text}>{news.message}</p>
        </div>
    );
}

export default Banner
