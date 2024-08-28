import { FunctionComponent, PropsWithChildren } from 'react';

import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';

export type StatusBarProps = {
    percent: number;
    color: string;
    hideCondition?: (value: number) => boolean;
};

export const StatusGauge: FunctionComponent<PropsWithChildren<StatusBarProps>> = ({
    percent,
    color,
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
        <div className="relative size-12 rounded-full">
            <GlassMorphismContainer className="flex justify-center items-center size-12" disableBorder>
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
                            stroke={color}
                            strokeOpacity="0.35"
                            strokeWidth="1.5rem"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset="0"
                        ></circle>
                        <circle
                            r="90"
                            cx="100"
                            cy="100"
                            stroke={color}
                            strokeWidth="1.5rem"
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
