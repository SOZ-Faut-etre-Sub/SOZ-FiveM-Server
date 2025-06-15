import { NuiEvent } from '@public/shared/event/nui';
import { JobLabel, JobType } from '@public/shared/job';
import { PLACEMENT_PROP_LABELS, PLACEMENT_PROP_LIST } from '@public/shared/nui/prop_placement';
import { ObjectEditorContext } from '@public/shared/object';
import { isStaff } from '@public/shared/player';
import { Scene } from '@public/shared/scene';
import { FunctionComponent, useCallback, useEffect, useLayoutEffect } from 'react';

import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import {
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuSubTitle,
    MenuTitle,
    SubMenu,
    useIsInSubMenu,
} from '../Styleguide/Menu';

export type SubMenuSceneProps = {
    scene: Scene;
    context: ObjectEditorContext;
    allowLoad?: boolean;
    allowInventory?: boolean;
};
/**
 * @TODO
 *
 * When in sub menu activa free camera
 */

export const SubMenuScene: FunctionComponent<SubMenuSceneProps> = ({
    scene,
    context,
    allowLoad = false,
    allowInventory = false,
}) => {
    const subMenuId = `scene-${scene.id}`;
    const subMenuEntityId = `scene-entity-${scene.id}`;
    const subMenuPedId = `scene-ped-${scene.id}`;
    const subMenuMarkerId = `scene-marker-${scene.id}`;
    const subMenuCollection = `scene-collection-${scene.id}`;
    const subMenuAssociate = `scene-associate-${scene.id}`;
    const collections = Object.keys(PLACEMENT_PROP_LIST).sort((a, b) => a.localeCompare(b));
    const allSubMenus = [
        subMenuId,
        subMenuEntityId,
        subMenuPedId,
        subMenuMarkerId,
        subMenuCollection,
        subMenuAssociate,
    ];
    const subMenuPreview = [];

    for (const categoryIndex in collections) {
        allSubMenus.push(`${subMenuCollection}-${categoryIndex}`);
        subMenuPreview.push(`${subMenuCollection}-${categoryIndex}`);
    }

    const inSubMenu = useIsInSubMenu(allSubMenus);
    const inSubMenuPreview = useIsInSubMenu(subMenuPreview);
    const player = usePlayer();

    useLayoutEffect(() => {
        if (inSubMenu) {
            fetchNui(NuiEvent.SceneStartEditing, { sceneId: scene.id, context });
        }

        return () => {
            if (inSubMenu) {
                fetchNui(NuiEvent.SceneStopEditing, { sceneId: scene.id });
            }
        };
    }, [inSubMenu]);

    useEffect(() => {
        if (!inSubMenuPreview) {
            fetchNui(NuiEvent.ScenePreviewModel, { prop: null });
        }

        return () => {
            if (inSubMenuPreview) {
                fetchNui(NuiEvent.ScenePreviewModel, { prop: null });
            }
        };
    }, [inSubMenuPreview]);

    const mouseHandler = useCallback((): void => {
        if (!inSubMenu) {
            return;
        }

        fetchNui(NuiEvent.SceneSelectObjectOnClick);
    }, [inSubMenu]);

    useEffect(() => {
        window.addEventListener('mousedown', mouseHandler);

        return () => {
            window.removeEventListener('mousedown', mouseHandler);
        };
    }, [mouseHandler]);

    // avoid rendering when not in sub menu, which save a lot of performance
    if (!inSubMenu) {
        return null;
    }

    return (
        <>
            <SubMenu id={subMenuId}>
                <MenuTitle title={context === JobType.Gouv ? JobLabel.gouv : context} />
                <MenuContent subtitle={`Scène ${scene.name}`}>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.SceneSearchEntity);
                        }}
                        onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: null })}
                    >
                        🔎 Rechercher un modèle
                    </MenuItemButton>
                    <MenuItemSubMenuLink id={`scene-collection-${scene.id}`}>
                        ➕ Ajouter une entité via liste
                    </MenuItemSubMenuLink>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.SceneAddEntity, {
                                sceneId: scene.id,
                            });
                        }}
                        onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: null })}
                    >
                        ➕ Ajouter une entité
                    </MenuItemButton>
                    {isStaff(player) && context !== 'hammer' && (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.SceneAddPed, {
                                    sceneId: scene.id,
                                });
                            }}
                            onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: null })}
                        >
                            ➕ Ajouter un ped
                        </MenuItemButton>
                    )}
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.SceneAddMarker, {
                                sceneId: scene.id,
                            });
                        }}
                        onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: null })}
                        description="Un marker est un point d'intérêt, il peut être utilisé pour la régie pour définir l'emplacement d'un effet ou faire pointer des lumières sur cet emplacement."
                    >
                        ➕ Ajouter un marker
                    </MenuItemButton>
                    {allowLoad && (
                        <>
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.SceneLoad, {
                                        sceneId: scene.id,
                                    });
                                }}
                                onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: null })}
                            >
                                ⚡ Charger la collection
                            </MenuItemButton>
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.SceneUnload, {
                                        sceneId: scene.id,
                                    });
                                }}
                                onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: null })}
                            >
                                🌬️ Décharger la collection
                            </MenuItemButton>
                        </>
                    )}
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.SceneSetName, {
                                sceneId: scene.id,
                            });
                        }}
                        onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: null })}
                    >
                        ✎ Renommer la collection
                    </MenuItemButton>
                    {isStaff(player) && (
                        <>
                            <MenuItemCheckbox
                                checked={scene.persistent}
                                onChange={async value => {
                                    await fetchNui(NuiEvent.SceneSetPersistent, {
                                        sceneId: scene.id,
                                        persist: value,
                                    });
                                }}
                                onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: null })}
                                description="Charge la collection au démarrage du serveur."
                            >
                                💾 Persister la collection
                            </MenuItemCheckbox>
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.SceneTeleport, {
                                        sceneId: scene.id,
                                    });
                                }}
                                onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: null })}
                            >
                                ⛹ Téléporter
                            </MenuItemButton>
                        </>
                    )}
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.SceneDelete, { sceneId: scene.id });
                        }}
                        onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: null })}
                    >
                        ❌ Supprimer
                    </MenuItemButton>
                    <MenuItemSubMenuLink id={`scene-entity-${scene.id}`}>Entités</MenuItemSubMenuLink>
                    {isStaff(player) && context !== 'hammer' && (
                        <MenuItemSubMenuLink id={`scene-ped-${scene.id}`}>PNJS</MenuItemSubMenuLink>
                    )}
                    <MenuItemSubMenuLink id={`scene-marker-${scene.id}`}>Markers</MenuItemSubMenuLink>
                    {(isStaff(player) || scene.owner === player.citizenid) && (
                        <MenuItemSubMenuLink id={subMenuAssociate}>Associés</MenuItemSubMenuLink>
                    )}
                </MenuContent>
            </SubMenu>
            <SubMenu id={subMenuAssociate}>
                <MenuTitle title="Associés" />
                <MenuContent>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.SceneAddAssociate, { sceneId: scene.id })}>
                        Ajouté un associé
                    </MenuItemButton>
                    {scene.associates.map(associate => (
                        <MenuItemSelect
                            key={associate.citizenId}
                            title={associate.name}
                            onConfirm={(_, value) => {
                                if (value === 'delete') {
                                    fetchNui(NuiEvent.SceneRemoveAssociate, {
                                        sceneId: scene.id,
                                        associateId: associate.citizenId,
                                    });
                                }

                                if (value === 'transfer') {
                                    fetchNui(NuiEvent.SceneTransferOwnership, {
                                        sceneId: scene.id,
                                        associateId: associate.citizenId,
                                    });
                                }
                            }}
                        >
                            <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                            <MenuItemSelectOption value="transfer">Transféré l'ownership</MenuItemSelectOption>
                        </MenuItemSelect>
                    ))}
                </MenuContent>
            </SubMenu>
            <SubMenu id={`scene-entity-${scene.id}`}>
                <MenuTitle title={context === JobType.Gouv ? JobLabel.gouv : context} />
                <MenuContent subtitle={`Scène ${scene.name} Entités`}>
                    {Object.values(scene.entities).map(entity => (
                        <MenuItemSelect
                            title={PLACEMENT_PROP_LABELS[entity.model] || entity.model}
                            key={entity.id}
                            onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: entity.id })}
                            description={
                                <div>
                                    <div>{entity.model}</div>
                                    {allowInventory && (
                                        <div>Inventaire: {entity.inventoryId ? entity.inventoryId : 'Non défini'}</div>
                                    )}
                                </div>
                            }
                            onConfirm={(i, value) => {
                                switch (value) {
                                    case 'edit':
                                        fetchNui(NuiEvent.SceneUpdateEntity, {
                                            sceneId: scene.id,
                                            entityId: entity.id,
                                        });
                                        break;
                                    case 'duplicate':
                                        fetchNui(NuiEvent.SceneDuplicateEntity, {
                                            sceneId: scene.id,
                                            entityId: entity.id,
                                        });
                                        break;
                                    case 'delete':
                                        fetchNui(NuiEvent.SceneRemoveEntity, {
                                            sceneId: scene.id,
                                            entityId: entity.id,
                                        });
                                        break;
                                    case 'inventory':
                                        fetchNui(NuiEvent.SceneSetEntityInventory, {
                                            sceneId: scene.id,
                                            entityId: entity.id,
                                        });
                                        break;
                                    case 'inventory_delete':
                                        fetchNui(NuiEvent.SceneSetEntityInventory, {
                                            sceneId: scene.id,
                                            entityId: entity.id,
                                            remove: true,
                                        });
                                        break;
                                    case 'user_id':
                                        fetchNui(NuiEvent.SceneSetEntityUserId, {
                                            sceneId: scene.id,
                                            entityId: entity.id,
                                        });
                                        break;
                                }
                            }}
                        >
                            <MenuItemSelectOption value="edit">Editer</MenuItemSelectOption>
                            <MenuItemSelectOption value="duplicate">Dupliquer</MenuItemSelectOption>
                            <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                            {allowInventory && (
                                <>
                                    <MenuItemSelectOption value="inventory">Définir l'inventaire</MenuItemSelectOption>
                                    <MenuItemSelectOption value="inventory_delete">
                                        Supprimer l'inventaire
                                    </MenuItemSelectOption>
                                </>
                            )}
                            <MenuItemSelectOption value="user_id">Définir un identifiant</MenuItemSelectOption>
                        </MenuItemSelect>
                    ))}
                </MenuContent>
            </SubMenu>
            <SubMenu id={`scene-ped-${scene.id}`}>
                <MenuTitle title={context === JobType.Gouv ? JobLabel.gouv : context} />
                <MenuContent subtitle={`Scène ${scene.name} PNJs`}>
                    {Object.values(scene.peds).map(ped => (
                        <MenuItemSelect
                            title={ped.model}
                            key={ped.id}
                            onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: ped.id })}
                            description={
                                <>
                                    <div>Arme: {ped.weapon}</div>
                                    <div>Comportement: {ped.behavior}</div>
                                </>
                            }
                            onConfirm={(i, value) => {
                                switch (value) {
                                    case 'edit':
                                        fetchNui(NuiEvent.SceneUpdatePosition, {
                                            sceneId: scene.id,
                                            pedId: ped.id,
                                        });
                                        break;
                                    case 'duplicate':
                                        fetchNui(NuiEvent.SceneDuplicatePed, {
                                            sceneId: scene.id,
                                            pedId: ped.id,
                                        });
                                        break;
                                    case 'delete':
                                        fetchNui(NuiEvent.SceneRemovePed, {
                                            sceneId: scene.id,
                                            pedId: ped.id,
                                        });
                                        break;
                                    case 'weapon':
                                        fetchNui(NuiEvent.SceneSetPedWeapon, {
                                            sceneId: scene.id,
                                            pedId: ped.id,
                                        });
                                        break;
                                    case 'behavior':
                                        fetchNui(NuiEvent.SceneSetPedBehavior, {
                                            sceneId: scene.id,
                                            pedId: ped.id,
                                        });
                                        break;
                                }
                            }}
                        >
                            <MenuItemSelectOption value="edit">Position</MenuItemSelectOption>
                            <MenuItemSelectOption value="duplicate">Dupliquer</MenuItemSelectOption>
                            <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                            <MenuItemSelectOption value="weapon">Arme</MenuItemSelectOption>
                            <MenuItemSelectOption value="behavior">Comportement</MenuItemSelectOption>
                        </MenuItemSelect>
                    ))}
                </MenuContent>
            </SubMenu>
            <SubMenu id={`scene-marker-${scene.id}`}>
                <MenuTitle title="Markers" />
                <MenuContent>
                    {Object.values(scene.markers).map(marker => (
                        <MenuItemSelect
                            title={marker.userId}
                            key={marker.id}
                            onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: marker.id })}
                            onConfirm={(i, value) => {
                                switch (value) {
                                    case 'edit':
                                        fetchNui(NuiEvent.SceneUpdateMarker, {
                                            sceneId: scene.id,
                                            markerId: marker.id,
                                        });
                                        break;
                                    case 'delete':
                                        fetchNui(NuiEvent.SceneRemoveMarker, {
                                            sceneId: scene.id,
                                            markerId: marker.id,
                                        });
                                        break;
                                }
                            }}
                        >
                            <MenuItemSelectOption value="edit">Editer</MenuItemSelectOption>
                            <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                        </MenuItemSelect>
                    ))}
                </MenuContent>
            </SubMenu>
            <SubMenu id={`scene-collection-${scene.id}`}>
                <MenuTitle title="Aménagement" />
                <MenuContent subtitle="Choisir un type de meuble">
                    <MenuSubTitle>Type de meuble</MenuSubTitle>
                    {collections.map((propCategory, index) => (
                        <MenuItemSubMenuLink key={propCategory} id={`${subMenuCollection}-${index}`}>
                            {propCategory}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>

            {collections.map((propCategory, index) => (
                <SubMenu key={propCategory} id={`${subMenuCollection}-${index}`}>
                    <MenuTitle title="Aménagement" />
                    <MenuContent subtitle={`Choisir un ${propCategory}`}>
                        {PLACEMENT_PROP_LIST[propCategory].map(prop => (
                            <MenuItemButton
                                key={prop.model}
                                onSelected={async () => {
                                    await fetchNui(NuiEvent.ScenePreviewModel, { prop: prop });
                                }}
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.SceneAddEntity, {
                                        sceneId: scene.id,
                                        model: prop.model,
                                    });
                                }}
                            >
                                {prop.label}
                            </MenuItemButton>
                        ))}
                    </MenuContent>
                </SubMenu>
            ))}
        </>
    );
};
