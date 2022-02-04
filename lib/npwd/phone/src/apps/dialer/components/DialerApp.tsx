import React from 'react';
import {AppWrapper} from '@ui/components';
import {AppTitle} from '@ui/components/AppTitle';
import {AppContent} from '@ui/components/AppContent';
import {DialerHistory} from './views/DialerHistory';
import {useApp} from '@os/apps/hooks/useApps';
import {Switch, Route} from 'react-router-dom';
import DialPage from './views/DialPage';
import DialerNavBar from './DialerNavBar';
import {ContactList} from '../../contacts/components/List/ContactList';
import {LoadingSpinner} from '@ui/components/LoadingSpinner';
import { Transition } from '@headlessui/react';

export const DialerApp: React.FC = () => {
    const dialer = useApp('DIALER');
    return (
        <Transition
            appear={true}
            show={true}
            className="mt-4 h-full flex flex-col"
            enter="transition-all origin-[20%_90%] duration-500"
            enterFrom="scale-[0.0] opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-all origin-[20%_90%] duration-500"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-[0.0] opacity-0"
        >
            <AppWrapper>
                <AppTitle app={dialer}/>
                <AppContent className="mt-5 h-[710px]">
                    <Switch>
                        <Route path="/phone/dial">
                            <DialPage/>
                        </Route>
                        <Route exact path="/phone">
                            <React.Suspense fallback={<LoadingSpinner/>}>
                                <DialerHistory/>
                            </React.Suspense>
                        </Route>
                        <React.Suspense fallback={<LoadingSpinner/>}>
                            <Route path="/phone/contacts" component={ContactList}/>
                        </React.Suspense>
                    </Switch>
                </AppContent>
                <DialerNavBar/>
            </AppWrapper>
        </Transition>
    );
};
