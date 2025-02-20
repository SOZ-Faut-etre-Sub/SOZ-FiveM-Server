import { fetchNui } from '@public/nui/fetch';
import { usePlayer } from '@public/nui/hook/data';
import { NuiEvent } from '@public/shared/event';
import { MenuUpwData, UpwFacilityType } from '@public/shared/job/upw';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent, useEffect, useState } from 'react';

import { JobLabel } from '../../../../shared/job';
import { MainMenu, Menu, MenuContent, MenuItemCheckbox, MenuItemText, MenuTitle } from '../../Styleguide/Menu';

type MenuUpwProps = {
    data?: MenuUpwData;
};

export const MenuUpw: FunctionComponent<MenuUpwProps> = ({ data }) => {
    const player = usePlayer();
    const [blips, setBlips] = useState(null);

    useEffect(() => {
        if (data && data.blips) {
            setBlips(data.blips);
        }
    }, [data]);

    if (!data || !player || !blips) {
        return null;
    }

    const displayBlip = async (blip: UpwFacilityType, value: boolean) => {
        await fetchNui(NuiEvent.UpwDisplayBlips, { type: blip, value });
    };

    if (!player?.job.onduty) {
        return (
            <Menu type={MenuType.JobUpw}>
                <MainMenu>
                    <MenuTitle title={JobLabel.upw} />
                    <MenuContent>
                        <MenuItemText>Vous n'êtes pas en service.</MenuItemText>
                    </MenuContent>
                </MainMenu>
            </Menu>
        );
    }

    return (
        <Menu type={MenuType.JobUpw}>
            <MainMenu>
                <MenuTitle title={JobLabel.upw} />
                <MenuContent>
                    <MenuItemCheckbox
                        checked={blips[UpwFacilityType.inverter]}
                        onChange={value => displayBlip(UpwFacilityType.inverter, value)}
                    >
                        Afficher les Onduleurs
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips[UpwFacilityType.jobTerminal]}
                        onChange={value => displayBlip(UpwFacilityType.jobTerminal, value)}
                    >
                        Afficher les Bornes entreprises
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips[UpwFacilityType.terminal]}
                        onChange={value => displayBlip(UpwFacilityType.terminal, value)}
                    >
                        Afficher les Bornes civiles
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips[UpwFacilityType.plant]}
                        onChange={value => displayBlip(UpwFacilityType.plant, value)}
                    >
                        Afficher les Installations électriques
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips[UpwFacilityType.resell]}
                        onChange={value => displayBlip(UpwFacilityType.resell, value)}
                    >
                        Afficher le Stockage de revente
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips[UpwFacilityType.charger]}
                        onChange={value => displayBlip(UpwFacilityType.charger, value)}
                    >
                        Afficher les Emplacements de chargeurs
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
