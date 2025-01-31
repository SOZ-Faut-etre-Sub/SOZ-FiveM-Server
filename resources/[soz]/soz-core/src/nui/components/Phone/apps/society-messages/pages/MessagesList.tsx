import { ChatIcon, CheckIcon, MapIcon, XIcon } from '@heroicons/react/outline';
import { fetchNui } from '@public/nui/fetch';
import clsx from 'clsx';
import React, { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { AppContent } from '../../../components/system/AppContent';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useApp } from '../../../system/apps/hooks/useApp';
import { useAppTitleActionsUpdater } from '../../../system/apps/hooks/useAppTitleActionsUpdater';
import { useAppTitleUpdater } from '../../../system/apps/hooks/useAppTitleUpdater';
import { useThemeConfig } from '../../../system/config/config.atom';
import { useNotifications } from '../../../system/notifications/hooks/useNotifications';
import { useSocietySimCard } from '../../../system/sim-card/hooks/useSocietySimCard';
import { MessageItem } from '../components/MessageItem';
import { useSocietyMessages } from '../messages.atom';

export const MessagesList: FunctionComponent<{ filter?: string[]; exclude?: string[] }> = ({ filter, exclude }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const app = useApp('society-messages');

    const theme = useThemeConfig();

    const { societyNumber } = useSocietySimCard();
    const messages = useSocietyMessages();
    const { removeAppNotifications } = useNotifications();

    const deleteWaypoint = async () => fetchNui(NuiEvent.DeleteWaypoint);
    const openContactInfo = async () => navigate(`/society-contacts/${societyNumber}`);

    useAppTitleUpdater(true, t(app.nameLocale));
    useAppTitleActionsUpdater([
        {
            display: true,
            icon: <MapIcon className="size-5" />,
            onClick: deleteWaypoint,
        },
        {
            display: true,
            icon: <ChatIcon className="size-5" />,
            onClick: openContactInfo,
        },
    ]);

    const messagesFiltered = messages.filter(message => {
        if (filter) return filter.includes(message.info?.type);
        if (exclude) return !exclude.includes(message.info?.type);
        return true;
    });

    useEffect(() => {
        removeAppNotifications(app.id);
    }, []);

    return (
        <AppWrapper>
            <AppContent>
                <Virtuoso
                    style={{
                        height: 760,
                    }}
                    className={clsx(
                        'mb-16 scrollbar scrollbar-w-[5px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
                        {
                            'scrollbar-thumb-white/80': theme === 'dark',
                            'scrollbar-thumb-black/20': theme === 'light',
                        }
                    )}
                    totalCount={messagesFiltered.length}
                    data={messagesFiltered}
                    itemContent={(index, data) => <MessageItem key={index} message={data} />}
                    increaseViewportBy={760}
                />
            </AppContent>
        </AppWrapper>
    );
};
