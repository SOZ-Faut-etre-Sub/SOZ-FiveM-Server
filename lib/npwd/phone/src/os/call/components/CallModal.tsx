import React from 'react';
import {AppWrapper} from '@ui/components';
import {AppContent} from '@ui/components/AppContent';
import {useCall} from '../hooks/useCall';
import {CallTimer} from './CallTimer';
import {CallControls} from './CallControls';
import CallContactContainer from './CallContactContainer';
import RingingText from './RingingText';
import {LoadingSpinner} from '@ui/components/LoadingSpinner';

export const CallModal: React.FC = () => {
    const {call} = useCall();

    if (!call) return null;

    return (
        <AppWrapper className="bg-black bg-opacity-30 backdrop-blur">
            <AppContent className="z-40 h-full">
                <React.Suspense fallback={<LoadingSpinner/>}>
                    <CallContactContainer/>
                    {call?.is_accepted ? <CallTimer/> : call?.isTransmitter && <RingingText/>}
                    <CallControls/>
                </React.Suspense>
            </AppContent>
        </AppWrapper>
    );
};
