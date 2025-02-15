import { TaxType } from '@public/shared/tax';
import { useCallback } from 'react';

import { RepositoryType } from '../../shared/repository';
import { useRepository } from './repository';

export const useGetPrice = () => {
    const taxRepository = useRepository(RepositoryType.Tax);

    return useCallback(
        (price: number, taxType: TaxType = null) => {
            if (!taxType) {
                return price;
            }

            const tax = taxRepository[taxType];
            const taxPercentage = (tax ? tax.value : 11) / 100;

            return Math.round(price + price * taxPercentage);
        },
        [taxRepository]
    );
};
