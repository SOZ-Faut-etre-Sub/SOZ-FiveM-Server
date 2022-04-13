import {News} from "../../../types/news";
import {FunctionComponent, PropsWithChildren, useEffect, useState} from "react";
import styles from "./styles.module.css";

const Banner: FunctionComponent<PropsWithChildren<any>> = ({ news, onDelete }: {news: News, onDelete: any}) => {
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
            <h3 className={styles.header}>
                {/(lspd|bcso)/.test(news.type) ? 'Avis de recherche' : news.type}
            </h3>
            <div className={styles.content}>
                {/(lspd|bcso)/.test(news.type) ? (
                    <p className={styles.text}>
                        <p>
                            Les forces de l'ordre sont à la recherche de <strong>{news.message}</strong>.
                        </p>

                        <p>
                            Si vous avez des informations sur cette personne,
                            veuillez les communiquer au <strong style={{textTransform: 'uppercase'}}>555-{news.type}</strong>.
                        </p>
                    </p>
                ) : (
                    <div className={styles.text}>
                        <p>{news.message}</p>
                        <p className={styles.reporter}>
                            Reporter: <strong>{news.reporter}</strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Banner
