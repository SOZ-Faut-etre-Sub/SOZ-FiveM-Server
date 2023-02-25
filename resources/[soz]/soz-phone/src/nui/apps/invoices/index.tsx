import { Transition } from '@headlessui/react';
import { memo } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppWrapper } from '../../ui/components/AppWrapper';
import { useBackground } from '../../ui/hooks/useBackground';
import { FullPageWithHeader } from '../../ui/layout/FullPageWithHeader';
import InvoiceList from './pages/InvoiceList';

export const InvoiceApp = memo(() => {

    const backgroundClass = useBackground();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-center duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-center duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper>
                    <Routes>
                        <Route index element={<InvoiceList />} />
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
});
