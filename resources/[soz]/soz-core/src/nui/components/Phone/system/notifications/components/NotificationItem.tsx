import { formatMessage } from '../../../apps/messages/utils/format';
import { useContact } from '../../sim-card/hooks/useContact';
import { INotification } from '../notification.types';

export const NotificationItem = (notification: INotification) => {
    const { title, icon: Icon, content, onClick } = notification;

    const contact = useContact(title);

    return (
        <li
            className={`cursor-pointer py-2 px-4 flex items-center gap-4 bg-ios-800 hover:bg-opacity-80 text-white rounded-[20px] text-sm`}
            onClick={() => {
                if (onClick) {
                    onClick(notification);
                }
            }}
        >
            {Icon && <Icon className="text-white size-12 p-1 rounded-xl shrink-0" />}
            <div className="flex flex-col justify-around grow h-full">
                <p className="font-semibold normal-case">{contact?.display ?? title}</p>
                <p className="font-light normal-case">{formatMessage(content)}</p>
            </div>
        </li>
    );
};
