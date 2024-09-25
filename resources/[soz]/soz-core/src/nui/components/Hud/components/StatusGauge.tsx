import { FunctionComponent, PropsWithChildren } from 'react';

import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';
import { useZoom } from '../hooks/useZoom';

export type StatusBarProps = {
    min?: number;
    max?: number;
    value: number;
    color: string;
    backgroundColor: string;
    hideCondition?: (value: number) => boolean;
};

export const StatusGauge: FunctionComponent<PropsWithChildren<StatusBarProps>> = ({
    min = 0,
    max = 100,
    value,
    color,
    backgroundColor,
    children,
    hideCondition = value => (value - min) / (max - min) === 0,
}) => {
    const { width, height } = useZoom();

    const hide = hideCondition(value);
    if (hide) {
        return null;
    }

    const circumference = 90 * 2 * Math.PI;
    const offset = circumference - ((value - min) / (max - min)) * circumference;

    return (
        <div className="relative rounded-full" style={{ width, height }}>
            <GlassMorphismContainer
                borderClassName="rounded-full"
                className="flex justify-center items-center"
                style={{ width, height }}
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
                            stroke={backgroundColor}
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
