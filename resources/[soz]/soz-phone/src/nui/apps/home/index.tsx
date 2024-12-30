import { Transition } from '@headlessui/react';
import { useApps } from '@os/apps/hooks/useApps';
import { AppContent } from '@ui/components/AppContent';
import cn from 'classnames';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useConfig, useDarkweb } from '../../hooks/usePhone';
import { usePhoneSocietyNumber } from '../../hooks/useSimCard';
import { useNotifications } from '../../os/notifications/hooks/useNotifications';
import { AppContainer } from '../../ui/components/AppContainer';
import { Grid } from '../../ui/components/Grid';
import { AppIcon } from './components/AppIcon';

export const HomeApp: FunctionComponent = () => {
    const { apps } = useApps();
    const config = useConfig();
    const darkweb = useDarkweb();
    const [t] = useTranslation();
    const societyNumber = usePhoneSocietyNumber();
    const { countAppNotification } = useNotifications();

    const filteredApps = apps.filter(
        app =>
            app.home !== true &&
            (societyNumber !== null || app.id !== 'society-messages') &&
            (darkweb || app.id !== 'darkweb')
    );
    const homeApps = apps.filter(app => app.home === true);

    return (
        <AppContainer>
            <Transition
                appear={true}
                show={true}
                enter="transition-transform duration-500"
                enterFrom="scale-[3.0]"
                enterTo="scale-100"
                className="flex grow"
            >
                <AppContent scrollable={false}>
                    <Grid className="grow">
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

                    {/* Dock */}
                    <Grid
                        rows={1}
                        className={cn('bg-opacity-35 rounded-[42px] h-[98px] mb-4 items-center', {
                            'bg-ios-800': config.theme.value === 'dark',
                            'bg-ios-50': config.theme.value === 'light',
                        })}
                    >
                        {homeApps.map(app => (
                            <Link key={app.id} to={app.path}>
                                <AppIcon icon={app.icon} badge={countAppNotification(app.id)} />
                            </Link>
                        ))}
                    </Grid>
                </AppContent>
            </Transition>
        </AppContainer>
    );
};
