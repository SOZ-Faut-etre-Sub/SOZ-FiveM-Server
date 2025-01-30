import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Grid } from '../../components/Grid';
import { AppContainer } from '../../components/system/AppContainer';
import { AppContent } from '../../components/system/AppContent';
import { useApps } from '../../system/apps/hooks/useApps';
import { useThemeConfig } from '../../system/config/config.atom';
import { AppIcon } from './components/AppIcon';

export const HomeApp: FunctionComponent = () => {
    const apps = useApps();
    const { t } = useTranslation();

    const theme = useThemeConfig();

    const filteredApps = apps.filter(app => app.home !== true);
    const homeApps = apps.filter(app => app.home === true);

    return (
        <AppContainer>
            <AppContent scrollable={false}>
                <Grid className="grow">
                    {filteredApps.map(app => (
                        <Link key={app.id} to={app.path} style={{ order: app.position && app.position }}>
                            <AppIcon title={t(app.nameLocale)} icon={app.icon} badge={app.badge} />
                        </Link>
                    ))}
                </Grid>

                {/* Dock */}
                <Grid
                    rows={1}
                    className={clsx('bg-opacity-35 rounded-[42px] h-[98px] mb-4 items-center', {
                        'bg-ios-800': theme === 'dark',
                        'bg-ios-50': theme === 'light',
                    })}
                >
                    {homeApps.map(app => (
                        <Link key={app.id} to={app.path} style={{ order: app.position && app.position }}>
                            <AppIcon icon={app.icon} /*badge={countAppNotification(app.id)}*/ />
                        </Link>
                    ))}
                </Grid>
            </AppContent>
        </AppContainer>
    );
};
