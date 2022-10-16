import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import {
    MenuContent,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type InteractiveSubMenuProps = {
    banner: string;
    updateState: (namespace: 'interactive', key: keyof InteractiveSubMenuProps['state'], value: any) => void;
    state: {
        displayOwners: boolean;
        displayPlayerNames: boolean;
        displayPlayersOnMap: boolean;
    };
};

export const InteractiveSubMenu: FunctionComponent<InteractiveSubMenuProps> = ({ banner, state, updateState }) => {
    return (
        <SubMenu id="interactive">
            <MenuTitle banner={banner}>Des options à la carte</MenuTitle>
            <MenuContent>
                <MenuItemCheckbox
                    checked={state.displayOwners}
                    onChange={async value => {
                        updateState('interactive', 'displayOwners', value);
                        await fetchNui(NuiEvent.AdminToggleDisplayOwners, value);
                    }}
                >
                    Afficher les propriétaires de véhicules
                </MenuItemCheckbox>
                <MenuItemSelect
                    title={'Afficher les noms des joueurs'}
                    onConfirm={async value => {
                        updateState('interactive', 'displayPlayerNames', !state.displayPlayerNames);
                        await fetchNui(NuiEvent.AdminToggleDisplayPlayerNames, {
                            value: !state.displayPlayerNames,
                            withDetails: value === 1,
                        });
                    }}
                >
                    <MenuItemSelectOption>Sans détails</MenuItemSelectOption>
                    <MenuItemSelectOption>Avec détails</MenuItemSelectOption>
                </MenuItemSelect>
                <MenuItemCheckbox
                    checked={state.displayPlayersOnMap}
                    onChange={async value => {
                        updateState('interactive', 'displayPlayersOnMap', value);
                        await fetchNui(NuiEvent.AdminToggleDisplayPlayersOnMap, value);
                    }}
                >
                    Afficher les joueurs sur la carte
                </MenuItemCheckbox>
            </MenuContent>
        </SubMenu>
    );
};
