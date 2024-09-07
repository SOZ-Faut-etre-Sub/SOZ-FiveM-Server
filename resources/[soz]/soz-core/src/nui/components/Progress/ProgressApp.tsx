import { animated, useSpring } from '@react-spring/web';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { Progress } from '../../../shared/nui/progress';
import { fetchNui } from '../../fetch';
import { useMinimap } from '../../hook/data';
import { useNuiEvent } from '../../hook/nui';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';

const PROGRESS_BAR_SEGMENTS = 10;

export const ProgressApp: FunctionComponent = () => {
    const minimap = useMinimap();

    const [progress, setProgress] = useState<Progress | null>(null);
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
        setProgress(null);
        setCurrentProgress(0);
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

    return (
        <animated.div
            style={styles}
            className={`fixed flex flex-col gap-3 bottom-10 text-center left-0 right-0 text-white text-xl mx-auto items-center`}
        >
            <div className="flex items-center mx-auto gap-2">
                {Array.from({ length: PROGRESS_BAR_SEGMENTS }, (_, index) => (
                    <ProgressSegment
                        key={index}
                        currentSegment={index}
                        maxSegment={PROGRESS_BAR_SEGMENTS}
                        progress={progress}
                        currentProgress={currentProgress}
                    />
                ))}
            </div>

            <div className="flex items-center mx-auto gap-2">
                <GlassMorphismContainer
                    className="flex gap-10 px-5 w-fit"
                    borderClassName="rounded-full"
                    borderColor={progress?.color}
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
    const sectionMax = progress?.duration / maxSegment;
    const progressForSection = currentProgress * progress?.duration - sectionMax * currentSegment;
    const barPercentage = Math.min(100, (Math.max(0, progressForSection) / sectionMax) * 100);

    return (
        <GlassMorphismContainer className="w-10" borderClassName="rounded-md" disableBorder>
            <div className="bg-white h-2.5 rounded-md" style={{ width: `${barPercentage}%` }}></div>
        </GlassMorphismContainer>
    );
};
