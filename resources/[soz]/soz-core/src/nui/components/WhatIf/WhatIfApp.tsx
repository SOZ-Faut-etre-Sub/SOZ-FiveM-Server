import { FunctionComponent, useCallback, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { WhatIfGuild } from '../../../shared/whatif';
import { fetchNui } from '../../fetch';
import { useAssetPath } from '../../hook/assets';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';

export const WhatIfApp: FunctionComponent = () => {
    const [showApp, setShowApp] = useState<boolean>(false);

    useNuiFocus(showApp, showApp, false);

    useNuiEvent('whatif', 'OpenWelcomePage', setShowApp);

    if (!showApp) {
        return null;
    }

    return (
        <div className="absolute font-prompt flex flex-col gap-5 p-5 h-full w-full z-10 overflow-hidden bg-black/70">
            <h2 className="shrink-0 text-center text-white text-2xl">WHAT IF : AFTER THE END</h2>
            <div className="grow flex justify-center items-center gap-10 h-full">
                <ClanCard id="raider" title="Raiders" />
                <ClanCard id="warden" title="Wardens" />
            </div>
        </div>
    );
};

const ClanCard: FunctionComponent<{ id: WhatIfGuild; title: string }> = ({ id, title }) => {
    const handleOnClick = useCallback(() => fetchNui(NuiEvent.WhatIfSetGuild, id), [id]);
    const { getPath } = useAssetPath();

    return (
        <div className="relative group h-full w-full max-w-[50vh]">
            <h3 className="absolute top-5 z-10 w-full text-center text-4xl uppercase font-semibold text-white opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all ease-in-out duration-300">
                {title}
            </h3>

            <div className="flex justify-center w-full">
                <button
                    onClick={handleOnClick}
                    className="absolute bottom-5 z-10 w-[90%] text-2xl uppercase font-semibold border-4 py-4 border-white text-white hover:bg-white/30 transition-colors ease-in-out duration-300"
                >
                    Rejoindre
                </button>
            </div>

            <div
                className="bg-cover bg-center h-full w-full grayscale group-hover:grayscale-0 transition-all ease-in-out duration-300"
                style={{ backgroundImage: `url(${getPath('images/whatif/' + id + '.webp')})` }}
            />
        </div>
    );
};
