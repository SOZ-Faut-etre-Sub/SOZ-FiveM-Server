import cn from 'classnames';
import { Link } from 'react-router-dom';

import { useConfig } from '../../../../hooks/usePhone';

const WhatIsTaxBtn = () => {
    const config = useConfig();
    return (
        <Link
            to={'whatIs'}
            className={cn([
                {
                    'bg-ios-700 text-gray-100 ': config.theme.value === 'dark',
                    'bg-white text-gray-700 ': config.theme.value === 'light',
                },
                'transition-all hover:shadow-lg h-14 shadow-sm rounded-lg p-4 cursor-pointer flex justify-center gap-4 items-center',
            ])}
        >
            <img src={'media/taxApp/question.webp'} alt="taxes" className="h-8" />
            <span className={'font-semibold'}>Les taxes, c&apos;est quoi?</span>
        </Link>
    );
};

export default WhatIsTaxBtn;
