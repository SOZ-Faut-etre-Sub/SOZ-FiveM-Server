import { fetchNui } from '@public/nui/fetch';
import { usePlayer } from '@public/nui/hook/data';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { FunctionComponent, memo } from 'react';

import { isStaff } from '../../../shared/player';
import { RepositoryType } from '../../../shared/repository';
import { useRepository } from '../../hook/repository';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSubMenuLink,
    MenuSubTitle,
    MenuTitle,
} from '../Styleguide/Menu';
import { SubMenuScene } from './SubMenuScene';

const showAllAtom = atom<boolean>(false);

export const MenuPropPlacement: FunctionComponent = memo(() => {
    const player = usePlayer();
    const showAll = useAtomValue(showAllAtom);
    const setShowAll = useSetAtom(showAllAtom);
    const scenes = useRepository(RepositoryType.Scene);

    const isPlayerInStaff = isStaff(player);
    const filteredScenes = (
        showAll && isPlayerInStaff
            ? Object.values(scenes)
            : Object.values(scenes).filter(scene => scene.owner == player.citizenid)
    ).sort((a, b) => a.name.localeCompare(b.name));

    if (!player) {
        return null;
    }

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
                    <MenuSubTitle>Collections</MenuSubTitle>
                    {isStaff(player) && (
                        <MenuItemCheckbox
                            checked={showAll}
                            onChange={async value => {
                                setShowAll(value);
                            }}
                        >
                            Voir toutes les collections
                        </MenuItemCheckbox>
                    )}
                    {filteredScenes.map(scene => (
                        <MenuItemSubMenuLink key={scene.id} id={`scene-${scene.id}`}>
                            <div className="pr-2 flex w-full items-center justify-between">
                                <div>
                                    {!scene.persistent ? '🔴' : '🟢'} {scene.name}
                                </div>
                                <div>{Object.values(scene.entities).length}</div>
                            </div>
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </MainMenu>
            {filteredScenes.map(scene => (
                <SubMenuScene key={scene.id} scene={scene} context="hammer" allowLoad />
            ))}
        </Menu>
    );
});
