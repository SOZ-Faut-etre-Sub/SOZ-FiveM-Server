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

export const MessagesApp = () => {
    const messages = useApp('MESSAGES');
    const history = useHistory();

    return (
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
    );
};
