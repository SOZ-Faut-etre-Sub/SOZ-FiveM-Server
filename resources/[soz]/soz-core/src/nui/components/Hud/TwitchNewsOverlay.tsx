import { FunctionComponent, useState } from 'react';

import { useNuiEvent } from '../../hook/nui';

export const TwitchNewsOverlay: FunctionComponent = () => {
    const [display, setDisplay] = useState<boolean>(false);

    useNuiEvent('hud', 'SetTwitchNewsOverlay', setDisplay);

    if (!display) return null;

    return (
        <div className="absolute bottom-[3vh] right-[5vh] width-[30vw] z-20 text-right">
            <img src="/public/images/twitch-news/logo.webp" alt="TN logo" />
        </div>
    );
};
