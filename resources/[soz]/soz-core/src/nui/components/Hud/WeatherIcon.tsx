import { FunctionComponent, useState } from 'react';

import { useAssetPath } from '../../hook/assets';
import { useNuiEvent } from '../../hook/nui';

export const WeatherOverlay: FunctionComponent = () => {
    const [icon, setIcon] = useState<string>(null);
    const { getPath } = useAssetPath();

    useNuiEvent('weather', 'icon', setIcon);

    if (!icon) {
        return null;
    }

    return (
        <div className="fixed items-center justify-center flex w-full bottom-[6rem] text-white/75">
            <div className="breathing-icon-container items-center justify-center flex">
                <img className="w-12 h-12 breathing-icon" src={getPath(`images/hud/weather/${icon}.webp`)} />
                <div className="breathing-icon-shadow"></div>
            </div>
        </div>
    );
};
