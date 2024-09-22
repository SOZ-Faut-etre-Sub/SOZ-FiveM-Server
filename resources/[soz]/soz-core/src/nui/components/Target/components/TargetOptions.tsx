import { animated, useTransition } from '@react-spring/web';
import cn from 'classnames';
import { FunctionComponent, RefObject } from 'react';

import { TargetOption } from '../../../../shared/target';
import { TargetItem } from './TargetItem';

export const TargetOptions: FunctionComponent<{
    title: string;
    titleRef: RefObject<HTMLDivElement>;
    color: string;
    targets: TargetOption[];
    direction: 'left' | 'right';
    onSelect: () => void;
}> = ({ title, titleRef, color, targets, direction, onSelect }) => {
    const transitions = useTransition(
        targets.sort((a, b) => a.label.localeCompare(b.label)),
        {
            from: { opacity: 0, height: 0 },
            keys: item => item.id,
            enter: () => async next => {
                await next({ opacity: 1, height: 48 });
            },
            leave: [{ opacity: 0 }, { height: 0 }],
            config: (_item, _index, phase) => key =>
                phase === 'enter' && key === 'life'
                    ? { duration: 3000 }
                    : { tension: 125, friction: 20, precision: 0.1 },
        }
    );

    return (
        <div>
            <h2
                className={cn('flex items-center gap-2 uppercase drop-shadow-bg', {
                    'relative -right-10 justify-end': direction === 'right',
                    'text-white': direction === 'left',
                })}
                style={{ color }}
            >
                {direction === 'right' && <span>{title}</span>}
                <div
                    ref={titleRef}
                    className="h-1 w-4 rounded-full"
                    style={{
                        background: color,
                    }}
                />
                {direction === 'left' && <span>{title}</span>}
            </h2>
            <div
                className={cn('relative text-white mt-4 space-y-2', {
                    'left-5': direction === 'left',
                    '-right-5': direction === 'right',
                })}
            >
                {transitions(({ opacity, height }, target) => (
                    <animated.div className="relative" style={{ opacity, height }}>
                        <TargetItem {...target} onSelect={onSelect} />
                    </animated.div>
                ))}
            </div>
        </div>
    );
};
