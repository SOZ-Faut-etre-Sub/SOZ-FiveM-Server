import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { MenuContent, MenuItemButton, MenuTitle, SubMenu } from '../Styleguide/Menu';

export type CeremonySubMenuProps = {
    banner: string;
};

export const CeremonySubMenu: FunctionComponent<CeremonySubMenuProps> = ({ banner }) => {
    return (
        <SubMenu id="ceremony">
            <MenuTitle banner={banner}>Cérémonie</MenuTitle>
            <MenuContent>
                {/*<MenuItemCheckbox*/}
                {/*    checked={state.disableNpc}*/}
                {/*    onChange={async value => {*/}
                {/*        await fetchNui(NuiEvent.AdminMenuMeteorDisableNpc, value);*/}
                {/*    }}*/}
                {/*>*/}
                {/*    Désactiver le spawn de PNJ*/}
                {/*</MenuItemCheckbox>*/}
                <MenuTitle>Election 2024</MenuTitle>
                <MenuItemButton
                    onConfirm={async () => {
                        await fetchNui(NuiEvent.AdminMenuCeremonyStart, false);
                    }}
                >
                    Lancer la cérémonie
                </MenuItemButton>
            </MenuContent>
        </SubMenu>
    );
};
