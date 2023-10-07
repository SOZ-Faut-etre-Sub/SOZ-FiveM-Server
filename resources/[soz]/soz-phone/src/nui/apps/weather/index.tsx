import { Transition } from '@headlessui/react';
import cn from 'classnames';
import { Route, Routes } from 'react-router-dom';

import { useWeather } from '../../hooks/app/useWeather';
import { useTime } from '../../hooks/usePhone';
import { AppWrapper } from '../../ui/components/AppWrapper';
import { FullPage } from '../../ui/layout/FullPage';
import { WeatherList } from './pages/WeatherList';

export const WeatherApp = () => {
    const { getAlert } = useWeather();
    const alert = getAlert();
    const alertInProgress = alert && alert.getTime() > Date.now();
    const time = useTime();
    const hours = parseInt(time.slice(0, 2), 10);
    const isNight = hours >= 21 || hours < 6;
    const isDay = hours >= 8 && hours < 20;

    return (
        <FullPage
            className={cn('bg-gradient-to-t', {
                'from-red-900 to-red-600': alertInProgress,
                'from-sky-900 to-indigo-900': !alertInProgress && isNight,
                'from-sky-900 to-sky-400': !alertInProgress && isDay,
                'from-sky-900 to-orange-500': !alertInProgress && !isDay && !isNight,
            })}
        >
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[35%_10%] duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[35%_10%] duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <Routes>
                        <Route index element={<WeatherList />} />
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPage>
    );
};
