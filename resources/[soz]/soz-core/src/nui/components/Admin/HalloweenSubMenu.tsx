import { fetchNui } from '@public/nui/fetch';
import { HalloweenSubMenuState } from '@public/shared/admin/admin';
import { NuiEvent } from '@public/shared/event/nui';
import { VampireGameCollection, VampireGameCollectionLabel } from '@public/shared/halloween';
import { FunctionComponent } from 'react';

import { MenuContent, MenuItemButton, MenuTitle, SubMenu } from '../Styleguide/Menu';

export type MeteorSubMenuProps = {
    banner: string;
    state: HalloweenSubMenuState;
};

export const HalloweenSubMenu: FunctionComponent<MeteorSubMenuProps> = ({ banner, state }) => {
    return (
        <SubMenu id="halloween">
            <MenuTitle banner={banner}>Bouh !!!</MenuTitle>
            <MenuContent>
                <MenuItemButton
                    disabled={state.started}
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuHalloweenLaunchGame);
                    }}
                >
                    Lancement du jeu
                </MenuItemButton>
                <MenuItemButton
                    disabled={!state.started}
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuHalloweenStopGame);
                    }}
                >
                    Arrêt du jeu
                </MenuItemButton>

                <MenuTitle>Rôles</MenuTitle>
                {Object.entries(state.roleMaxNumber).map(([role, amount]) => (
                    <MenuItemButton
                        key={role}
                        description={`Nombre maximum de ${role}`}
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuHalloweenUpdateRole, role);
                        }}
                    >
                        <div className="pr-2 flex items-center justify-between">
                            <span>{role}</span>
                            <span>{amount}</span>
                        </div>
                    </MenuItemButton>
                ))}

                <MenuTitle>Objectif des mortels</MenuTitle>
                {Object.entries(state.mortalObjective).map(([collection, amount]) => (
                    <MenuItemButton
                        key={collection}
                        description={`Props pour l'action: ${VampireGameCollectionLabel(collection as VampireGameCollection)}`}
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminMenuHalloweenUpdateMortalCollection, collection);
                        }}
                    >
                        <div className="pr-2 flex items-center justify-between">
                            <span>{collection}</span>
                            <span>{amount}</span>
                        </div>
                    </MenuItemButton>
                ))}
            </MenuContent>
        </SubMenu>
    );
};
