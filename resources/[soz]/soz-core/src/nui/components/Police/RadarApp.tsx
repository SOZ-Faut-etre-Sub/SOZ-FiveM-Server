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

    return (
        <div
            style={{
                backgroundImage: `url(/public/images/police/zadar.png)`,
                width: '342px',
                height: '418px',
                top: '50px',
                right: '20px',
                position: 'absolute',
            }}
            className="font-mono font-thin tracking-tight text-lg relative bg-contain bg-no-repeat"
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
