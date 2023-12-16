import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';

import { PlayerCloakroomItem } from '../../../shared/cloth';
import { NuiEvent } from '../../../shared/event/nui';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
} from '../Styleguide/Menu';

type HousingCloakroomMenuProps = {
    data?: {
        items: PlayerCloakroomItem[];
    };
};

export const HousingCloakroomMenu: FunctionComponent<HousingCloakroomMenuProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    return (
        <Menu type={MenuType.HousingCloakroomMenu}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_habitation"></MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.HousingCloakroomSave, {});
                        }}
                    >
                        Sauvegarder la tenue
                    </MenuItemButton>
                    {data.items.map(item => {
                        return (
                            <MenuItemSelect
                                onConfirm={(index, value) => {
                                    if (value === 'apply') {
                                        fetchNui(NuiEvent.HousingCloakroomApply, {
                                            item: item,
                                        });
                                    }

                                    if (value === 'rename') {
                                        fetchNui(NuiEvent.HousingCloakroomRename, {
                                            item: item,
                                        });
                                    }

                                    if (value === 'delete') {
                                        fetchNui(NuiEvent.HousingCloakroomDelete, {
                                            item: item,
                                        });
                                    }
                                }}
                                title={item.name}
                                key={item.id}
                            >
                                <MenuItemSelectOption value="apply">Se changer</MenuItemSelectOption>
                                <MenuItemSelectOption value="rename">Renommer</MenuItemSelectOption>
                                <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                            </MenuItemSelect>
                        );
                    })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
