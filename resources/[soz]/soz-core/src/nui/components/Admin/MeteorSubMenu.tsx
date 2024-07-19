import { __ } from '@headlessui/react/dist/types';
import { MeteorSubMenuState } from '@public/shared/admin/admin';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import {
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type MeteorSubMenuProps = {
    banner: string;
    state: MeteorSubMenuState;
};

export const MeteorSubMenu: FunctionComponent<MeteorSubMenuProps> = ({ banner, state }) => {
    const [waterLevel, setWaterLevel] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
        const timeoutId = setInterval(() => {
            fetchNui<__, [number, number]>(NuiEvent.AdminMenuOceanGetWaterLevel).then(data => setWaterLevel(data));
        }, 2000);

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearInterval(timeoutId);
    }, []);

    return (
        <SubMenu id="meteor">
            <MenuTitle banner={banner}>Juste un rond ...</MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title={`Sirène`}
                    value={state.siren}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuMeteorSiren, index);
                    }}
                >
                    {Array(11)
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption value={index} key={`siren_${index}`}>
                                {index}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title={`Chonos`}
                    value={state.music}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuMeteorChronosMusic, index);
                    }}
                >
                    {Array(11)
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption value={index} key={`music_${index}`}>
                                {index}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title={`Musique`}
                    value={state.music}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuMeteorMusic, index);
                    }}
                >
                    {Array(11)
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption value={index} key={`music_${index}`}>
                                {index}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuMeteorActivate);
                    }}
                >
                    Lancement du Météore
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuMeteorKickPlayers);
                    }}
                >
                    Expulser les joueurs
                </MenuItemButton>
                <MenuItemCheckbox
                    checked={state.disableNpc}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminMenuMeteorDisableNpc, value);
                    }}
                >
                    Désactiver le spawn de PNJ
                </MenuItemCheckbox>
                <MenuTitle>
                    Niveau de l'eau {waterLevel[0].toFixed(3)}/{waterLevel[1]}
                </MenuTitle>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuOceanSetWaterLevel, false);
                    }}
                >
                    Changer niveau de l'eau progressivement
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuOceanSetWaterLevel, true);
                    }}
                >
                    Changer niveau de l'eau instantanément
                </MenuItemButton>
                <MenuItemCheckbox
                    checked={state.highWave}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminMenuOceanSetHighWave, value);
                    }}
                >
                    Grosses vagues
                </MenuItemCheckbox>
                <MenuTitle>Tremblement de terre</MenuTitle>
                <MenuItemCheckbox
                    checked={state.earthQuake}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminMenuEarthquake, value);
                    }}
                >
                    Tremblement de terre
                </MenuItemCheckbox>
                <MenuItemSelect
                    title={`Tempête de Sable`}
                    value={state.siren}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuSandstormMusic, index);
                    }}
                >
                    {Array(11)
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption value={index} key={`sandstorm_${index}`}>
                                {index}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>
            </MenuContent>
        </SubMenu>
    );
};
