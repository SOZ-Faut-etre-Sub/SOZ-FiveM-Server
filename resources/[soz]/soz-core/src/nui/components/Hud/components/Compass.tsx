import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../store';
import { GlassMorphismContainer } from '../../Styleguide/GlassMorphismContainer';
import { useZoom } from '../hooks/useZoom';

export const Compass: FunctionComponent = () => {
    const hasWatch = useSelector((state: RootState) => state.hud.hasWatch);
    const settings = useSelector((state: RootState) => state.hud.settings);
    const compass = useSelector((state: RootState) => state.hud.compass);

    const { width, height } = useZoom();

    const circumference = 90 * 2 * Math.PI;
    const offset = circumference - ((-20 * 100) / 100 / 100) * circumference;

    if (!hasWatch || !settings.showCompass) {
        return null;
    }

    return (
        <div className="relative rounded-full" style={{ width, height }}>
            <GlassMorphismContainer
                borderClassName="rounded-full"
                className="flex justify-center items-center text-white"
                style={{ width, height }}
                disableBorder
            >
                <span className="text-sm pt-0.5" style={{ zoom: settings.zoom }}>
                    {compass.cardinal}
                </span>
                <div className="absolute inset-0 flex justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-full w-full"
                        viewBox="0 0 200 200"
                        style={{ transform: `rotate(${compass.degree + -135}deg)` }}
                    >
                        <circle
                            r="90"
                            cx="100"
                            cy="100"
                            fill="transparent"
                            stroke="#fff"
                            strokeOpacity="0.10"
                            strokeWidth="1.5rem"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset="0"
                        />
                        <circle
                            r="90"
                            cx="100"
                            cy="100"
                            stroke="#fff"
                            strokeWidth="1.5rem"
                            strokeLinecap="round"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={String(-offset)}
                            fill="transparent"
                        />
                    </svg>
                </div>
                <div className="absolute inset-0 p-2 flex justify-center">
                    <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17 33V31M17 3V1M1 17H3M31 17H33"
                            stroke="#FFFFFF"
                            strokeOpacity="0.50"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            </GlassMorphismContainer>
        </div>
    );
};
