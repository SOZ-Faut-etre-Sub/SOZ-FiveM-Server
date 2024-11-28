import { FunctionComponent, useState } from 'react';

import { useNuiEvent } from '../../hook/nui';

export const WeatherOverlay: FunctionComponent = () => {
    const [icon, setIcon] = useState<string>(null);
    useNuiEvent('weather', 'icon', setIcon);

    if (!icon) {
        return null;
    }

    return (
        <div className="fixed items-center justify-center flex w-full bottom-[6rem] text-white/75">
            <div className="breathing-icon-container items-center justify-center flex">
                <img
                    className="w-12 h-12 breathing-icon"
                    src={`https://soz.zerator.com/static/game/images/hud/weather/${icon}.webp`}
                />
                <div className="breathing-icon-shadow"></div>
            </div>
        </div>
    );
};
