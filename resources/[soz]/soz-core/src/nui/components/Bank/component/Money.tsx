import cn from 'classnames';
import { FunctionComponent } from 'react';

import { useHudColor } from '../../Hud/hooks/useHudColor';
import { FORMAT_CURRENCY } from '../utils/format';

interface MoneyProps {
    amount: number;
    useColor?: boolean;
}

export const Money: FunctionComponent<MoneyProps> = ({ amount, useColor = true }) => {
    const { isDaltonism } = useHudColor();

    return (
        <>
            <span
                className={cn({
                    'text-[#AD1F1F]': useColor && !isDaltonism && amount <= 0,
                    'text-[#268116]': useColor && !isDaltonism && amount > 0,
                    'text-[#B314E8]': useColor && isDaltonism && amount <= 0,
                    'text-[#00FFFF]': useColor && isDaltonism && amount > 0,
                })}
            >
                $
            </span>
            {amount?.toLocaleString('en-US', FORMAT_CURRENCY)}
        </>
    );
};
