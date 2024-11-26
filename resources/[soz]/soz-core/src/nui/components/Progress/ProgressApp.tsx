import { animated, useSpring } from '@react-spring/web';
import cn from 'classnames';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { Progress } from '../../../shared/nui/progress';
import { fetchNui } from '../../fetch';
import { useHudHasStreetNames, useMinimap, useVehicle } from '../../hook/data';
import { useNuiEvent } from '../../hook/nui';
import { useHudColor } from '../Hud/hooks/useHudColor';
import { GameCanvasBox } from '../Styleguide/GameCanvasBox';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';

const PROGRESS_BAR_SEGMENTS = 10;

export const ProgressApp: FunctionComponent = () => {
    const minimap = useMinimap();
    const vehicle = useVehicle();
    const hasStreetNamesEnabled = useHudHasStreetNames();

    const [progress, setProgress] = useState<Progress | null>();
    const [currentProgress, setCurrentProgress] = useState(0);

    const styles = useSpring({
        from: {
            opacity: 0,
            top: '150vh',
        },
        to: {
            opacity: progress ? 1 : 0,
            top: progress ? `${(minimap.bottom + 0.005) * 100}vh` : '150vh',
            right: `${(minimap.left + 0.005) * 100}vw`,
        },
    });

    useNuiEvent('progress', 'Start', data => {
        setCurrentProgress(0);
        setProgress(data);
    });

    useNuiEvent('progress', 'Stop', () => {
        setCurrentProgress(0);
        setProgress(null);
    });

    useEffect(() => {
        if (!progress) {
            return () => {};
        }

        const end = Date.now() + progress.duration;
        const timer = setInterval(() => {
            if (Date.now() > end) {
                setProgress(null);
                return;
            }

            const diff = end - Date.now();
            const completedPercentage = 1 - diff / progress.duration;

            setCurrentProgress(completedPercentage);
        }, 20);

        return () => {
            clearInterval(timer);
        };
    }, [progress]);

    useEffect(() => {
        if (currentProgress >= 1) {
            fetchNui(NuiEvent.ProgressFinish);
        }
    }, [currentProgress]);

    if (!progress) {
        return null;
    }

    return (
        <animated.div
            style={styles}
            className={cn(
                `absolute w-full inset-x-0 flex flex-col justify-center items-center gap-3 text-white text-xl`,
                {
                    'bottom-10': hasStreetNamesEnabled && vehicle.seat === null,
                    '-bottom-10': hasStreetNamesEnabled && vehicle.seat !== null,
                    '-mt-16': !hasStreetNamesEnabled && vehicle.seat === null,
                    '-mt-0': !hasStreetNamesEnabled && vehicle.seat !== null,
                }
            )}
        >
            <div className="flex justify-center items-center">
                <GameCanvasBox borderClassName="flex items-center gap-2" blur={false}>
                    {Array.from({ length: PROGRESS_BAR_SEGMENTS }, (_, index) => (
                        <ProgressSegment
                            key={index}
                            currentSegment={index}
                            maxSegment={PROGRESS_BAR_SEGMENTS}
                            progress={progress}
                            currentProgress={currentProgress}
                        />
                    ))}
                </GameCanvasBox>
            </div>

            {vehicle.seat === null && (progress?.label || progress?.units?.length > 0) && (
                <div className="flex justify-center items-center gap-2">
                    <GlassMorphismContainer
                        className="flex gap-10 px-5 py-1 w-fit"
                        borderClassName="rounded-full"
                        borderColor={progress?.color}
                        disableGameClone={!progress}
                    >
                        <span>{progress?.label}</span>

                        {progress?.units?.length > 0 && (
                            <div className="flex gap-2">
                                {progress?.units.map((unit, index) => (
                                    <div key={index} className="font-mono font-sm w-18">
                                        {((unit.end - unit.start) * currentProgress + unit.start).toFixed(2)}
                                        {unit.unit}
                                    </div>
                                ))}
                            </div>
                        )}
                    </GlassMorphismContainer>
                </div>
            )}
        </animated.div>
    );
};

interface ProgressSegmentProps {
    currentSegment: number;
    maxSegment: number;
    progress: Progress;
    currentProgress: number;
}

export const ProgressSegment: FunctionComponent<ProgressSegmentProps> = ({
    currentSegment,
    maxSegment,
    progress,
    currentProgress,
}) => {
    const { glassmorphismColors } = useHudColor();

    const sectionMax = progress?.duration / maxSegment;
    const progressForSection = currentProgress * progress?.duration - sectionMax * currentSegment;
    const barPercentage = Math.min(100, (Math.max(0, progressForSection) / sectionMax) * 100);

    return (
        <div className="w-10 rounded-md overflow-hidden">
            <div className="relative backdrop-blur-[5px]">
                <div
                    className="absolute inset-0"
                    style={{
                        background: glassmorphismColors.background,
                    }}
                />
                <div
                    className="relative h-2.5 rounded-md z-10"
                    style={{ width: `${barPercentage}%`, background: glassmorphismColors.border }}
                />
            </div>
        </div>
    );
};
