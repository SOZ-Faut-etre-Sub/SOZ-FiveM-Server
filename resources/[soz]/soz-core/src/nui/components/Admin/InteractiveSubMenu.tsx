import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { MenuContent, MenuItemCheckbox, MenuTitle, SubMenu } from '../Styleguide/Menu';

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
    const [displayOwners, setDisplayOwners] = useState<boolean>(false);
    const [displayPlayerNames, setDisplayPlayerNames] = useState<boolean>(false);
    const [displayPlayersOnMap, setDisplayPlayersOnMap] = useState<boolean>(false);

    useEffect(() => {
        if (state && state.displayOwners !== undefined) {
            setDisplayOwners(state.displayOwners);
        }
        if (state && state.displayPlayerNames !== undefined) {
            setDisplayPlayerNames(state.displayPlayerNames);
        }
        if (state && state.displayPlayersOnMap !== undefined) {
            setDisplayPlayersOnMap(state.displayPlayersOnMap);
        }
    });

    return (
        <SubMenu id="interactive">
            <MenuTitle banner={banner}>Des options à la carte</MenuTitle>
            <MenuContent>
                <MenuItemCheckbox
                    checked={displayOwners}
                    onChange={async value => {
                        setDisplayOwners(value);
                        updateState('interactive', 'displayOwners', value);
                        await fetchNui(NuiEvent.AdminToggleDisplayOwners);
                    }}
                >
                    Afficher les propriétaires
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    checked={displayPlayerNames}
                    onChange={async value => {
                        setDisplayPlayerNames(value);
                        updateState('interactive', 'displayPlayerNames', value);
                        await fetchNui(NuiEvent.AdminToggleDisplayPlayerNames);
                    }}
                >
                    Afficher les noms des joueurs
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    checked={displayPlayersOnMap}
                    onChange={async value => {
                        setDisplayPlayersOnMap(value);
                        updateState('interactive', 'displayPlayersOnMap', value);
                        await fetchNui(NuiEvent.AdminToggleDisplayPlayersOnMap);
                    }}
                >
                    Afficher les joueurs sur la carte
                </MenuItemCheckbox>
            </MenuContent>
        </SubMenu>
    );
};
