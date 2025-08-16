import { useNuiEvent } from '@public/nui/hook/nui';
import { FunctionComponent, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { AskInput } from '../../../shared/nui/input';
import { MenuType } from '../../../shared/nui/menu';
import {
    HammerProp,
    WHAT_IF_PROP_LIST,
    WHAT_IF_PROP_SPECIAL_COST,
    WhatIf2HammerZoneConfig,
} from '../../../shared/whatif';
import { fetchNui } from '../../fetch';
import { useBackspace } from '../../hook/control';
import { useItem, usePlayer } from '../../hook/data';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuSubTitle,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export const MenuWhatIfHammer: FunctionComponent<{ data: HammerProp[] }> = ({ data }) => {
    const [currentSearch, setCurrentSearch] = useState<string>(null);
    const player = usePlayer();
    const [props, setProps] = useState<HammerProp[]>(data);

    useNuiEvent('whatif', 'hammer_props', setProps);

    const item = useItem('whatif_parts');

    useBackspace(() => fetchNui(NuiEvent.WhatIfHammerSelectPropToRemove));

    return (
        <Menu type={MenuType.WhatIfHammer}>
            <MainMenu>
                <MenuTitle title="Edition de zone" />
                <MenuContent subtitle={player.charinfo.firstname + ' ' + player.charinfo.lastname}>
                    <MenuItemSubMenuLink id={`zone_prop_choose`}>➕ Ajouter un prop</MenuItemSubMenuLink>
                    <MenuItemText>
                        <div className="pr-2 flex items-center justify-between">
                            <span> Nombre de props </span>
                            <span>{data.length}</span>
                        </div>
                    </MenuItemText>
                    <MenuSubTitle>Liste des props</MenuSubTitle>
                    {props.map(({ id, model }) => {
                        return (
                            <MenuItemSelect
                                key={id}
                                title={model}
                                titleWidth={60}
                                onSelected={async () => {
                                    await fetchNui(NuiEvent.WhatIfHammerSelectPlacedProp, id);
                                }}
                                onConfirm={async (_, value) => {
                                    switch (value) {
                                        case 'delete':
                                            await fetchNui(NuiEvent.WhatIfHammerRequestDeleteProp, id);
                                            break;
                                        case 'edit':
                                            await fetchNui(NuiEvent.WhatIfHammerChoosePlacedPropToEdit, id);
                                            break;
                                        case 'duplicate':
                                            await fetchNui(NuiEvent.WhatIfHammerChoosePropToCreate, model);
                                            break;
                                    }
                                }}
                            >
                                <MenuItemSelectOption value="edit">Editer</MenuItemSelectOption>
                                <MenuItemSelectOption value="duplicate">Dupliquer</MenuItemSelectOption>
                                <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                            </MenuItemSelect>
                        );
                    })}
                </MenuContent>
            </MainMenu>

            <SubMenu id="zone_prop_choose">
                <MenuTitle title="Edition de zone" />
                <MenuContent subtitle="Choisir un prop">
                    <MenuItemSubMenuLink id={`zone_prop_search`}>🔎 Rechercher un prop</MenuItemSubMenuLink>
                    <MenuSubTitle>Liste de props</MenuSubTitle>
                    {Object.keys(WHAT_IF_PROP_LIST)
                        .sort((a, b) => a.localeCompare(b))
                        .map(propCategory => (
                            <MenuItemSubMenuLink key={propCategory} id={`zone_prop_choose/${propCategory}`}>
                                {propCategory}
                            </MenuItemSubMenuLink>
                        ))}
                </MenuContent>
            </SubMenu>

            <SubMenu id="zone_prop_search">
                <MenuTitle title="Edition de zone" />
                <MenuContent subtitle="Rechercher un prop">
                    <MenuItemButton
                        onConfirm={async () => {
                            const askInput: AskInput = {
                                title: 'Nom du modèle',
                            };
                            fetchNui<any, string>(NuiEvent.AskInput, askInput).then(input => setCurrentSearch(input));
                        }}
                    >
                        🔎: {currentSearch || 'Entrer un modèle'}
                    </MenuItemButton>
                    <MenuSubTitle>Resultats</MenuSubTitle>
                    {currentSearch &&
                        Object.keys(WHAT_IF_PROP_LIST).map(propCategory =>
                            WHAT_IF_PROP_LIST[propCategory]
                                .filter(prop => prop.label.toLowerCase().includes(currentSearch.toLowerCase()))
                                .sort((a, b) => a.label.localeCompare(b.label))
                                .map(prop => (
                                    <MenuItemButton
                                        key={prop.model}
                                        onSelected={() => fetchNui(NuiEvent.WhatIfHammerSelectPropToCreate, prop.model)}
                                        onConfirm={() => fetchNui(NuiEvent.WhatIfHammerChoosePropToCreate, prop.model)}
                                        description={`${WHAT_IF_PROP_SPECIAL_COST[prop.model] ?? WhatIf2HammerZoneConfig.price + ' ' + item.label}`}
                                    >
                                        {prop.label}
                                    </MenuItemButton>
                                ))
                        )}
                </MenuContent>
            </SubMenu>

            {Object.keys(WHAT_IF_PROP_LIST).map(propCategory => (
                <SubMenu key={propCategory} id={`zone_prop_choose/${propCategory}`}>
                    <MenuTitle title="Edition de zone" />
                    <MenuContent subtitle={propCategory}>
                        {WHAT_IF_PROP_LIST[propCategory]
                            .sort((a, b) => a.label.localeCompare(b.label))
                            .map(prop => (
                                <MenuItemButton
                                    key={prop.model}
                                    onSelected={() => fetchNui(NuiEvent.WhatIfHammerSelectPropToCreate, prop.model)}
                                    onConfirm={() => fetchNui(NuiEvent.WhatIfHammerChoosePropToCreate, prop.model)}
                                    description={`${WHAT_IF_PROP_SPECIAL_COST[prop.model] ?? WhatIf2HammerZoneConfig.price} ${item.label}`}
                                >
                                    {prop.label}
                                </MenuItemButton>
                            ))}
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};
