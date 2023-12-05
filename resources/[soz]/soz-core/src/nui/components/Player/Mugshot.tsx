import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { PlayerData } from '../../../shared/player';
import { fetchNui } from '../../fetch';

export type MugshotProps = {
    player: PlayerData;
};

export const Mugshot: FunctionComponent<MugshotProps> = ({ player }) => {
    const [mugshot, setMugshot] = useState<string | null>(null);

    useEffect(() => {
        const getMugshot = async () => {
            const mugshot = await fetchNui<{ player: PlayerData }, string>(NuiEvent.PlayerGetMugshot, { player });
            setMugshot(mugshot);
        };

        getMugshot();
    }, []);

    return (
        <div className="bg-black w-[150px] h-[150px] flex justify-around items-end">
            {mugshot && (
                <img src={`https://nui-img/${mugshot}/${mugshot}`} alt="Mugshot" className=" w-[130px] h-[130px]" />
            )}
        </div>
    );
};
