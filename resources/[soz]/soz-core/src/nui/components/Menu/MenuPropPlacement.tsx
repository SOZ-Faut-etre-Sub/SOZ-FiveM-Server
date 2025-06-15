import { fetchNui } from '@public/nui/fetch';
import { usePlayer } from '@public/nui/hook/data';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { FunctionComponent, memo, useState } from 'react';

import { isStaff } from '../../../shared/player';
import { RepositoryType } from '../../../shared/repository';
import { isPlayerAssociatedToScene, Scene } from '../../../shared/scene';
import { useRepository } from '../../hook/repository';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemStringInput,
    MenuItemSubMenuLink,
    MenuSubTitle,
    MenuTitle,
} from '../Styleguide/Menu';
import { SubMenuScene } from './SubMenuScene';

const showAllAtom = atom<boolean>(false);

type MenuPropPlacementProps = {
    data: {
        loaded: string[];
    };
};

export const MenuPropPlacement: FunctionComponent<MenuPropPlacementProps> = memo(({ data }) => {
    const player = usePlayer();
    const showAll = useAtomValue(showAllAtom);
    const setShowAll = useSetAtom(showAllAtom);
    const scenesMap = useRepository(RepositoryType.Scene);
    const [collectionFilter, setCollectionFilter] = useState('');

    const isPlayerInStaff = isStaff(player);
    const scenes = Object.values(scenesMap).filter(scene => {
        if (scene.worldEventId !== null) {
            return false;
        }

        if (!collectionFilter || collectionFilter === '') {
            return true;
        }

        return (
            scene.name.toLowerCase().includes(collectionFilter.toLowerCase()) ||
            scene.ownerName.toLowerCase().includes(collectionFilter.toLowerCase()) ||
            scene.owner.toLowerCase().includes(collectionFilter.toLowerCase())
        );
    }) as Scene[];
    const filteredScenes = (
        showAll && isPlayerInStaff ? scenes : scenes.filter(scene => isPlayerAssociatedToScene(player.citizenid, scene))
    ).sort((a, b) => a.name.localeCompare(b.name));

    if (!player) {
        return null;
    }

    const [loadedScenes, loadedEntities] = filteredScenes
        .map(scene => (data.loaded.includes(scene.id) ? [1, Object.values(scene.entities).length] : [0, 0]))
        .reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);

    return (
        <Menu type={MenuType.PropPlacementMenu}>
            <MainMenu>
                <MenuTitle title="Hammer" />
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.RequestCreatePropCollection);
                        }}
                    >
                        ➕ Créer une Collection
                    </MenuItemButton>
                    <MenuSubTitle>
                        {loadedEntities} entités / {loadedScenes} scènes chargées
                    </MenuSubTitle>
                    {isStaff(player) && (
                        <>
                            <MenuItemCheckbox
                                checked={showAll}
                                onChange={async value => {
                                    setShowAll(value);
                                }}
                            >
                                Voir toutes les collections
                            </MenuItemCheckbox>
                            <MenuItemStringInput onChange={setCollectionFilter} value={collectionFilter}>
                                Filtre:
                            </MenuItemStringInput>
                        </>
                    )}
                    {filteredScenes.map(scene => {
                        const isLoaded = data.loaded.includes(scene.id);

                        return (
                            <MenuItemSubMenuLink
                                key={scene.id}
                                id={`scene-${scene.id}`}
                                description={
                                    <p>
                                        Auteur : {scene.ownerName} ({scene.owner})<br />
                                        Date de création : {new Date(scene.createdAt).toLocaleDateString('fr-FR')}
                                        <br />
                                    </p>
                                }
                            >
                                <div className="pr-2 flex w-full items-center justify-between">
                                    <div>
                                        {scene.persistent && isLoaded && '🟢'}
                                        {!scene.persistent && isLoaded && '🔵'}
                                        {scene.persistent && !isLoaded && '🟡'}
                                        {!scene.persistent && !isLoaded && '🔴'} {scene.name}
                                    </div>
                                    <div>{Object.values(scene.entities).length}</div>
                                </div>
                            </MenuItemSubMenuLink>
                        );
                    })}
                </MenuContent>
            </MainMenu>
            {filteredScenes.map(scene => (
                <SubMenuScene key={scene.id} scene={scene} context="hammer" allowLoad />
            ))}
        </Menu>
    );
});
