import { Taxes } from '@typings/app/tax';

import { TaxCard } from './TaxCard';

export const TaxesList = ({ taxes }: { taxes: Taxes }) => {
    return (
        <div className="grid grid-cols-2 gap-3 mt-8">
            {Object.values(taxes).map((tax, index) => (
                <TaxCard id={tax.id} key={index} taxAmount={tax.value} />
            ))}
        </div>
    );
};
