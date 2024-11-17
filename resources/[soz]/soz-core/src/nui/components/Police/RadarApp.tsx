import { FunctionComponent, useState } from 'react';

import { useNuiEvent } from '../../hook/nui';

export const RadarApp: FunctionComponent = () => {
    const [speed, setSpeed] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    useNuiEvent('police', 'SetRadarOpen', setOpen);

    useNuiEvent('police', 'UpdateRadar', speed => {
        setSpeed(speed);
    });

    if (!open) {
        return;
    }

    let rightOffset = 'right-8';
    if (
        (window.innerWidth > 5000 && window.innerHeight < 1500) ||
        (window.innerWidth > 3079 && window.innerHeight < 1200)
    ) {
        rightOffset = 'right-[94vh]';
    }

    return (
        <div
            style={{
                backgroundImage: `url(https://soz.zerator.com/static/game/images/police/zadar.webp)`,
                width: '342px',
                height: '418px',
                top: '50px',
                position: 'absolute',
            }}
            className={`${rightOffset} font-mono font-thin tracking-tight text-lg relative bg-contain bg-no-repeat`}
        >
            <div
                style={{
                    paddingTop: '90px',
                    paddingLeft: 'auto',
                    paddingRight: 'auto',
                }}
                className="text-green-500 text-center"
            >
                {speed ? speed : '- RECHERCHE EN COURS -'}
            </div>
        </div>
    );
};
