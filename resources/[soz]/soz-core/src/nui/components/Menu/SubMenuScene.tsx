import { NuiEvent } from '@public/shared/event/nui';
import { JobType } from '@public/shared/job';
import { ObjectEditorContext } from '@public/shared/object';
import { Scene } from '@public/shared/scene';
import { FunctionComponent, useEffect } from 'react';

import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import {
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
    SubMenu,
    useIsInSubMenu,
} from '../Styleguide/Menu';

export type SubMenuSceneProps = {
    scene: Scene;
    context: ObjectEditorContext;
    allowLoad?: boolean;
};

export const SubMenuScene: FunctionComponent<SubMenuSceneProps> = ({ scene, context, allowLoad = false }) => {
    const subMenuId = `scene-${scene.id}`;
    const inSubMenu = useIsInSubMenu(subMenuId);
    const player = usePlayer();

    useEffect(() => {
        if (inSubMenu) {
            fetchNui(NuiEvent.SceneStartEditing, { sceneId: scene.id, context });
        }

        return () => {
            if (inSubMenu) {
                fetchNui(NuiEvent.SceneStopEditing, { sceneId: scene.id });
            }
        };
    }, [inSubMenu]);

    let banner = 'https://cfx-nui-soz-core/public/images/banner/soz_hammer.webp';

    if (context === 'admin') {
        banner = 'https://nui-img/soz/menu_mapper';
    } else if (context === JobType.Gouv) {
        banner = 'https://nui-img/soz/menu_job_gouv';
    }

    return (
        <>
            <SubMenu key={scene.id} id={subMenuId}>
                <MenuTitle banner={banner}>Scène {scene.name}</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.SceneSearchEntity);
                        }}
                        onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: null })}
                    >
                        🔎 Rechercher un modèle
                    </MenuItemButton>
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
                    {['staff', 'admin'].includes(player.role) && (
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
                    <MenuTitle>Entités</MenuTitle>
                    {Object.values(scene.entities).map(entity => (
                        <MenuItemSelect
                            title={entity.model}
                            key={entity.id}
                            onSelected={() => fetchNui(NuiEvent.SceneSetEntityHighlighted, { objectId: entity.id })}
                            description={
                                <div>Inventaire: {entity.inventoryId ? entity.inventoryId : 'Non défini'}</div>
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
                                }
                            }}
                        >
                            <MenuItemSelectOption value="edit">Editer</MenuItemSelectOption>
                            <MenuItemSelectOption value="duplicate">Dupliquer</MenuItemSelectOption>
                            <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                            <MenuItemSelectOption value="inventory">Définir l'inventaire</MenuItemSelectOption>
                            <MenuItemSelectOption value="inventory_delete">Supprimer l'inventaire</MenuItemSelectOption>
                        </MenuItemSelect>
                    ))}
                </MenuContent>
            </SubMenu>
        </>
    );
};
