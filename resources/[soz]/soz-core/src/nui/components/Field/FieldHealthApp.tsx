import cn from 'classnames';
import { FunctionComponent, useState } from 'react';

import { useNuiEvent } from '../../hook/nui';
import ZeedIcon from '../../icons/field/zeed.svg';

export const FieldHealthApp: FunctionComponent = () => {
    const [health, setHealth] = useState<string | null>(null);

    useNuiEvent('field', 'SetHealth', health => {
        setHealth(health);
    });

    if (!health) {
        return null;
    }

    return (
        <div className="w-full h-full">
            <div className="absolute flex bottom-10 justify-center items-center w-full">
                {health.split('').map((char, index) => (
                    <ZeedIcon
                        key={'FieldHealthApp' + index}
                        className={cn('h-10', { grayscale: char === '0' })}
                    ></ZeedIcon>
                ))}
            </div>
        </div>
    );
};
