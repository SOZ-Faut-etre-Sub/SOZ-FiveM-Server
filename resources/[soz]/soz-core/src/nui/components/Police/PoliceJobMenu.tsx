import { fetchNui } from '@public/nui/fetch';
import { usePlayer } from '@public/nui/hook/data';
import { NuiEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { PoliceJobMenuData } from '@public/shared/job/police';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent, useEffect, useState } from 'react';

import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type PoliceJobStateProps = {
    data: PoliceJobMenuData;
};

export const PoliceJobMenu: FunctionComponent<PoliceJobStateProps> = ({ data }) => {
    const player = usePlayer();
    const banner = `https://soz.zerator.com/static/game/images/banner/menu_job_${player.job.id}.webp`;

    const [wantedPlayers, setWantedPlayers] = useState(null);

    useEffect(() => {
        if (player.job.onduty && wantedPlayers == null) {
            fetchNui(NuiEvent.PoliceGetWantedPlayers).then((players: any) => {
                setWantedPlayers(players);
            });
        }
    });

    if (!player.job.onduty) {
        return (
            <Menu type={MenuType.PoliceJobMenu}>
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
        <Menu type={MenuType.PoliceJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}>L'ordre et la justice !</MenuTitle>
                <MenuContent>
                    {player.job.id == JobType.SASP || player.job.id == JobType.FBI ? (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.NewsCreateAnnounce, {
                                    type: `${player.job.id}_annoncement`,
                                    title: 'Message de la communication',
                                });
                            }}
                        >
                            Faire une communication
                        </MenuItemButton>
                    ) : (
                        <></>
                    )}
                    {player.job.id == JobType.FBI ? (
                        <MenuItemButton
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.NewsCreateAnnounce, {
                                    type: `presidence`,
                                    title: 'Message de la communication présidentielle',
                                });
                            }}
                        >
                            Faire une communication présidentielle
                        </MenuItemButton>
                    ) : (
                        <></>
                    )}
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.RedCall);
                        }}
                    >
                        🚨 | Code rouge
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.PoliceShowBadge);
                        }}
                    >
                        Montrer son badge
                    </MenuItemButton>
                    <MenuItemSubMenuLink id="persons_searched">👮 | Personnes recherchées</MenuItemSubMenuLink>
                    <MenuItemCheckbox
                        checked={data.displayRadar}
                        onChange={async value => {
                            await fetchNui(NuiEvent.ToggleRadar, value);
                        }}
                    >
                        Afficher les radars sur le GPS
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
            <SubMenu id="persons_searched">
                <MenuTitle banner={banner}>Personnes recherchées</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.NewsCreateAnnounce, {
                                type: player.job.id,
                                title: 'Nom de la personne recherchée :',
                            });
                            setWantedPlayers(await fetchNui(NuiEvent.PoliceGetWantedPlayers));
                        }}
                    >
                        Ajouter une personne à la liste
                    </MenuItemButton>
                    {wantedPlayers &&
                        wantedPlayers.map((player: any) => (
                            <MenuItemButton
                                key={player.id}
                                description="Retirer la personne de la liste"
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.PoliceDeleteWantedPlayer, {
                                        id: player.id,
                                        message: player.message,
                                    });
                                    setWantedPlayers(await fetchNui(NuiEvent.PoliceGetWantedPlayers));
                                }}
                            >
                                {player.message}
                            </MenuItemButton>
                        ))}
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};
