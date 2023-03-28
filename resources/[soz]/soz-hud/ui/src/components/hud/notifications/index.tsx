import {useCallback, useContext, useEffect, useState} from "react";
import {GameContext} from "../../../context/game";
import style from './styles.module.css'
import Notification from "./notification";
import {uuidv4} from "../../../utils/uuid";
import {AdvancedNotification, BasicNotification} from "../../../types/notification";


const Notifications = () => {
    const {minimap} = useContext(GameContext)
    const [notifications, setNotifications] = useState<(BasicNotification|AdvancedNotification)[]>([]);

    const createBasicNotification = useCallback((message: string, style?: string, delay?: number) => {
        setNotifications(n => [{id: uuidv4(), message, delay, style}, ...n])
    }, [setNotifications])

    const createAdvancedNotification = useCallback((title: string, subtitle: string, message: string, image: string, style?: string, delay?: number) => {
        setNotifications(n => [{id: uuidv4(), title, subtitle, message, image, delay, style}, ...n])
    }, [setNotifications])

    const deleteNotification = useCallback((id: string) => {
        setNotifications(s => s.filter((n) => n.id !== id) );
    }, [setNotifications])

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === 'draw_basic_notification') {
            createBasicNotification(event.data.message, event.data.style, event.data.delay)
        } else if (event.data.action === 'draw_advanced_notification') {
            createAdvancedNotification(event.data.title, event.data.subtitle, event.data.message, event.data.image, event.data.style, event.data.delay)
        }
    }, [createBasicNotification])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)

        return () => window.removeEventListener('message', onMessageReceived)
    }, []);

    return (
        <div className={style.container} style={{
            top: `calc((100vh * ${minimap.topY}) - calc((100vh * ${minimap.height}) * 4) - .5rem )`,
            left: `calc(100vw * ${minimap.leftX})`,
            height: `calc((100vh * ${minimap.height}) * 4)`,
            width: `calc(100vw * ${minimap.width})`,
        }}>
            {notifications.map(notification => (
                <Notification key={notification.id} notification={notification} onDelete={() => deleteNotification(notification.id)} />
            ))}
        </div>
    )
}

export default Notifications
