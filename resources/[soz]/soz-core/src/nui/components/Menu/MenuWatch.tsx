import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { HudSettings } from '../../../shared/hud';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
} from '../Styleguide/Menu';

type MenuWatchProps = {
    data: HudSettings;
};

export const MenuWatch: FunctionComponent<MenuWatchProps> = ({ data }) => {
    const player = usePlayer();

    if (!player) {
        return null;
    }

    return (
        <Menu type={MenuType.WatchMenu}>
            <MainMenu>
                <MenuTitle banner="https://cfx-nui-soz-core/public/images/banner/menu_watch.webp">
                    Montre connectée
                </MenuTitle>
                <MenuContent>
                    <MenuItemSelect
                        title="Thème"
                        value={data.theme}
                        description={`Thème de la montre connectée`}
                        onConfirm={async (_, value) => {
                            await fetchNui(NuiEvent.WatchMenuSetTheme, value);
                        }}
                    >
                        <MenuItemSelectOption value="auto">Auto</MenuItemSelectOption>
                        <MenuItemSelectOption value="daltonism">Daltonien</MenuItemSelectOption>
                        <MenuItemSelectOption value="dark">Dark Mode</MenuItemSelectOption>
                        <MenuItemSelectOption value="light">Light Mode</MenuItemSelectOption>
                        <MenuItemSelectOption value="uwu">UwU Mode</MenuItemSelectOption>
                        <MenuItemSelectOption value="green">Green Mode</MenuItemSelectOption>
                    </MenuItemSelect>

                    {/* Disabled for now */}
                    {/*<MenuItemSelect*/}
                    {/*    title="Zoom"*/}
                    {/*    value={data.zoom}*/}
                    {/*    description={`Zoom de la montre connectée`}*/}
                    {/*    onConfirm={async (_, value) => {*/}
                    {/*        await fetchNui(NuiEvent.WatchMenuSetZoom, value);*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <MenuItemSelectOption value={0.5}>50%</MenuItemSelectOption>*/}
                    {/*    <MenuItemSelectOption value={0.75}>75%</MenuItemSelectOption>*/}
                    {/*    <MenuItemSelectOption value={1}>100%</MenuItemSelectOption>*/}
                    {/*    <MenuItemSelectOption value={1.25}>125%</MenuItemSelectOption>*/}
                    {/*    <MenuItemSelectOption value={1.5}>150%</MenuItemSelectOption>*/}
                    {/*</MenuItemSelect>*/}

                    <MenuItemCheckbox
                        checked={data.showDateTime}
                        description="Active/Désactive l'affichage de la date et de l'heure"
                        onChange={value => fetchNui(NuiEvent.WatchMenuSetShowDateTime, value)}
                    >
                        Date et heure
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.showWeather}
                        description="Active/Désactive l'affichage de la météo"
                        onChange={value => fetchNui(NuiEvent.WatchMenuSetShowWeather, value)}
                    >
                        Météo
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.showStreetName}
                        description="Active/Désactive l'affichage des noms de rue"
                        onChange={value => fetchNui(NuiEvent.WatchMenuSetShowStreetName, value)}
                    >
                        Noms de rue
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.showCompass}
                        description="Active/Désactive l'affichage de la boussole"
                        onChange={value => fetchNui(NuiEvent.WatchMenuSetShowCompass, value)}
                    >
                        Boussole
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.showStress}
                        description="Active/Désactive l'affichage du stress"
                        onChange={value => fetchNui(NuiEvent.WatchMenuSetShowStress, value)}
                    >
                        Stress
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.showStamina}
                        description="Active/Désactive l'affichage de la stamina"
                        onChange={value => fetchNui(NuiEvent.WatchMenuSetShowStamina, value)}
                    >
                        Stamina
                    </MenuItemCheckbox>
                    <MenuTitle>Intéraction</MenuTitle>
                    <MenuItemCheckbox
                        checked={data.showInstructionalOverlay}
                        description="Active/Désactive l'affichage des instructions d'intéraction"
                        onChange={value => fetchNui(NuiEvent.WatchMenuSetShowInstructionalOverlay, value)}
                    >
                        Instructions d'intéraction
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
