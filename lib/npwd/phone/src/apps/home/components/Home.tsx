import React, {useContext, useEffect, useRef} from 'react';
import {AppWrapper} from '@ui/components';
import {useApps} from '@os/apps/hooks/useApps';
import {useMySocietyPhoneNumber} from "@os/simcard/hooks/useMyPhoneNumber";
import {AppsGrid} from "./AppsGrid";
import {ThemeContext} from "../../../styles/themeProvider";

export const HomeApp: React.FC = () => {
    const appRef = useRef(null);
    const {apps} = useApps();
    const {theme} = useContext(ThemeContext);
    const societyNumber = useMySocietyPhoneNumber();

    const filteredApps = (societyNumber === null) ? apps.filter((app) => app.home !== true && app.id !== 'SOCIETY_MESSAGES') : apps.filter((app) => app.home !== true)
    const homeApps = apps.filter((app) => app.home === true)

    useEffect(() => {
        appRef.current.animate([
            { transform: 'scale(3.0)' }, { transform: 'scale(1.0)' }
        ], {duration: 500});
    });

    return (
        <div ref={appRef} className={`p-0 m-0 relative flex flex-col h-full w-full min-h-[720px]`}>
            <div className="mt-4 h-full flex flex-col justify-between">
                <div className="mt-4 px-1">
                    <AppsGrid items={filteredApps}/>
                </div>
                <div className={`${theme === 'dark' ? 'bg-black' : 'bg-[#F2F2F6]'} bg-opacity-25 backdrop-blur rounded-[20px] mb-10 py-2 mx-2`}>
                    <AppsGrid items={homeApps}/>
                </div>
            </div>
        </div>
    );
};
