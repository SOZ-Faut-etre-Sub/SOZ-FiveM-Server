import classnames from 'classnames';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { PlayerData } from '../../../shared/player';
import { fetchNui } from '../../fetch';

export type MugshotProps = {
    player: PlayerData;
    containerClass?: string;
    mugshotClass?: string;
};

export const Mugshot: FunctionComponent<MugshotProps> = ({ player, containerClass, mugshotClass }) => {
    const [mugshot, setMugshot] = useState<string | null>(null);

    useEffect(() => {
        const getMugshot = async () => {
            const mugshot = await fetchNui<{ player: PlayerData }, string>(NuiEvent.PlayerGetMugshot, { player });
            setMugshot(mugshot);
        };

        getMugshot();
    }, []);

    return (
        <div
            className={classnames('bg-black flex justify-around items-end', containerClass, {
                'size-[150px]': !containerClass,
            })}
        >
            {mugshot && (
                <img
                    src={`https://nui-img/${mugshot}/${mugshot}`}
                    alt="Mugshot"
                    className={classnames(mugshotClass, {
                        'size-[130px]': !mugshotClass,
                    })}
                />
            )}
        </div>
    );
};
