import cn from 'classnames';
import { Link } from 'react-router-dom';

import { useConfig } from '../../../hooks/usePhone';
import getImg from '../utils/getImg';

export const TaxCard = ({ id, taxAmount }: { id: string; taxAmount: number }) => {
    const config = useConfig();

    return (
        <Link
            to={`tax/${id}?taxAmount=${taxAmount}`}
            className={cn(
                [
                    {
                        'bg-ios-700 text-gray-100 ': config.theme.value === 'dark',
                        'bg-white text-gray-700 ': config.theme.value === 'light',
                    },
                ],
                'transition-all flex flex-col justify-center items-center h-28 shadow-sm rounded-lg p-4 cursor-pointer hover:shadow-lg gap-2'
            )}
        >
            <img src={getImg(id)} alt="taxes" className="h-12" />
            <span className="font-semibold">{taxAmount}%</span>
        </Link>
    );
};
