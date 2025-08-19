import { SozRole } from '@core/permissions';
import { __ } from '@headlessui/react/dist/types';
import { MeteorSubMenuState } from '@public/shared/admin/admin';
import { Music } from '@public/shared/audio';
import { FireType } from '@public/shared/fire';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import {
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuSubTitle,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type MeteorSubMenuProps = {
    permission: SozRole;
    state: MeteorSubMenuState;
};

export const MeteorSubMenu: FunctionComponent<MeteorSubMenuProps> = ({ permission, state }) => {
    const [waterLevel, setWaterLevel] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
        const timeoutId = setInterval(() => {
            fetchNui<__, [number, number]>(NuiEvent.AdminMenuOceanGetWaterLevel).then(data => setWaterLevel(data));
        }, 2000);

        // Cleanup function to clear the timeout if the component unmounts
        return () => {
            clearInterval(timeoutId);
            fetchNui(NuiEvent.AdminMenuPreviewFire, null);
        };
    }, []);

    return (
        <SubMenu id="meteor">
            <MenuTitle title={permission} />
            <MenuContent subtitle="Juste un rond ...">
                <MenuItemSelect
                    title={`Sirène`}
                    value={state.musics[Music.Siren]}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuMeteorMusic, { music: Music.Siren, value: index });
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
                    value={state.musics[Music.Chronos]}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuMeteorMusic, { music: Music.Chronos, value: index });
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
                    title={`Ambiance`}
                    value={state.musics[Music.Ambiance]}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuMeteorMusic, { music: Music.Ambiance, value: index });
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
                <MenuSubTitle>
                    Niveau de l'eau {waterLevel[0].toFixed(3)}/{waterLevel[1]}
                </MenuSubTitle>
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
                <MenuSubTitle>Tremblement de terre</MenuSubTitle>
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
                    value={state.musics[Music.SandStorm]}
                    titleWidth={50}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuMeteorMusic, { music: Music.SandStorm, value: index });
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
                <MenuSubTitle>FireStorm</MenuSubTitle>
                <MenuItemCheckbox
                    checked={state.tornado}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminMenuTornado, value);
                    }}
                >
                    Tornade
                </MenuItemCheckbox>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuTornadoMove);
                    }}
                >
                    Déplacer la tornade
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuFireStorm);
                    }}
                >
                    Cinematique
                </MenuItemButton>
                <MenuItemCheckbox
                    checked={state.firePropagation}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminMenuFirePropagation, value);
                    }}
                >
                    Propagation du feu
                </MenuItemCheckbox>
                <MenuItemSelect
                    title="Incendie"
                    initialValue={null}
                    onChange={async (_index, value) => {
                        await fetchNui(NuiEvent.AdminMenuPreviewFire, String(value));
                    }}
                    onConfirm={async (_index, value) => {
                        await fetchNui(NuiEvent.AdminMenuStartFire, String(value));
                    }}
                >
                    {[null, FireType.Small, FireType.Medium, FireType.Huge].map(value => (
                        <MenuItemSelectOption value={value} key={`fire_${value}`}>
                            {FireType[value]}
                        </MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemButton
                    onConfirm={() => fetchNui(NuiEvent.AdminMenuStopFire)}
                    description="Réduit petit à petit le volume de l'incendie jusqu'à extinction"
                >
                    Étouffer les incendies
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={() => fetchNui(NuiEvent.AdminMenuStopFire, true)}
                    description="Supprime tous les feux instantanément"
                >
                    Stopper les incendies
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={() => fetchNui(NuiEvent.AdminMenuFireRemoveModelSwap)}
                    description="Enlever les remplacements de modèles d'arbre"
                >
                    Enlever les remplacements de modèles d'arbre
                </MenuItemButton>

                <MenuItemSelect
                    title={`Music - Impact`}
                    value={state.musics[Music.Impact]}
                    titleWidth={50}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuMeteorMusic, { music: Music.Impact, value: index });
                    }}
                >
                    {Array(31)
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption value={index} key={`siren_${index}`}>
                                {index}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title={`Music - Dies Irae`}
                    value={state.musics[Music.DiesIrae]}
                    titleWidth={50}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuMeteorMusic, { music: Music.DiesIrae, value: index });
                    }}
                >
                    {Array(31)
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption value={index} key={`music_${index}`}>
                                {index}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title={`Music - Cinis`}
                    value={state.musics[Music.Cinis]}
                    titleWidth={50}
                    onConfirm={async index => {
                        await fetchNui(NuiEvent.AdminMenuMeteorMusic, { music: Music.Cinis, value: index });
                    }}
                >
                    {Array(31)
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption value={index} key={`music_${index}`}>
                                {index}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>

                <MenuSubTitle>Annonces</MenuSubTitle>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuEarthquakeFlash);
                    }}
                >
                    Tremblement de terre
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuSandstormFlash);
                    }}
                >
                    Tempête de sable
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuFloodFlash);
                    }}
                >
                    Inondation
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuFireFlash, false);
                    }}
                >
                    Incendie
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuTornadoFlash);
                    }}
                >
                    Tornade
                </MenuItemButton>

                <MenuSubTitle>What if</MenuSubTitle>

                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuWhatIfCinematic);
                    }}
                >
                    Cinématique
                </MenuItemButton>
            </MenuContent>
        </SubMenu>
    );
};
