import { animated, useTransition } from '@react-spring/web';
import cn from 'classnames';
import { FunctionComponent } from 'react';

import { TargetOption } from '../../../../shared/target';
import { TargetItem } from './TargetItem';

export const TargetOptions: FunctionComponent<{
    targets: TargetOption[];
    direction: 'left' | 'right';
    onSelect: () => void;
}> = ({ targets, direction, onSelect }) => {
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
    );
};
