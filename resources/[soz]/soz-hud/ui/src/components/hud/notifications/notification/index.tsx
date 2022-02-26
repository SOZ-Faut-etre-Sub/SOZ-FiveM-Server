import {ComponentProps, createRef, FunctionalComponent} from "preact";
import {useEffect, useState} from "preact/hooks";
import style from './styles.module.css'
import {formatText} from "../../../../utils/string";
import {AdvancedNotification, BasicNotification} from "../../../../types/notification";

const Notification: FunctionalComponent<ComponentProps<any>> = ({ notification, onDelete }: {notification: BasicNotification|AdvancedNotification, onDelete: any}) => {
    const [isClosing, setIsClosing] = useState(false);
    const progressRef = createRef()

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
        progressRef.current.style.transitionDuration = `${notification.delay || 10000}ms`
        progressRef.current.style.width = 0

        return () => clearTimeout(timeoutId)
    }, []);

    function isAdvancedNotification(notification: BasicNotification|AdvancedNotification): notification is AdvancedNotification {
        return (notification as AdvancedNotification).title !== undefined;
    }

    return (
        <div class={`${style.notification} ${isClosing ? style.slideOut : style.slideIn}`}>
            {isAdvancedNotification(notification) && (
                <div class={style.header}>
                    <img src={`https://nui-img/${notification.image}/${notification.image}`}/>
                    <div class={style.header_text}>
                        <p dangerouslySetInnerHTML={{__html: formatText(notification.title)}} />
                        <p dangerouslySetInnerHTML={{__html: formatText(notification.subtitle)}} />
                    </div>
                </div>
            )}
            <p class={style.text} dangerouslySetInnerHTML={{__html: formatText(notification.message)}} />
            <div class={style.progressbar}>
                <div ref={progressRef} class={style.progress} />
            </div>
        </div>
    )
}

export default Notification
