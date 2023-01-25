import { fetchNui } from '@public/nui/fetch';
import { usePlayer } from '@public/nui/hook/data';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent, useEffect, useState } from 'react';

import { MainMenu, Menu, MenuContent, MenuItemCheckbox, MenuItemText, MenuTitle } from '../../Styleguide/Menu';

type MenuUpwProps = {
    data: {
        blips: {
            inverter: boolean;
            jobTerminal: boolean;
            globalTerminal: boolean;
            plant: boolean;
            resell: boolean;
        };
    };
};

export const MenuUpw: FunctionComponent<MenuUpwProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_upw';
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

    const displayBlip = async (blip: string, value: boolean) => {
        setBlips({ ...blips, [blip]: value });
        await fetchNui(NuiEvent.UpwDisplayBlips, { blip, value });
    };

    if (!player?.job.onduty) {
        return (
            <Menu type={MenuType.JobUpw}>
                <MainMenu>
                    <MenuTitle banner={banner}>Services UPW</MenuTitle>
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
                <MenuTitle banner={banner}>Services UPW</MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox checked={blips['inverter']} onChange={value => displayBlip('inverter', value)}>
                        Afficher les Onduleurs
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips['jobTerminal']}
                        onChange={value => displayBlip('jobTerminal', value)}
                    >
                        Afficher les Bornes entreprises
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips['globalTerminal']}
                        onChange={value => displayBlip('globalTerminal', value)}
                    >
                        Afficher les Bornes civiles
                    </MenuItemCheckbox>
                    <MenuItemCheckbox checked={blips['plant']} onChange={value => displayBlip('plant', value)}>
                        Afficher les Installations électriques
                    </MenuItemCheckbox>
                    <MenuItemCheckbox checked={blips['resell']} onChange={value => displayBlip('resell', value)}>
                        Afficher le Stockage de revente
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};
