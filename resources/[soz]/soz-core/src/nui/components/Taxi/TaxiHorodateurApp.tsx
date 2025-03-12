import { useAssetPath } from '@public/nui/hook/assets';
import { RootState } from '@public/nui/store';
import { HoradateurData, HorodateurTarif } from '@public/shared/job/cjr';
import cn from 'classnames';
import { FunctionComponent, useState } from 'react';
import { useSelector } from 'react-redux';

import { useNuiEvent } from '../../hook/nui';

export const TaxiHorodateurApp: FunctionComponent = () => {
    const status = useSelector((state: RootState) => state.taxi);
    const [data, setData] = useState<HoradateurData>(null);
    const { getPath } = useAssetPath();

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

    let rightOffset = 'right-5';
    if (
        (window.innerWidth > 5000 && window.innerHeight < 1500) ||
        (window.innerWidth > 3079 && window.innerHeight < 1200)
    ) {
        rightOffset = 'right-[94vh]';
    }

    return (
        <div
            className={`${rightOffset} absolute bottom-[8vh] right-5 font-lato`}
            style={{
                backgroundImage: `url(${getPath(`images/taxi/Brouznouf_Z7_.webp`)})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                width: '45vh',
                height: '23vh',
            }}
        >
            <span className="absolute font-semibold text-[4.5vh] top-[3vh] right-[9vh] float-right text-green-500">
                $ {data?.tarif.toFixed(2) || '0.00'}
            </span>
            <span className="absolute font-medium top-[8.5vh] right-[9vh] float-right text-white">Prix Total $</span>

            <span className="absolute font-semibold text-[4vh] top-[10.8vh] right-[9vh] float-right text-yellow-500">
                {data?.distance.toFixed(1) || '0.0'} Km
            </span>
            <span className="absolute font-medium top-[16vh] right-[9vh] float-right text-white">Distance Total</span>

            <span className="absolute font-semibold text-[4vh] top-[10.8vh] right-[27vh] float-right text-blue-500">
                $ {HorodateurTarif.toFixed(2)}
            </span>
            <span className="absolute font-medium top-[16vh] right-[27vh] float-right text-white">Prix p/ 100m</span>

            <div
                className={cn('absolute top-[5.5vh] right-[35vh] rounded-0.8 transition-colors', {
                    'text-red-500': !status.horodateurStarted,
                    'text-green-500': status.horodateurStarted,
                })}
            >
                <p className="text-center text-[2.5vh] leading-8 font-bold font-sans">
                    {status.horodateurStarted ? 'Start' : 'Stop'}
                </p>
            </div>
        </div>
    );
};
