import cn from 'classnames';
import { FunctionComponent, useState } from 'react';

import { useNuiEvent } from '../../hook/nui';
import UraniumIcon from '../../icons/field/uranium.svg';
import ZeedIcon from '../../icons/field/zeed.svg';

const Mapping = {
    zeed: ZeedIcon,
    uranium: UraniumIcon,
};

export const FieldHealthApp: FunctionComponent = () => {
    const [health, setHealth] = useState<string | null>(null);
    const [icon, setIcon] = useState<string | null>(null);

    useNuiEvent('field', 'SetHealth', data => {
        if (!data) {
            setHealth(null);
            setIcon(null);
        } else {
            setHealth(data[0]);
            setIcon(data[1]);
        }
    });

    if (!health) {
        return null;
    }

    const Tag = Mapping[icon];
    return (
        <div className="w-full h-full">
            <div className="absolute flex bottom-10 justify-center items-center w-full">
                {health.split('').map((char, index) => (
                    <Tag key={'FieldHealthApp' + index} className={cn('h-10 w-12', { grayscale: char === '0' })}></Tag>
                ))}
            </div>
        </div>
    );
};
