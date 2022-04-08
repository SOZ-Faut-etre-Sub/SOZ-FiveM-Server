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
        <div class={`${styles.news} ${styles[news.type]} ${isClosing ? styles.slideOut : styles.slideIn}`}>
            <h3 class={styles.header}>
                {/(lspd|bcso)/.test(news.type) ? 'Avis de recherche' : news.type}
            </h3>
            <div class={styles.content}>
                {/(lspd|bcso)/.test(news.type) ? (
                    <p class={styles.text}>
                        <p>
                            Les forces de l'ordre sont à la recherche de <strong>{news.message}</strong>.
                        </p>

                        <p>
                            Si vous avez des informations sur cette personne,
                            veuillez les communiquer au <strong style={{textTransform: 'uppercase'}}>555-{news.type}</strong>.
                        </p>
                    </p>
                ) : (
                    <div class={styles.text}>
                        <p>{news.message}</p>
                        <p class={styles.reporter}>
                            Reporter: <strong>{news.reporter}</strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Banner
