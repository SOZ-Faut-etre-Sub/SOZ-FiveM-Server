import React, { PropsWithChildren } from 'react';

interface NotificationProps {
    open: boolean;
    handleClose: () => void;
}

export const Notification: React.FC<PropsWithChildren<NotificationProps>> = ({ children }) => {
    return (
        <div>
            <div>
                <div>
                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
