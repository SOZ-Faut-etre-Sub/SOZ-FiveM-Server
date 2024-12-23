import { Transition } from '@headlessui/react';
import { PhoneEvents } from '@typings/phone';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import { fetchNui } from '@utils/fetchNui';
import React, { useEffect } from 'react';

import { AppWrapper } from '../../ui/components/AppWrapper';
import { useBackground } from '../../ui/hooks/useBackground';

export const ZutomApp: React.FC = () => {
    const backgroundClass = useBackground();

    useEffect(() => {
        fetchNui(PhoneEvents.TOGGLE_KEYS, {
            keepGameFocus: false,
        });
        return () => {
            fetchNui(PhoneEvents.TOGGLE_KEYS, {
                keepGameFocus: true,
            });
        };
    });

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[60%_20%] duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[60%_20%] duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper className="h-[775px] w-full">
                    <iframe className="h-full w-full" height={775} src="https://sutom.nocle.fr" />
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
};
