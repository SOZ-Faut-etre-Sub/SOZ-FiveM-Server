import cn from 'classnames';

import { useConfig } from '../../../hooks/usePhone';

const Divider = () => {
    const config = useConfig();

    return (
        <div
            className={cn(
                [
                    {
                        'border-gray-100': config.theme.value === 'dark',
                        'border-gray-700/30': config.theme.value === 'light',
                    },
                ],
                'border-t w-full mt-4 mb-4'
            )}
        />
    );
};

export default Divider;
