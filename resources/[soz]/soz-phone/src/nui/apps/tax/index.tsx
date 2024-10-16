import { Transition } from '@headlessui/react';
import { memo } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppWrapper } from '../../ui/components/AppWrapper';
import { useBackground } from '../../ui/hooks/useBackground';
import { FullPageWithHeader } from '../../ui/layout/FullPageWithHeader';
import { TaxHome } from './pages/TaxHome';
import TaxPage from './pages/TaxPage';
import WhatIsTax from './pages/WhatIsTax';

export const TaxApp = memo(() => {
    const backgroundClass = useBackground();

    return (
        <FullPageWithHeader className={backgroundClass}>
            <Transition
                appear={true}
                show={true}
                enter="transition-all origin-[10%_20%] duration-300"
                enterFrom="scale-[0.0] opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-all origin-[10%_20%] duration-300"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-[0.0] opacity-0"
            >
                <AppWrapper className="p-2">
                    <Routes>
                        <Route index element={<TaxHome />} />
                        <Route path="tax">
                            <Route path=":id" element={<TaxPage />} />
                        </Route>
                        <Route path="whatIs" element={<WhatIsTax />} />
                    </Routes>
                </AppWrapper>
            </Transition>
        </FullPageWithHeader>
    );
});
