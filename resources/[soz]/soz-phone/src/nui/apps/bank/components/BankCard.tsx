import { TextDefiling } from '@ui/components/TextDefiling';
import React, { memo } from 'react';

import card from '../assets/carte_de_credit_soz.png';

type Props = {
    name: string;
    account: string;
};

export const BankCard = memo(({ name, account }: Props) => {
    return (
        <div className="relative px-5">
            <h2 className="absolute bottom-20 left-12 card-text text-[#4fd954] text-center text-2xl">
                {account.replace(/([A-Z\d]{4})/g, '$1 ')}
            </h2>
            <h3 className="w-3/4 absolute bottom-4 left-12 card-text text-white text-2xl truncate group">
                <TextDefiling text={name} maxLength={23}></TextDefiling>
            </h3>
            <img src={card} alt="" />
        </div>
    );
});
