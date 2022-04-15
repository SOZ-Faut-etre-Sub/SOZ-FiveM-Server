import {FunctionComponent, PropsWithChildren, useEffect, useState} from "react";
import style from './styles.module.css'
import {formatText} from "../../../../utils/string";
import {AdvancedNotification, BasicNotification} from "../../../../types/notification";
import cn from "classnames";

const Notification: FunctionComponent<{notification: BasicNotification|AdvancedNotification, onDelete: any}> = ({ notification, onDelete }) => {
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
        const timeoutId = setTimeout(() => setIsClosing(true), notification.delay || 10000);

        return () => clearTimeout(timeoutId)
    }, []);

    function isAdvancedNotification(notification: BasicNotification|AdvancedNotification): notification is AdvancedNotification {
        return (notification as AdvancedNotification).title !== undefined;
    }

    return (
        <div className={cn(style.notification, {
            // @ts-ignore
            [style[notification.style]]: notification.style !== undefined && style[notification.style] !== undefined,
            [style.slideOut]: isClosing,
            [style.slideIn]: !isClosing
        })}>
            {isAdvancedNotification(notification) && (
                <div className={style.header}>
                    <img src={notification.image.startsWith("http") ? notification.image : `https://nui-img/${notification.image}/${notification.image}`}/>
                    <div className={style.header_text}>
                        <p dangerouslySetInnerHTML={{__html: formatText(notification.title)}} />
                        <p dangerouslySetInnerHTML={{__html: formatText(notification.subtitle)}} />
                    </div>
                </div>
            )}
            <p className={style.text} dangerouslySetInnerHTML={{__html: formatText(notification.message)}} />
        </div>
    )
}

export default Notification
