import { JobType } from '@public/shared/job';
import { JobRegistry } from '@public/shared/job/config';
import { FunctionComponent, useState } from 'react';

import { SozRole } from '../../../core/permissions';
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

export type CeremonySubMenuProps = {
    permission: SozRole;
    state: {
        disableNpc: boolean;
    };
};

export const CeremonySubMenu: FunctionComponent<CeremonySubMenuProps> = ({ permission, state }) => {
    const [volume, setVolume] = useState<number>(10);

    return (
        <SubMenu id="ceremony">
            <MenuTitle title={permission} />
            <MenuContent subtitle="Cérémonie">
                <MenuItemCheckbox
                    checked={state.disableNpc}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminMenuMeteorDisableNpc, value);
                    }}
                >
                    Désactiver le spawn de PNJ
                </MenuItemCheckbox>
                <MenuItemSelect
                    title={`Forcer l'heure`}
                    value={-1}
                    onConfirm={async (index, value) => {
                        await fetchNui(NuiEvent.AdminMenuCeremonyTime, { value: value === -1 ? null : value });
                    }}
                >
                    <MenuItemSelectOption value={-1} key={`time_${-1}`}>
                        Reset
                    </MenuItemSelectOption>
                    {Array(24)
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption value={index} key={`time_${index}`}>
                                {index}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>

                <MenuSubTitle>Cérémonie parade</MenuSubTitle>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuCeremonyParadeStart, true);
                    }}
                >
                    Lancer la parade
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuCeremonyParadeStart, false);
                    }}
                >
                    Arreter la parade
                </MenuItemButton>
                <MenuItemSelect
                    title={`Annonce`}
                    onConfirm={async (index, value) => {
                        await fetchNui(NuiEvent.AdminMenuCeremonyParadeSound, { type: value, volume });
                    }}
                >
                    {[JobType.LSPD, JobType.BCSO, JobType.SASP, JobType.LSMC, JobType.CashTransfer].map(value => (
                        <MenuItemSelectOption value={value} key={`sound_${value}`}>
                            {JobRegistry[value].platePrefix}
                        </MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title={`Volume annonce`}
                    onChange={async index => {
                        setVolume(index + 1);
                    }}
                >
                    {Array(10)
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption value={index} key={`volume_${index}`}>
                                {index + 1}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>

                <MenuSubTitle>Cérémonie jeux de lumière</MenuSubTitle>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuPublicCeremonyStart);
                    }}
                >
                    Lumière sur les bâtiments publics
                </MenuItemButton>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuFinalCeremonyStart);
                    }}
                >
                    Lumière sur la ville
                </MenuItemButton>
            </MenuContent>
        </SubMenu>
    );
};
