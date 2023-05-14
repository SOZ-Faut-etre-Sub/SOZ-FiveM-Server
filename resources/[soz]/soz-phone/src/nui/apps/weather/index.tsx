import { FullPageWithHeaderWithNavBar } from '../../ui/layout/FullPageWithHeaderWithNavBar';
import { Route, Routes } from 'react-router-dom';
import { AppWrapper } from '../../ui/components/AppWrapper';
import { Transition } from '@headlessui/react';
import { WeatherHome } from './pages/WeatherHome';
import { useWeather } from '../../hooks/app/useWeather';
import { useTime } from '../../hooks/usePhone';

const getBackgroundColor = (time) => {
    const hours = parseInt(time, 10);
    const isNight = hours >= 22 || hours < 6;
    const isDay = hours >= 8 && hours <= 20;
    if (isNight) {
        return 'bg-gradient-to-t from-sky-900 to-indigo-900';
    } else if (isDay) {
        return 'bg-gradient-to-t from-sky-900 to-sky-400';
    } else {
        return 'bg-gradient-to-t from-sky-900 to-orange-500';
    }
}

export const WeatherApp = () => {
    const { getAlert } = useWeather();
    const alertInProgress = !!getAlert();
    const time = useTime();
    const backgroundClass = alertInProgress
        ? 'bg-gradient-to-t from-red-900 to-red-600'
        : getBackgroundColor(time);

    return (
        <FullPageWithHeaderWithNavBar className={backgroundClass}>
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
                        <Route index element={<WeatherHome />} />
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeaderWithNavBar>
    )
}