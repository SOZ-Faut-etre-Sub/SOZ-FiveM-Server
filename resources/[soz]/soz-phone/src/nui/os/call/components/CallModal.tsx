import { AppContent } from '@ui/components/AppContent';
import { AppWrapper } from '@ui/components/AppWrapper';
import { FullPageWithHeader } from '@ui/layout/FullPageWithHeader';
import React, { memo, useEffect } from 'react';

import { useRingtoneSound } from '../../sound/hooks/useRingtoneSound';
import { useCall } from '../hooks/useCall';
import { useDialingSound } from '../hooks/useDialingSound';
import CallContactContainer from './CallContactContainer';
import { CallControls } from './CallControls';
import { CallTimer } from './CallTimer';
import RingingText from './RingingText';

export const CallModal = memo(() => {
    const { call } = useCall();
    const { play, stop } = useRingtoneSound();
    const { startDialTone, endDialTone } = useDialingSound();

    useEffect(() => {
        if (!call) return;

        if (!call.is_accepted) {
            if (call.isTransmitter) {
                startDialTone();
            } else {
                play();
            }
        }

        return () => {
            endDialTone();
            stop();
        };
    }, [call, play, stop, startDialTone, endDialTone]);

    if (!call) return null;

    return (
        <FullPageWithHeader className="bg-ios-800 bg-opacity-30 backdrop-blur">
            <AppWrapper>
                <AppContent>
                    <CallContactContainer />
                    {call?.is_accepted ? <CallTimer /> : call?.isTransmitter && <RingingText />}
                    <CallControls />
                </AppContent>
            </AppWrapper>
        </FullPageWithHeader>
    );
});
