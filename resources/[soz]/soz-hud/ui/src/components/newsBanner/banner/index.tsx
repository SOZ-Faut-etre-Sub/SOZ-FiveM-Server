import {News} from "../../../types/news";
import {FunctionComponent, PropsWithChildren, useEffect, useState} from "react";
import cn from "classnames";
import styles from "./styles.module.css";

const Banner: FunctionComponent<PropsWithChildren<any>> = ({ index, news, onDelete }: {index: number, news: News, onDelete: any}) => {
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
        const timeoutId = setTimeout(() => setIsClosing(true), 15000);

        return () => clearTimeout(timeoutId)
    }, []);

    const newsTitle = (type: string) => {
        if (type.includes('reboot')) {
            return ''
        }

        if (/(lspd|bcso)/.test(type)) {
            return 'Avis de recherche';
        } else if (type === 'fbi') {
            return 'Annonce';
        } else {
            return type;
        }
    }

    return (
        <div className={cn(styles.news, styles[news.type], {
            [styles.slideOut]: isClosing,
            [styles.slideIn]: !isClosing,
        })} style={{
            transform: `translateX(${index*0.5}rem) translateY(-${index*0.5}rem)`,
            opacity: `calc(1.0 - ${index*0.3})`,
        }}>
            <h3 className={styles.header}>{newsTitle(news.type)}</h3>
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
                    <>
                        {!news.type.includes('reboot') && (
                            <div className={styles.text}>
                                <p>{news.message}</p>
                                <p className={styles.reporter}>
                                    Reporter: <strong>{news.reporter}</strong>
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Banner
