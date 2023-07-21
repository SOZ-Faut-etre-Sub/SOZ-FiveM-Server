import { RootState } from '@public/nui/store';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuItemText, MenuTitle } from '../Styleguide/Menu';

type TaxiStateProps = {
    data: {
        onDuty: boolean;
    };
};

export const TaxiJobMenu: FunctionComponent<TaxiStateProps> = ({ data }) => {
    const status = useSelector((state: RootState) => state.taxi);
    const banner = 'https://nui-img/soz/menu_job_taxi';

    if (!data.onDuty) {
        return (
            <Menu type={MenuType.TaxiJobMenu}>
                <MainMenu>
                    <MenuTitle banner={banner}></MenuTitle>
                    <MenuContent>
                        <MenuItemText>Vous n'êtes pas en service.</MenuItemText>
                    </MenuContent>
                </MainMenu>
            </Menu>
        );
    }

    return (
        <Menu type={MenuType.TaxiJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    {status.horodateurDisplayed ? (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.TaxiDisplayHorodateur, false);
                            }}
                        >
                            Cacher Horodateur
                        </MenuItemButton>
                    ) : (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.TaxiDisplayHorodateur, true);
                            }}
                        >
                            Afficher Horodateur
                        </MenuItemButton>
                    )}
                    {status.horodateurStarted ? (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.TaxiSetHorodateur, false);
                            }}
                        >
                            Désactiver Horodateur
                        </MenuItemButton>
                    ) : (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.TaxiSetHorodateur, true);
                            }}
                        >
                            Activer Horodateur
                        </MenuItemButton>
                    )}
                    {status.missionInprogress ? (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.TaxiSetMission, false);
                            }}
                        >
                            Annuler la mission
                        </MenuItemButton>
                    ) : (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.TaxiSetMission, true);
                            }}
                        >
                            Prendre une mission
                        </MenuItemButton>
                    )}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
