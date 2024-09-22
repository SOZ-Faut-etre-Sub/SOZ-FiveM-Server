import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { TargetOption } from '../../../shared/target';
import { fetchNui } from '../../fetch';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { useDaltonism } from '../Hud/hooks/useDaltonism';
import { TargetConnector } from './components/TargetConnector';
import { TargetOptions } from './components/TargetOptions';

const EXCLUDED_KEYS = ['z', 'q', 's', 'd', 'w', 'a'];

export const TargetOverlay: FunctionComponent = () => {
    const [isTargeting, setIsTargeting] = useState<boolean>(false);
    const [targetFound, setTargetFound] = useState<boolean>(false);
    const [targets, setTargets] = useState<TargetOption[]>([]);

    const { targetColors } = useDaltonism();

    const container = useRef<HTMLDivElement>(null);
    const origin = useRef<SVGSVGElement>(null);
    const targetCitizen = useRef<HTMLDivElement>(null);
    const targetSociety = useRef<HTMLDivElement>(null);
    const targetCriminal = useRef<HTMLDivElement>(null);

    useNuiEvent('target', 'SetTargeting', setIsTargeting);
    useNuiEvent('target', 'SetTargetFound', setTargetFound);
    useNuiEvent('target', 'SetTargets', setTargets);

    useNuiFocus(targetFound, targetFound, targetFound);

    const onKeyUpReceived = useCallback(
        (event: KeyboardEvent) => {
            if (EXCLUDED_KEYS.includes(event.key.toLowerCase())) return;

            setIsTargeting(false);
            setTargetFound(false);

            fetchNui(NuiEvent.TargetReset);
        },
        [setIsTargeting, setTargetFound]
    );

    useEffect(() => {
        window.addEventListener('keyup', onKeyUpReceived);

        return () => {
            window.removeEventListener('keyup', onKeyUpReceived);
        };
    }, [onKeyUpReceived]);

    const styles = useSpring({
        from: {
            opacity: 0,
        },
        to: {
            opacity: isTargeting ? 1 : 0,
        },
    });

    const citizenActions = targets.filter(target => target.category === 'citizen');
    const societyActions = targets.filter(target => target.category === 'society');
    const criminalActions = targets.filter(target => target.category === 'criminal');

    const circumference = 60 * 2 * Math.PI;
    const offset = circumference - ((-30 * 100) / 100 / 100) * circumference;

    return (
        <div ref={container} className="absolute inset-0">
            <animated.div className="absolute top-[calc(50%-1.25rem)] left-[calc(50%-1.25rem)] size-14" style={styles}>
                {targetFound ? (
                    <svg
                        ref={origin}
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute inset-0 -left-2 -top-2 size-14 z-10"
                        viewBox="0 0 200 200"
                        style={{ transform: `rotate(-40deg)` }}
                    >
                        <circle
                            r="60"
                            cx="100"
                            cy="100"
                            stroke="#fff"
                            strokeWidth="0.75rem"
                            strokeLinecap="round"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={offset}
                            fill="transparent"
                        />
                        <circle r="30" cx="100" cy="100" fill="#fff" />
                    </svg>
                ) : (
                    <img
                        className="absolute inset-0 size-10 opacity-50"
                        src="/public/images/hud/target.webp"
                        alt="target"
                    />
                )}
            </animated.div>

            {targetFound && (
                <>
                    <div className="absolute flex flex-col justify-center inset-y-[5vh] left-[53vw] min-w-[20rem] p-5">
                        {citizenActions.length > 0 && (
                            <TargetOptions
                                title="Actions"
                                titleRef={targetCitizen}
                                color={targetColors.citizen}
                                targets={citizenActions}
                                direction="left"
                                onSelect={() => setTargetFound(false)}
                            />
                        )}

                        {citizenActions.length === 0 && societyActions.length > 0 && (
                            <TargetOptions
                                title="Entreprise"
                                titleRef={targetSociety}
                                color={targetColors.society}
                                targets={societyActions}
                                direction="left"
                                onSelect={() => setTargetFound(false)}
                            />
                        )}

                        {citizenActions.length === 0 && societyActions.length === 0 && criminalActions.length > 0 && (
                            <TargetOptions
                                title="Criminelle"
                                titleRef={targetCriminal}
                                color={targetColors.criminal}
                                targets={criminalActions}
                                direction="left"
                                onSelect={() => setTargetFound(false)}
                            />
                        )}
                    </div>

                    <div className="absolute flex flex-col justify-center inset-y-[5vh] right-[55vw] min-w-[20rem] space-y-10 p-5">
                        {(citizenActions.length > 0 || societyActions.length > 0) && criminalActions.length > 0 && (
                            <TargetOptions
                                title="Criminelle"
                                titleRef={targetCriminal}
                                color={targetColors.criminal}
                                targets={criminalActions}
                                direction="right"
                                onSelect={() => setTargetFound(false)}
                            />
                        )}

                        {citizenActions.length > 0 && societyActions.length > 0 && (
                            <TargetOptions
                                title="Entreprise"
                                titleRef={targetSociety}
                                color={targetColors.society}
                                targets={societyActions}
                                direction="right"
                                onSelect={() => setTargetFound(false)}
                            />
                        )}
                    </div>

                    {/*Connector*/}
                    {citizenActions.length > 0 && (
                        <TargetConnector
                            color={targetColors.citizen}
                            container={container}
                            origin={origin}
                            originAnchor="right"
                            target={targetCitizen}
                        />
                    )}

                    {citizenActions.length === 0 && societyActions.length > 0 && (
                        <TargetConnector
                            color={targetColors.society}
                            container={container}
                            origin={origin}
                            originAnchor="right"
                            target={targetSociety}
                        />
                    )}

                    {citizenActions.length === 0 && societyActions.length === 0 && criminalActions.length > 0 && (
                        <TargetConnector
                            color={targetColors.criminal}
                            container={container}
                            origin={origin}
                            originAnchor="right"
                            target={targetCriminal}
                        />
                    )}

                    {(citizenActions.length > 0 || societyActions.length > 0) && criminalActions.length > 0 && (
                        <TargetConnector
                            color={targetColors.criminal}
                            container={container}
                            origin={origin}
                            originAnchor="center"
                            target={targetCriminal}
                            targetAnchor="right"
                        />
                    )}

                    {citizenActions.length > 0 && societyActions.length > 0 && (
                        <TargetConnector
                            color={targetColors.society}
                            container={container}
                            origin={origin}
                            originAnchor="left"
                            target={targetSociety}
                            targetAnchor="right"
                        />
                    )}
                </>
            )}
        </div>
    );
};
