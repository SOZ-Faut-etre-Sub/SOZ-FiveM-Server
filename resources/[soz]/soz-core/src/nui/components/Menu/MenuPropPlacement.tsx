import { fetchNui } from '@public/nui/fetch';
import { useBackspace } from '@public/nui/hook/control';
import { usePlayer } from '@public/nui/hook/data';
import { useNuiEvent } from '@public/nui/hook/nui';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { PlacementProp, PropPlacementMenuData } from '@public/shared/nui/prop_placement';
import {
    PropClientData,
    PropCollection,
    PropCollectionData,
    PropServerData,
    WorldPlacedProp,
} from '@public/shared/object';
import { isOk, Result } from '@public/shared/result';
import { FunctionComponent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
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
    const [collection, setCollection] = useState<PropCollection>(null);
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
    useBackspace(async () => {
        await fetchNui(NuiEvent.LeaveEditorMode);
        if (location.pathname == `/${MenuType.PropPlacementMenu}`) {
            await fetchNui(NuiEvent.PropPlacementReturnToMainMenu);
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
            navigate(`/${MenuType.PropPlacementMenu}/collection`);
        };
    };

    const onSelectedProp = (selectedProp: WorldPlacedProp) => {
        return async () => {
            await fetchNui(NuiEvent.SelectPlacedProp, { selectedProp });
        };
    };
    const onChooseProp = (selectedProp: WorldPlacedProp) => {
        return async () => {
            await fetchNui(NuiEvent.ChoosePlacedPropToEdit, { selectedProp });
            navigate(`/${MenuType.PropPlacementMenu}/editor`);
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
                navigate(`/${MenuType.PropPlacementMenu}/editor`);
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
                                        : '🟢'}
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
                        {collection.name}
                    </MenuTitle>
                    <MenuItemSubMenuLink id={`${MenuType.PropPlacementMenu}/collection/props`}>
                        📝 Voir la liste des props de la collection
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id={`${MenuType.PropPlacementMenu}/collection/prop_choose`}>
                        ➕ Ajouter un prop
                    </MenuItemSubMenuLink>
                    <MenuItemCheckbox
                        checked={false}
                        onChange={async value => {
                            await fetchNui(NuiEvent.HighlightCollection, { value: value });
                        }}
                        description="Affiche les props de la collection en surbrillance seulement pour vous."
                    >
                        Afficher la collection en surbrillance
                    </MenuItemCheckbox>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.RequestToggleCollectionLoad, {
                                name: collection.name,
                                value: true,
                            });
                        }}
                        disabled={collection.loaded_size >= collection.size}
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
                        disabled={collection.loaded_size == 0}
                    >
                        🌬️ Décharger la collection
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.RequestDeletePropCollection, { name: collection.name });
                            navigate(`/${MenuType.PropPlacementMenu}`);
                        }}
                        disabled={collection.loaded_size > 0}
                        description="Supprime la collection du serveur. Il faut la décharger avant !"
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
                    {collection.props.map(prop => (
                        <MenuItemButton
                            key={prop.unique_id}
                            onSelected={onSelectedProp(prop)}
                            onConfirm={onChooseProp(prop)}
                        >
                            {prop.model}
                        </MenuItemButton>
                    ))}
                </MenuContent>
            </SubMenu>

            <SubMenu id="collection/prop_choose">
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Choisir un prop</MenuTitle>
                <MenuContent>
                    <MenuItemButton onConfirm={onChooseCreateProp(null)}>🔎 Entrer un modèle</MenuItemButton>
                    <MenuTitle>Liste de props</MenuTitle>
                    {data.props.map(prop => (
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

            <SubMenu id="editor">
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Mode Editeur</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.LeaveEditorMode);
                        }}
                    >
                        ❌ Quitter le mode editeur
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            const result: Result<any, never> = await fetchNui(NuiEvent.ValidatePlacement);
                            if (isOk(result)) {
                                navigate(`/${MenuType.PropPlacementMenu}/collection`);
                            }
                        }}
                    >
                        ✔️ Valider le placement
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.PropPlacementReset, { snap: true });
                        }}
                    >
                        ⬇️ Snap au sol
                    </MenuItemButton>
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
