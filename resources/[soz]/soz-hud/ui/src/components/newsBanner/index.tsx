import React, {useCallback, useEffect, useState} from "react";
import styles from "./styles.module.css";
import {News} from "../../types/news";
import {uuidv4} from "../../utils/uuid";
import Banner from "./banner";

const NewsBanner = () => {
    const [news, setNews] = useState<News[]>([]);

    const deleteNews = useCallback((id: string) => {
        setNews(s => s.filter((n) => n.id !== id));
    }, [setNews])

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === 'draw_news_banner') {
            setNews(n => [{id: uuidv4(), type: event.data.type, image: event.data.image, message: event.data.message, reporter: event.data.reporter}, ...n])
        }
    }, [setNews])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)

        return () => window.removeEventListener('message', onMessageReceived)
    }, []);

    return (
        <div className={styles.container}>
            {news.map(n => (
                <Banner key={n.id} news={n} onDelete={() => deleteNews(n.id)} />
            ))}
        </div>
    )
}

export default NewsBanner
