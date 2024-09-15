import { animated, useSpring } from '@react-spring/web';
import cn from 'classnames';
import { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { TargetOption } from '../../../shared/target';
import { fetchNui } from '../../fetch';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { TargetConnector } from './components/TargetConnector';
import { TargetOptions } from './components/TargetOptions';

const EXCLUDED_KEYS = ['z', 'q', 's', 'd', 'w', 'a'];

export const TargetOverlay: FunctionComponent = () => {
    const [isTargeting, setIsTargeting] = useState<boolean>(false);
    const [targetFound, setTargetFound] = useState<boolean>(false);
    const [targets, setTargets] = useState<TargetOption[]>([]);

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
        <animated.div ref={container} className="absolute inset-0" style={styles}>
            <div className="absolute top-[calc(50%-1.25rem)] left-[calc(50%-1.25rem)] size-14">
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
            </div>

            {targetFound && citizenActions.length > 0 && (
                <div className="absolute top-[30vh] left-[53vw] min-w-[20rem] max-h-[65vh] p-5">
                    <h2 className="flex items-center gap-2 text-white uppercase drop-shadow-bg">
                        <div ref={targetCitizen} className="bg-white h-1 w-4 rounded-full" /> Actions
                    </h2>
                    <TargetOptions targets={citizenActions} direction="left" onSelect={() => setTargetFound(false)} />
                </div>
            )}

            {targetFound && (criminalActions.length > 0 || societyActions.length > 0) && (
                <div
                    className={cn('absolute right-[55vw] min-w-[20rem] max-h-[65vh] space-y-10 p-5', {
                        'top-[20vh]': criminalActions.length > 0 && societyActions.length > 0,
                        'top-[30vh]':
                            (criminalActions.length > 0 && societyActions.length === 0) ||
                            (criminalActions.length === 0 && societyActions.length > 0),
                    })}
                >
                    {criminalActions.length > 0 && (
                        <div>
                            <h2 className="relative -right-10 flex items-center justify-end gap-2 text-[#EF4444] uppercase drop-shadow-bg">
                                Criminelle <div ref={targetCriminal} className="bg-[#EF4444] h-1 w-4 rounded-full" />
                            </h2>
                            <TargetOptions
                                targets={criminalActions}
                                direction="right"
                                onSelect={() => setTargetFound(false)}
                            />
                        </div>
                    )}

                    {societyActions.length > 0 && (
                        <div>
                            <h2 className="relative -right-10 flex items-center justify-end gap-2 text-blue-500 uppercase drop-shadow-bg">
                                Entreprise <div ref={targetSociety} className="bg-blue-500 h-1 w-4 rounded-full" />
                            </h2>
                            <TargetOptions
                                targets={societyActions}
                                direction="right"
                                onSelect={() => setTargetFound(false)}
                            />
                        </div>
                    )}
                </div>
            )}

            {targetFound && (
                <>
                    {citizenActions.length > 0 && (
                        <TargetConnector
                            className="text-white"
                            container={container}
                            origin={origin}
                            originAnchor="right"
                            target={targetCitizen}
                        />
                    )}

                    {criminalActions.length > 0 && (
                        <TargetConnector
                            className="text-[#EF4444]"
                            container={container}
                            origin={origin}
                            originAnchor="center"
                            target={targetCriminal}
                            targetAnchor="right"
                        />
                    )}

                    {societyActions.length > 0 && (
                        <TargetConnector
                            className="text-blue-500"
                            container={container}
                            origin={origin}
                            originAnchor="left"
                            target={targetSociety}
                            targetAnchor="right"
                        />
                    )}
                </>
            )}
        </animated.div>
    );
};
