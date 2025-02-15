import { TaxType } from '@public/shared/tax';
import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { RepositoryType } from '../../../../../../shared/repository';
import { useAssetPath } from '../../../../../hook/assets';
import { useRepository } from '../../../../../hook/repository';
import { useThemeConfig } from '../../../system/config/config.atom';
import { TaxesDescription } from '../constants';

interface TaxRowProps {
    id: TaxType;
}

export const TaxRow: FunctionComponent<TaxRowProps> = ({ id }) => {
    const theme = useThemeConfig();
    const { getPath } = useAssetPath();

    const taxes = useRepository(RepositoryType.Tax);
    const tax = taxes[id] ?? { id, value: 11 };
    const taxDescription = TaxesDescription[id];

    return (
        <Link
            to={`tax/${id}`}
            className={clsx(
                [
                    {
                        'bg-ios-700 text-gray-100 ': theme === 'dark',
                        'bg-white text-gray-700 ': theme === 'light',
                    },
                ],
                'flex items-center shadow-sm rounded-lg p-4 cursor-pointer hover:shadow gap-3'
            )}
        >
            <img src={getPath(`images/phone/apps/tax/icon/${id}.webp`)} alt="taxes" className="h-12" />
            <h2 className="font-semibold grow">{taxDescription.title}</h2>
            <span className="font-semibold">{tax.value}%</span>
        </Link>
    );
};
