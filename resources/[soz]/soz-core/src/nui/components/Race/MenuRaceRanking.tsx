import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle } from '@public/nui/components/Styleguide/Menu';
import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { RaceRankingInfo } from '@public/shared/race';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';

type MenuRaceRankingProps = {
    data: {
        id: number;
        name: string;
    };
};

function getDurationStr(ms: number) {
    const secs = ms / 1000;
    const timeMinutes = Math.floor(secs / 60.0);
    const timeMinutesStr = timeMinutes > 10 ? timeMinutes.toString() : '0' + timeMinutes.toString();
    const timeSeconds = secs - 60.0 * timeMinutes;
    const timeSecondsStr = timeSeconds > 10 ? timeSeconds.toFixed(3) : '0' + timeSeconds.toFixed(3);

    return timeMinutesStr + ':' + timeSecondsStr;
}

export const MenuRaceRank: FunctionComponent<MenuRaceRankingProps> = ({ data }) => {
    const [ranks, setRanks] = useState<RaceRankingInfo>({ ranks: [], max: 0 });
    const banner = 'https://cfx-nui-soz-core/public/images/banner/MenuRaceRank.webp';

    const fetch = useCallback(() => {
        fetchNui<any, RaceRankingInfo>(NuiEvent.RaceGetRanking, data.id).then(values => setRanks(values));
    }, [setRanks]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return (
        <Menu type={MenuType.RaceRank}>
            <MainMenu>
                <MenuTitle banner={banner}>{data.name}</MenuTitle>
                <MenuContent>
                    {ranks.ranks.map((rank, indexRank) => {
                        return (
                            <MenuItemButton key={'race_rank_' + indexRank}>
                                <div className="flex w-full">
                                    <span className="flex-none w-8">N°{indexRank + 1}</span>
                                    <span className="flex-auto w-16 text-center font-lato">
                                        {getDurationStr(rank.time)}
                                    </span>
                                    <span className="flex-auto w-32 text-right">{rank.name}</span>
                                </div>
                            </MenuItemButton>
                        );
                    })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
