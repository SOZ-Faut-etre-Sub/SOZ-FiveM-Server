import { FunctionComponent, PropsWithChildren } from 'react';

import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';

export type StatusBarProps = {
    percent: number;
    gaugeColor: string;
    gaugeBackgroundColor: string;
    hideCondition?: (value: number) => boolean;
};

export const StatusGauge: FunctionComponent<PropsWithChildren<StatusBarProps>> = ({
    percent,
    gaugeColor,
    gaugeBackgroundColor,
    children,
    hideCondition = value => value < 0.01,
}) => {
    const hide = hideCondition(percent);

    if (hide) {
        return null;
    }

    const circumference = 90 * 2 * Math.PI;
    const offset = circumference - ((-percent * 100) / 100 / 100) * circumference;

    return (
        <div className="relative h-11 w-11 rounded-full">
            <GlassMorphismContainer className="flex justify-center items-center h-11 w-11" disableBorder>
                {children}
                <div className="absolute -inset-[1px] flex justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-full w-full"
                        viewBox="0 0 200 200"
                        style={{ transform: 'rotate(-90deg)' }}
                    >
                        <circle
                            r="90"
                            cx="100"
                            cy="100"
                            fill="transparent"
                            stroke={gaugeBackgroundColor}
                            strokeOpacity="0.50"
                            strokeWidth="16px"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset="0"
                        ></circle>
                        <circle
                            r="90"
                            cx="100"
                            cy="100"
                            stroke={gaugeColor}
                            strokeWidth="16px"
                            strokeLinecap="round"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={String(-offset)}
                            fill="transparent"
                        ></circle>
                    </svg>
                </div>
            </GlassMorphismContainer>
        </div>
    );
};
