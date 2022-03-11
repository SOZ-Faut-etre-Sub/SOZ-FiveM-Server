import React from 'react';
import {AppWrapper} from '@ui/components';
import {AppTitle} from '@ui/components/AppTitle';
import {AppContent} from '@ui/components/AppContent';
import {useApp} from '@os/apps/hooks/useApps';
import MessageGroupModal from './modal/MessageGroupModal';
import MessagesList from './list/MessagesList';
import {Route, Switch, useHistory} from 'react-router-dom';
import {MessageModal} from './modal/MessageModal';
import {LoadingSpinner} from '@ui/components/LoadingSpinner';
import {PlusIcon} from "@heroicons/react/outline";
import {Transition} from '@headlessui/react';

export const MessagesApp = () => {
    const messages = useApp('MESSAGES');
    const history = useHistory();

    return (
        <Transition
            appear={true}
            show={true}
            unmount={false}
            className="mt-4 h-full flex flex-col"
            enter="transition-all origin-[45%_90%] duration-500"
            enterFrom="scale-[0.0] opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-all origin-[45%_90%] duration-500"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-[0.0] opacity-0"
        >
            <AppWrapper>
                <AppTitle app={messages} action={
                    <Route exact path="/messages">
                        <PlusIcon className="h-6 w-6 cursor-pointer" onClick={() => history.push('/messages/new')}/>
                    </Route>
                }>
                    <div/>
                </AppTitle>
                <AppContent>
                    <React.Suspense fallback={<LoadingSpinner/>}>
                        <Switch>
                            <Route path="/messages/conversations/:groupId">
                                <MessageModal/>
                            </Route>
                            <Route exact path="/messages">
                                <MessagesList/>
                            </Route>
                        </Switch>
                        <Switch>
                            <Route exact path={['/messages/new/:phoneNumber', '/messages/new']}>
                                <MessageGroupModal/>
                            </Route>
                        </Switch>
                    </React.Suspense>
                </AppContent>
            </AppWrapper>
        </Transition>
    );
};
