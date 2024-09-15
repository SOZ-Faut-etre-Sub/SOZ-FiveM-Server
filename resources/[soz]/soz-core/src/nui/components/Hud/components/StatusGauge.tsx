import { FunctionComponent, PropsWithChildren } from 'react';

import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';

export type StatusBarProps = {
    min?: number;
    max?: number;
    value: number;
    color: string;
    hideCondition?: (value: number) => boolean;
};

export const StatusGauge: FunctionComponent<PropsWithChildren<StatusBarProps>> = ({
    min = 0,
    max = 100,
    value,
    color,
    children,
    hideCondition = value => (value - min) / (max - min) < 1,
}) => {
    const hide = hideCondition(value);
    if (hide) {
        return null;
    }

    const circumference = 90 * 2 * Math.PI;
    const offset = circumference - ((value - min) / (max - min)) * circumference;

    return (
        <div className="relative size-12 rounded-full">
            <GlassMorphismContainer
                borderClassName="rounded-full"
                className="flex justify-center items-center size-12"
                disableBorder
            >
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
                        />
                        <circle
                            r="90"
                            cx="100"
                            cy="100"
                            stroke={color}
                            strokeWidth="1.5rem"
                            strokeLinecap="butt"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={String(offset)}
                            fill="transparent"
                        />
                    </svg>
                </div>
            </GlassMorphismContainer>
        </div>
    );
};
