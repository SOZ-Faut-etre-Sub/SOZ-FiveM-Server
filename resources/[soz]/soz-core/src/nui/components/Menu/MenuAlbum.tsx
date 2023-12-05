import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
} from '../Styleguide/Menu';

type MenuAlbumProps = {
    data: {
        tracks: Record<string, string>;
        volume: number;
    };
};

export const MenuAlbum: FunctionComponent<MenuAlbumProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    const onConfirm = (name: string | null) => {
        fetchNui(NuiEvent.AlbumPlay, name);
    };

    return (
        <Menu type={MenuType.Album}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_album">Choix de la piste</MenuTitle>
                <MenuContent>
                    <MenuItemButton onConfirm={() => onConfirm(null)}>Arrêter</MenuItemButton>
                    <MenuItemSelect
                        title={`Volume`}
                        value={data.volume}
                        onConfirm={async index => {
                            await fetchNui(NuiEvent.AlbumVolume, index);
                            data.volume = index;
                        }}
                    >
                        {Array(11)
                            .fill(0)
                            .map((_, index) => (
                                <MenuItemSelectOption value={index} key={`volume_${index}`}>
                                    {index}
                                </MenuItemSelectOption>
                            ))}
                    </MenuItemSelect>
                    {Object.entries(data.tracks).map(([key, value]) => {
                        return (
                            <MenuItemButton key={value} onConfirm={() => onConfirm(value)}>
                                {key}
                            </MenuItemButton>
                        );
                    })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
