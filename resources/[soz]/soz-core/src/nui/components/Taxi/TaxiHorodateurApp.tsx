import { RootState } from '@public/nui/store';
import { HoradateurData, HorodateurTarif } from '@public/shared/job/cjr';
import cn from 'classnames';
import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';

import { useNuiEvent } from '../../hook/nui';

export const TaxiHorodateurApp: FunctionComponent = () => {
    const status = useSelector((state: RootState) => state.taxi);
    const [data, setData] = useState<HoradateurData>(null);

    useNuiEvent(
        'taxi',
        'updateHoradateur',
        data => {
            setData(data);
        },
        [setData, data]
    );

    if (!status.horodateurDisplayed) {
        return null;
    }

    return (
        <div
            className="absolute bottom-5 right-5 font-lato"
            style={{
                backgroundImage: `url(/public/images/taxi/Brouznouf_Z7_.png)`,
                width: '560px',
                height: '279px',
            }}
        >
            <span className="absolute font-semibold text-[3.5rem] top-[35px] right-24 float-right text-green-500">
                $ {data?.tarif.toFixed(2) || '0.00'}
            </span>
            <span className="absolute font-medium top-[110px] right-24 float-right text-white">Prix Total $</span>

            <span className="absolute font-semibold text-[3.5rem] top-[125px] right-24 float-right text-yellow-500">
                {data?.distance.toFixed(1) || '0.0'} Km
            </span>
            <span className="absolute font-medium top-[200px] right-24 float-right text-white">Distance Total</span>

            <span className="absolute font-semibold text-[3.5rem] top-[125px] right-80 float-right text-blue-500">
                $ {HorodateurTarif.toFixed(2)}
            </span>
            <span className="absolute font-medium top-[200px] right-80 float-right text-white">Prix p/ 100m</span>

            <div
                className={cn('absolute top-[72px] left-[52px] rounded-0.8 transition-colors', {
                    'text-red-500': !status.horodateurStarted,
                    'text-green-500': status.horodateurStarted,
                })}
            >
                <p className="text-center text-3xl leading-8 font-bold font-sans">
                    {status.horodateurStarted ? 'Start' : 'Stop'}
                </p>
            </div>
        </div>
    );
};
