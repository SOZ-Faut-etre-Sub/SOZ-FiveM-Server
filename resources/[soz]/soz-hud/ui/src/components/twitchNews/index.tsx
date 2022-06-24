import React, {useCallback, useEffect, useState} from "react";
import logo from '../../assets/twitch-news/logo.png';
import styles from "./styles.module.css";

const TwitchNewsOverlay = () => {
    const [display, setDisplay] = useState<boolean>(false);

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === 'set_twitch_news_overlay') {
            setDisplay(event.data.state);
        }
    }, [setDisplay])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)
        return () => window.removeEventListener('message', onMessageReceived)
    }, []);

    if (!display) return null;

    return (
        <div className={styles.container}>
            <img src={logo} alt="TN logo"/>
        </div>
    )
}

export default TwitchNewsOverlay
