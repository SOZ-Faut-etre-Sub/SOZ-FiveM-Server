import cn from 'classnames';
import { FunctionComponent } from 'react';

import { TargetOption } from '../../../../shared/target';
import { TargetItem } from './TargetItem';

export const TargetOptions: FunctionComponent<{ targets: TargetOption[]; direction: 'left' | 'right' }> = ({
    targets,
    direction,
}) => {
    return (
        <div
            className={cn('relative text-white mt-4 space-y-2', {
                'left-5': direction === 'left',
                '-right-5': direction === 'right',
            })}
        >
            {targets.map((target, index) => (
                <TargetItem key={index} {...target} />
            ))}
        </div>
    );
};
