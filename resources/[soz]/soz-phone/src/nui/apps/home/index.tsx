import { Transition } from '@headlessui/react';
import { useApps } from '@os/apps/hooks/useApps';
import { useMySocietyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import React, { FunctionComponent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ThemeContext } from '../../styles/themeProvider';
import { Grid } from '../../ui/components/Grid';
import { FullPageWithHeader } from '../../ui/layout/FullPageWithHeader';
import { AppIcon } from './components/AppIcon';

export const HomeApp: FunctionComponent = () => {
    const { apps } = useApps();
    const { theme } = useContext(ThemeContext);
    const [t] = useTranslation();
    const societyNumber = useMySocietyPhoneNumber();

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
                enter="transition-transform duration-700"
                enterFrom="scale-[3.0]"
                enterTo="scale-100"
            >
                <Grid styleRules={{ margin: '1rem 0 3rem 0' }}>
                    {filteredApps.map(app => (
                        <Link key={app.id} to={app.path}>
                            <AppIcon title={t(app.nameLocale)} icon={app.icon} />
                        </Link>
                    ))}
                </Grid>
                <Grid
                    rows={1}
                    className={`${theme === 'dark' ? 'bg-black' : 'bg-[#F2F2F6]'} bg-opacity-25 rounded-[20px] p-1.5`}
                >
                    {homeApps.map(app => (
                        <Link key={app.id} to={app.path}>
                            <AppIcon title={t(app.nameLocale)} icon={app.icon} />
                        </Link>
                    ))}
                </Grid>
            </Transition>
        </FullPageWithHeader>
    );
};
