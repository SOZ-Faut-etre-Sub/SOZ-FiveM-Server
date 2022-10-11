import { Transition } from '@headlessui/react';
import { useApps } from '@os/apps/hooks/useApps';
import { AppContent } from '@ui/components/AppContent';
import cn from 'classnames';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useConfig } from '../../hooks/usePhone';
import { usePhoneSocietyNumber } from '../../hooks/useSimCard';
import { useNotifications } from '../../os/notifications/hooks/useNotifications';
import { Grid } from '../../ui/components/Grid';
import { FullPageWithHeader } from '../../ui/layout/FullPageWithHeader';
import { AppIcon } from './components/AppIcon';

export const HomeApp: FunctionComponent = () => {
    const { apps } = useApps();
    const config = useConfig();
    const [t] = useTranslation();
    const societyNumber = usePhoneSocietyNumber();
    const { countAppNotification } = useNotifications();

    const filteredApps =
        societyNumber === null
            ? apps.filter(app => app.home !== true && app.id !== 'society-messages')
            : apps.filter(app => app.home !== true);
    const homeApps = apps.filter(app => app.home === true);

    return (
        <FullPageWithHeader>
            <Transition
                appear={true}
                show={true}
                enter="transition-transform duration-500"
                enterFrom="scale-[3.0]"
                enterTo="scale-100"
            >
                <AppContent scrollable={false}>
                    <Grid styleRules={{ margin: '1rem 0 3rem 0' }}>
                        {filteredApps.map(app => (
                            <Link key={app.id} to={app.path}>
                                <AppIcon
                                    title={t(app.nameLocale)}
                                    icon={app.icon}
                                    badge={countAppNotification(app.id)}
                                />
                            </Link>
                        ))}
                    </Grid>
                    <Grid
                        rows={1}
                        className={cn('bg-opacity-25 rounded-[20px] p-1.5', {
                            'bg-black': config.theme.value === 'dark',
                            'bg-ios-50': config.theme.value === 'light',
                        })}
                    >
                        {homeApps.map(app => (
                            <Link key={app.id} to={app.path}>
                                <AppIcon
                                    title={t(app.nameLocale)}
                                    icon={app.icon}
                                    badge={countAppNotification(app.id)}
                                />
                            </Link>
                        ))}
                    </Grid>
                </AppContent>
            </Transition>
        </FullPageWithHeader>
    );
};
