import { fetchNui } from '@public/nui/fetch';
import { useBackspace } from '@public/nui/hook/control';
import { usePlayer } from '@public/nui/hook/data';
import { useNuiEvent } from '@public/nui/hook/nui';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { PlacementProp, PropPlacementMenuData } from '@public/shared/nui/prop_placement';
import { PropClientData, PropCollection, PropCollectionData, PropServerData } from '@public/shared/object';
import { isOk, Result } from '@public/shared/result';
import { FunctionComponent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuPropPlacementProps = {
    data: PropPlacementMenuData;
};

export const MenuPropPlacement: FunctionComponent<MenuPropPlacementProps> = ({ data }) => {
    const player = usePlayer();
    const [collectionList, setCollectionList] = useState<PropCollectionData[]>(data.collections);
    const [serverData, setServerData] = useState<PropServerData>(data.serverData);
    const [clientData, setClientData] = useState<PropClientData>(data.clientData);
    const [collection, setCollection] = useState<PropCollection>({
        name: '',
        creator_citizenID: '',
        creation_date: new Date(),
        size: 0,
        loaded_size: 0,
        props: {},
    });
    const navigate = useNavigate();
    const location = useLocation();

    useNuiEvent('placement_prop', 'SetCollection', (collection: PropCollection) => {
        setCollection(collection);
    });
    useNuiEvent('placement_prop', 'SetCollectionList', (collectionList: PropCollectionData[]) => {
        setCollectionList(collectionList);
    });
    useNuiEvent('placement_prop', 'SetDatas', ({ serverData, clientData }) => {
        setServerData(serverData);
        setClientData(clientData);
    });
    useNuiEvent('placement_prop', 'EnterEditorMode', () => {
        navigate(`/${MenuType.PropPlacementMenu}/editor`, { state: { ...location.state, activeIndex: 0 } });
    });
    useBackspace(async () => {
        await fetchNui(NuiEvent.LeaveEditorMode);
        if (location.pathname == `/${MenuType.PropPlacementMenu}/collection`) {
            await fetchNui(NuiEvent.PropPlacementReturnToMainMenu);
        }
        if (location.pathname == `/${MenuType.PropPlacementMenu}/collection/props`) {
            await fetchNui(NuiEvent.PropPlacementReturnToCollection);
        }
    });

    if (!player) {
        return null;
    }

    const selectCollection = (collectionName: string) => {
        return async () => {
            const col = (await fetchNui(NuiEvent.SelectPlacementCollection, { collectionName })) as PropCollection;
            if (!col) {
                return;
            }
            setCollection(col);
            navigate(`/${MenuType.PropPlacementMenu}/collection`, { state: { ...location.state, activeIndex: 0 } });
        };
    };

    const onSelectedCreateProp = (selectedProp: PlacementProp) => {
        return async () => {
            await fetchNui(NuiEvent.SelectPropToCreate, { selectedProp });
        };
    };

    const onChooseCreateProp = (selectedProp: PlacementProp | null) => {
        return async () => {
            const result: Result<any, never> = await fetchNui(NuiEvent.ChoosePropToCreate, { selectedProp });
            if (isOk(result)) {
                navigate(`/${MenuType.PropPlacementMenu}/editor`, { state: { ...location.state, activeIndex: 0 } });
            }
        };
    };

    return (
        <Menu type={MenuType.PropPlacementMenu}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_mapper"></MenuTitle>
                <MenuContent>
                    <MenuTitle>
                        Charge du serveur : {serverData.loaded}/{serverData.total}
                    </MenuTitle>
                    <MenuTitle>Charge du client : {clientData.total}</MenuTitle>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.RequestCreatePropCollection);
                        }}
                    >
                        ➕ Créer une Collection
                    </MenuItemButton>
                    <MenuTitle>Collections :</MenuTitle>
                    {collectionList.map(collection => (
                        <MenuItemButton key={collection.name} onConfirm={selectCollection(collection.name)}>
                            <div className="pr-2 flex items-center justify-between">
                                <span>
                                    {collection.loaded_size == 0 || collection.loaded_size > collection.size
                                        ? '🔴'
                                        : collection.loaded_size < collection.size
                                        ? '🔵'
                                        : '🟢'}{' '}
                                    {collection.name}
                                </span>
                                <span>
                                    {collection.loaded_size}/{collection.size}
                                </span>
                            </div>
                        </MenuItemButton>
                    ))}
                </MenuContent>
            </MainMenu>

            <SubMenu id="collection">
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Collection : {collection.name}</MenuTitle>
                <MenuContent>
                    <MenuTitle>
                        Props chargés : {collection.loaded_size} / {collection.size}
                    </MenuTitle>
                    <MenuTitle>
                        Etat :{' '}
                        {collection.loaded_size == 0
                            ? '🔴 Déchargée'
                            : collection.loaded_size < collection.size
                            ? '🔵 Partiellement chargée'
                            : '🟢 Complètement chargée'}
                    </MenuTitle>
                    <MenuItemSubMenuLink id={`collection/props`}>
                        📝 Voir la liste des props de la collection
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id={`collection/prop_choose`}>➕ Ajouter un prop</MenuItemSubMenuLink>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.RequestToggleCollectionLoad, {
                                name: collection.name,
                                value: true,
                            });
                        }}
                    >
                        ⚡ Charger la collection
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.RequestToggleCollectionLoad, {
                                name: collection.name,
                                value: false,
                            });
                        }}
                    >
                        🌬️ Décharger la collection
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.RequestDeletePropCollection, { name: collection.name });
                            navigate(-1);
                        }}
                        description="Supprime la collection du serveur."
                    >
                        ❌ Supprimer la collection
                    </MenuItemButton>
                </MenuContent>
            </SubMenu>
            <SubMenu id="collection/props">
                <MenuTitle banner="https://nui-img/soz/menu_mapper">
                    Props de la collection : {collection.name}
                </MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        checked={false}
                        onChange={async value => {
                            await fetchNui(NuiEvent.ToggleMouseSelection, { value: value });
                        }}
                        description="Selectionner un prop à la souris."
                    >
                        Selectionner à la souris
                    </MenuItemCheckbox>
                    {Object.values(collection.props).map(prop => {
                        let label = null;
                        for (const cat of Object.values(data.props)) {
                            const item = cat.find(p => p.model == prop.model);
                            if (item) {
                                label = item.label;
                                break;
                            }
                        }
                        if (!label) {
                            label = prop.model;
                        }
                        return (
                            <MenuItemSelect
                                key={prop.unique_id}
                                title={label}
                                titleWidth={60}
                                onSelected={async () => {
                                    await fetchNui(NuiEvent.SelectPlacedProp, { id: prop.unique_id });
                                }}
                                onConfirm={async (_, value) => {
                                    if (value == 'delete') {
                                        await fetchNui(NuiEvent.RequestDeleteProp, { id: prop.unique_id });
                                    }
                                    if (value == 'edit') {
                                        const result: Result<any, never> = await fetchNui(
                                            NuiEvent.ChoosePlacedPropToEdit,
                                            {
                                                id: prop.unique_id,
                                            }
                                        );
                                        if (isOk(result)) {
                                            navigate(`/${MenuType.PropPlacementMenu}/editor`, {
                                                state: { ...location.state, activeIndex: 0 },
                                            });
                                        }
                                    }
                                }}
                            >
                                <MenuItemSelectOption value="edit">Editer</MenuItemSelectOption>
                                <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                            </MenuItemSelect>
                        );
                    })}
                </MenuContent>
            </SubMenu>

            <SubMenu id="collection/prop_choose">
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Choisir un prop</MenuTitle>
                <MenuContent>
                    <MenuItemButton onConfirm={onChooseCreateProp(null)}>🔎 Entrer un modèle</MenuItemButton>
                    <MenuTitle>Liste de props</MenuTitle>
                    {Object.keys(data.props).map(propCategory => (
                        <MenuItemSubMenuLink key={propCategory} id={`collection/prop_choose/${propCategory}`}>
                            {propCategory}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>

            {Object.keys(data.props).map(propCategory => (
                <SubMenu key={propCategory} id={`collection/prop_choose/${propCategory}`}>
                    <MenuTitle banner="https://nui-img/soz/menu_mapper">{propCategory}</MenuTitle>
                    <MenuContent>
                        {data.props[propCategory].map(prop => (
                            <MenuItemButton
                                key={prop.model}
                                onSelected={onSelectedCreateProp(prop)}
                                onConfirm={onChooseCreateProp(prop)}
                            >
                                {prop.label}
                            </MenuItemButton>
                        ))}
                    </MenuContent>
                </SubMenu>
            ))}

            <SubMenu id="editor">
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Mode Editeur</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            const result: Result<any, never> = await fetchNui(NuiEvent.ValidatePlacement);
                            if (isOk(result)) {
                                navigate(-1);
                            }
                        }}
                    >
                        ✔️ Valider le placement
                    </MenuItemButton>
                    <MenuItemCheckbox
                        onChange={value => {
                            fetchNui(NuiEvent.PropPlacementReset, { snap: value });
                        }}
                        checked={false}
                        description="Aligne le prop sur le sol automatiquement."
                    >
                        ⬇️ Aligner au sol
                    </MenuItemCheckbox>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.PropPlacementReset, { position: true });
                        }}
                    >
                        🔄 Réinitialiser la position
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.PropPlacementReset, { rotation: true });
                        }}
                    >
                        🔄 Réinitialiser la rotation
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.PropPlacementReset, { position: true, rotation: true, scale: true });
                        }}
                    >
                        🔄 Réinitialiser tout
                    </MenuItemButton>
                    <MenuItemCheckbox
                        checked={true}
                        onChange={async value => {
                            await fetchNui(NuiEvent.TogglePedMovements, { value: value });
                        }}
                    >
                        Afficher la souris
                    </MenuItemCheckbox>
                    <MenuTitle>Contrôle du mode editeur</MenuTitle>
                    <MenuItemText> Mode Translation : T</MenuItemText>
                    <MenuItemText> Mode Rotation : R</MenuItemText>
                    <MenuItemText> Mode Scale : S</MenuItemText>
                    <MenuItemText> Coordonnées locales : L</MenuItemText>
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};
