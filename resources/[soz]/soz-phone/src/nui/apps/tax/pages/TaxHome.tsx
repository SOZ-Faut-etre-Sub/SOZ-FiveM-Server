import cn from 'classnames';
import {memo, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../../../store';
import WhatIsTaxBtn from '../../../../../../soz-core/src/nui/components/Phone/apps/tax/components/buttons/WhatIsTaxBtn';
import Header from '../../../../../../soz-core/src/nui/components/Phone/apps/tax/components/Header';
import {TaxesList} from '../../../../../../soz-core/src/nui/components/Phone/apps/tax/components/TaxesList';
import {defaultTaxes} from '../utils/constants';

export const TaxHome = memo(() => {
    const taxes = useSelector((state: RootState) => state.appTax) || defaultTaxes;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch.appTax.loadTaxes();
    }, []);

    return (
        <div className={cn('w-full h-full flex flex-col m-auto')}>
            <Header divider={true}/>
            <WhatIsTaxBtn/>
            <TaxesList taxes={taxes}/>
        </div>
    );
});
