import { AppContent } from '@ui/components/AppContent';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React from 'react';

import { useCall } from '../hooks/useCall';
import CallContactContainer from './CallContactContainer';
import { CallControls } from './CallControls';
import { CallTimer } from './CallTimer';
import RingingText from './RingingText';

export const CallModal: React.FC = () => {
    const { call } = useCall();

    if (!call) return null;

    return (
        <FullPageWithHeader className="bg-black bg-opacity-30 backdrop-blur">
            <AppWrapper>
                <AppContent>
                    <CallContactContainer />
                    {call?.is_accepted ? <CallTimer /> : call?.isTransmitter && <RingingText />}
                    <CallControls />
                </AppContent>
            </AppWrapper>
        </FullPageWithHeader>
    );
};
