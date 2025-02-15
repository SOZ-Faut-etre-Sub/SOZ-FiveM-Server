import { useSetAlerts } from '../alerts.atom';

export const useAlert = () => {
    const setAlerts = useSetAlerts();

    const sendAlert = (title: string, content: string, callback: () => void) => {
        setAlerts({
            title,
            content,
            onSubmit: () => {
                callback();
                setAlerts(null);
            },
            onClose: () => setAlerts(null),
        });
    };

    return { sendAlert };
};
