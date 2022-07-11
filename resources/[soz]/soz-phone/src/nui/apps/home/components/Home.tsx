import { Transition } from '@headlessui/react';
import { useApps } from '@os/apps/hooks/useApps';
import { useMySocietyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { AppWrapper } from '@ui/old_components';
import React, { useContext } from 'react';

import { ThemeContext } from '../../../styles/themeProvider';
import { AppsGrid } from './AppsGrid';

export const HomeApp: React.FC = () => {
    const { apps } = useApps();
    const { theme } = useContext(ThemeContext);
    const societyNumber = useMySocietyPhoneNumber();

    const filteredApps =
        societyNumber === null
            ? apps.filter(app => app.home !== true && app.id !== 'society-messages')
            : apps.filter(app => app.home !== true);
    const homeApps = apps.filter(app => app.home === true);

    return (
        <AppWrapper>
            <Transition
                appear={true}
                show={true}
                className="mt-4 h-full flex flex-col justify-between"
                enter="transition-transform duration-700"
                enterFrom="scale-[3.0]"
                enterTo="scale-100"
                leave="transition-transform duration-700"
                leaveFrom="scale-100"
                leaveTo="scale-[3.0]"
            >
                <div className="mt-4 px-1">
                    <AppsGrid items={filteredApps} />
                </div>
                <div
                    className={`${
                        theme === 'dark' ? 'bg-black' : 'bg-[#F2F2F6]'
                    } bg-opacity-25 rounded-[20px] mb-10 py-2 mx-2`}
                >
                    <AppsGrid items={homeApps} />
                </div>
            </Transition>
        </AppWrapper>
    );
};
