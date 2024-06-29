import { fetchNui } from '@public/nui/fetch';
import { useBackspace } from '@public/nui/hook/control';
import { usePlayer } from '@public/nui/hook/data';
import { useNuiEvent } from '@public/nui/hook/nui';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { PlacementProp, PropPlacementMenuData } from '@public/shared/nui/prop_placement';
import { PropCollection, PropCollectionData, PropServerData } from '@public/shared/object';
import { isOk, Result } from '@public/shared/result';
import { FunctionComponent, useCallback, useState } from 'react';
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
    const banner = 'https://cfx-nui-soz-core/public/images/banner/soz_hammer.webp';
    const player = usePlayer();
    const [collectionList, setCollectionList] = useState<PropCollectionData[]>(data.collections);
    const [serverData, setServerData] = useState<PropServerData>(data.serverData);
    const [showAll, setShowAll] = useState<boolean>(false);
    const [collection, setCollection] = useState<PropCollection>({
        name: '',
        creator_citizenID: '',
        creatorName: '',
        creation_date: new Date(),
        size: 0,
        loaded_size: 0,
        props: {},
        persistant: false,
    });
    const [currentSearch, setCurrentSearch] = useState<string>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useNuiEvent('placement_prop', 'SetCollection', (collection: PropCollection) => {
        setCollection(collection);
    });
    useNuiEvent('placement_prop', 'SetCollectionList', (collectionList: PropCollectionData[]) => {
        setCollectionList(collectionList);
    });
    useNuiEvent('placement_prop', 'SetDatas', ({ serverData }) => {
        setServerData(serverData);
    });
    useNuiEvent('placement_prop', 'EnterEditorMode', () => {
        navigate(`/${MenuType.PropPlacementMenu}/editor`, { state: { ...location.state, activeIndex: 0 } });
    });
    useNuiEvent('placement_prop', 'SetCurrentSearch', (search: string) => {
        setCurrentSearch(search);
    });

    const leaveEditorMode = useCallback(async () => {
        await fetchNui(NuiEvent.LeaveEditorMode);
        if (location.pathname == `/${MenuType.PropPlacementMenu}/collection`) {
            await fetchNui(NuiEvent.PropPlacementReturnToMainMenu);
        }
    }, [location.pathname]);

    useBackspace(leaveEditorMode);

    const selectShowAll = useCallback(value => setShowAll(value), [showAll, setShowAll, collectionList]);

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
            await fetchNui(NuiEvent.ChoosePropToCreate, { selectedProp });
        };
    };

    return (
        <Menu type={MenuType.PropPlacementMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    <MenuTitle>
                        Serveur : {serverData.loaded}/{serverData.total}
                    </MenuTitle>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.RequestCreatePropCollection);
                        }}
                    >
                        ➕ Créer une Collection
                    </MenuItemButton>
                    <MenuTitle>Collections</MenuTitle>
                    {['staff', 'admin'].includes(player.role) && (
                        <MenuItemCheckbox
                            checked={showAll}
                            onChange={async value => {
                                selectShowAll(value);
                            }}
                        >
                            Voir toutes les collections
                        </MenuItemCheckbox>
                    )}
                    {collectionList
                        .filter(collection => showAll || collection.creator_citizenID == player.citizenid)
                        .map(collection => (
                            <MenuItemButton
                                key={collection.name}
                                onConfirm={selectCollection(collection.name)}
                                description={collection.creatorName}
                            >
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
                <MenuTitle banner={banner}>Collection : {collection.name}</MenuTitle>
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
                            await fetchNui(NuiEvent.PlacementCollectionRename);
                            navigate(-1);
                        }}
                    >
                        ✎ Renommer la collection
                    </MenuItemButton>
                    {['staff', 'admin'].includes(player.role) && (
                        <>
                            <MenuItemCheckbox
                                checked={collection.persistant}
                                onChange={async value => {
                                    await fetchNui(NuiEvent.RequestPersistPropCollection, {
                                        name: collection.name,
                                        persist: value,
                                    });
                                }}
                                description="Charge la collection au démarrage du serveur."
                            >
                                💾 Persister la collection
                            </MenuItemCheckbox>
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.PlacementCollectionTeleport, collection.name);
                                }}
                            >
                                ⛹Téléporter
                            </MenuItemButton>
                        </>
                    )}
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
                <MenuTitle banner={banner}>Props de la collection : {collection.name}</MenuTitle>
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
                                key={prop.object.id}
                                title={label}
                                titleWidth={60}
                                onSelected={async () => {
                                    await fetchNui(NuiEvent.SelectPlacedProp, { id: prop.object.id });
                                }}
                                onConfirm={async (_, value) => {
                                    switch (value) {
                                        case 'delete':
                                            await fetchNui(NuiEvent.RequestDeleteProp, { id: prop.object.id });
                                            break;

                                        case 'edit':
                                            await fetchNui(NuiEvent.ChoosePlacedPropToEdit, {
                                                id: prop.object.id,
                                            });
                                            break;
                                        case 'duplicate':
                                            onChooseCreateProp({
                                                model: prop.model,
                                            })();
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
            </SubMenu>

            <SubMenu id="collection/prop_choose">
                <MenuTitle banner={banner}>Choisir un prop</MenuTitle>
                <MenuContent>
                    <MenuItemButton onConfirm={onChooseCreateProp(null)}>🔎 Entrer un modèle</MenuItemButton>
                    <MenuItemSubMenuLink id={`collection/prop_search`}>🔎 Rechercher un prop</MenuItemSubMenuLink>
                    <MenuItemCheckbox
                        checked={false}
                        onChange={async value => {
                            await fetchNui(NuiEvent.TogglePipette, { value: value });
                        }}
                        description="Copie un modèle déjà placé."
                    >
                        Pipette
                    </MenuItemCheckbox>
                    <MenuTitle>Liste de props</MenuTitle>
                    {Object.keys(data.props)
                        .sort((a, b) => a.localeCompare(b))
                        .map(propCategory => (
                            <MenuItemSubMenuLink key={propCategory} id={`collection/prop_choose/${propCategory}`}>
                                {propCategory}
                            </MenuItemSubMenuLink>
                        ))}
                </MenuContent>
            </SubMenu>

            <SubMenu id="collection/prop_search">
                <MenuTitle banner={banner}>Rechercher un prop</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.SearchProp);
                        }}
                    >
                        🔎: {currentSearch || 'Entrer un modèle'}
                    </MenuItemButton>
                    <MenuTitle>Resultats</MenuTitle>
                    {currentSearch &&
                        Object.keys(data.props).map(propCategory =>
                            data.props[propCategory]
                                .filter(prop => prop.label.toLowerCase().includes(currentSearch.toLowerCase()))
                                .sort((a, b) => a.label.localeCompare(b.label))
                                .map(prop => (
                                    <MenuItemButton
                                        key={prop.model}
                                        onSelected={onSelectedCreateProp(prop)}
                                        onConfirm={onChooseCreateProp(prop)}
                                    >
                                        {prop.label}
                                    </MenuItemButton>
                                ))
                        )}
                </MenuContent>
            </SubMenu>

            {Object.keys(data.props).map(propCategory => (
                <SubMenu key={propCategory} id={`collection/prop_choose/${propCategory}`}>
                    <MenuTitle banner={banner}>{propCategory}</MenuTitle>
                    <MenuContent>
                        {data.props[propCategory]
                            .sort((a, b) => a.label.localeCompare(b.label))
                            .map(prop => (
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
                <MenuTitle banner={banner}>Mode Editeur</MenuTitle>
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
                    <MenuItemButton
                        onConfirm={async () => {
                            const result: Result<any, never> = await fetchNui(NuiEvent.RequestDeleteCurrentProp);
                            if (isOk(result)) {
                                navigate(-1);
                            }
                        }}
                    >
                        ❌ Supprimer le prop
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
                    <MenuItemCheckbox
                        onChange={value => {
                            fetchNui(NuiEvent.PropToggleCollision, { value });
                        }}
                        checked={true}
                        description="Active ou désactive la collision du prop. Si la collision est désactivée, le prop peut être agrandi, réduit, et tourné dans tous les sens."
                    >
                        Activer la collision
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
                            fetchNui(NuiEvent.PropPlacementReset, { scale: true });
                        }}
                    >
                        🔄 Réinitialiser l'échelle
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
                    <MenuItemText> Rotation Camera : Clic Droit</MenuItemText>
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};
