import { usePlayer } from '@public/nui/hook/data';
import { RootState } from '@public/nui/store';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { NuiEvent } from '../../../shared/event';
import { JobLabel } from '../../../shared/job';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemButton, MenuItemText, MenuTitle } from '../Styleguide/Menu';

export const TaxiJobMenu: FunctionComponent = () => {
    const status = useSelector((state: RootState) => state.taxi);
    const player = usePlayer();

    if (!player.job.onduty) {
        return (
            <Menu type={MenuType.TaxiJobMenu}>
                <MainMenu>
                    <MenuTitle title={JobLabel.taxi} />
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
                <MenuTitle title={JobLabel.taxi} />
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
                    {status.taxiMissionInProgress ? (
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
                            Prendre une mission en taxi
                        </MenuItemButton>
                    )}
                    {status.busMissionInProgress ? (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.BusSetService, false);
                            }}
                        >
                            Annuler la mission
                        </MenuItemButton>
                    ) : (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.BusSetService, true);
                            }}
                        >
                            Prendre une mission en bus
                        </MenuItemButton>
                    )}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
