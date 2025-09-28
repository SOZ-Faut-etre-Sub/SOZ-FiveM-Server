import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
} from '@public/nui/components/Styleguide/Menu';
import { fetchNui } from '@public/nui/fetch';
import { PetJobKennelMenuData } from '@public/shared/animal';
import { NuiEvent } from '@public/shared/event/nui';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent } from 'react';

type PetJobKennelMenuProps = {
    data: PetJobKennelMenuData;
};

export const PetJobKennelMenu: FunctionComponent<PetJobKennelMenuProps> = ({ data }) => {
    return (
        <Menu type={MenuType.PetJobKennel}>
            <MainMenu>
                <MenuTitle title="Chenil d'entreprise" />
                <MenuContent>
                    {data.pets.map(
                        pet =>
                            (pet.available || pet.withPlayer) && (
                                <MenuItemSelect
                                    title={pet.name || `Animal sans nom`}
                                    onConfirm={async (_, value) => {
                                        if (!value) return;
                                        await fetchNui(NuiEvent.PetKennelAction, { pet, action: value });
                                    }}
                                >
                                    {pet.available && (
                                        <MenuItemSelectOption key={'action_take'} value="take">
                                            Prendre l'animal
                                        </MenuItemSelectOption>
                                    )}
                                    {pet.withPlayer && (
                                        <MenuItemSelectOption key={'action_remove'} value="remove">
                                            Déposer l'animal
                                        </MenuItemSelectOption>
                                    )}
                                    {pet.available && (
                                        <MenuItemSelectOption key={'action_abondon'} value="abandon">
                                            Abandonner l'animal
                                        </MenuItemSelectOption>
                                    )}
                                </MenuItemSelect>
                            )
                    )}
                    {data.pets.map(
                        pet =>
                            !pet.available &&
                            !pet.withPlayer && (
                                <MenuItemSelect
                                    title={pet.name || `Animal sans nom`}
                                    onConfirm={async (_, value) => {
                                        if (!value) return;
                                        await fetchNui(NuiEvent.PetKennelAction, { pet, action: value });
                                    }}
                                >
                                    <MenuItemSelectOption key={'action_recall'} value="recall">
                                        Rappeler l'animal
                                    </MenuItemSelectOption>
                                </MenuItemSelect>
                            )
                    )}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
