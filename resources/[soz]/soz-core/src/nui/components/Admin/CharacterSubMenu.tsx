import { PlayerCharInfo } from '@public/shared/player';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import {
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type CharacterSubMenuProps = {
    banner: string;
    characters: Record<string, PlayerCharInfo>;
};

export const CharacterSubMenu: FunctionComponent<CharacterSubMenuProps> = ({ characters, banner }) => {
    const player = usePlayer();

    if (!player) {
        return null;
    }

    return (
        <SubMenu id="character">
            <MenuTitle banner={banner}>L'homme au mille visages</MenuTitle>
            <MenuContent>
                {Object.keys(characters).length > 0 && (
                    <MenuItemSelect
                        onConfirm={async (index, value) => {
                            await fetchNui(NuiEvent.AdminMenuCharacterSwitch, value);
                        }}
                        title="Changer de personnage"
                    >
                        {Object.keys(characters).map(citizenId => (
                            <MenuItemSelectOption key={citizenId} value={citizenId}>
                                {characters[citizenId].firstname} {characters[citizenId].lastname}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                )}
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuCharacterCreateNew);
                    }}
                >
                    Créer nouveau personnage
                </MenuItemButton>
            </MenuContent>
        </SubMenu>
    );
};
