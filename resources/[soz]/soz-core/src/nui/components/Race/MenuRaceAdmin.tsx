import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '@public/nui/components/Styleguide/Menu';
import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { Race, RaceCheckpointMenuOptions } from '@public/shared/race';
import { FunctionComponent } from 'react';
import { useLocation } from 'react-router-dom';

type MenuRaceProps = {
    data: Race[];
};

export const MenuRaceAdmin: FunctionComponent<MenuRaceProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_mapper';
    const location = useLocation();

    fetchNui(NuiEvent.RaceCurrrent, location.pathname.replace('/' + MenuType.RaceAdmin, '').replace('/', ''));

    return (
        <Menu type={MenuType.RaceAdmin}>
            <MainMenu>
                <MenuTitle banner={banner}>Courses</MenuTitle>
                <MenuContent>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.RaceAdd)}>➕ Ajouter une course</MenuItemButton>
                    {data
                        .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
                        .map(race => {
                            return (
                                <MenuItemSubMenuLink key={race.name} id={race.id.toString()}>
                                    {race.name}
                                </MenuItemSubMenuLink>
                            );
                        })}
                </MenuContent>
            </MainMenu>
            {data.map(race => {
                return <RaceSubMenu key={race.name} data={race} />;
            })}
        </Menu>
    );
};

type MenuRaceSubProps = {
    data: Race;
};

export const RaceSubMenu: FunctionComponent<MenuRaceSubProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_mapper';

    return (
        <>
            <SubMenu id={data.id.toString()}>
                <MenuTitle banner={banner}>{data.name}</MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        checked={data.enabled}
                        onChange={value => fetchNui(NuiEvent.RaceEnable, { raceId: data.id, enabled: value })}
                    >
                        Activer la course
                    </MenuItemCheckbox>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.RaceRename, data.id)}>
                        Renommer la course
                    </MenuItemButton>
                    <MenuItemCheckbox
                        checked={data.display}
                        onChange={value => fetchNui(NuiEvent.RaceDisplay, { raceId: data.id, enabled: value })}
                    >
                        Afficher la course
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.fps}
                        onChange={value => fetchNui(NuiEvent.RaceFps, { raceId: data.id, enabled: value })}
                    >
                        Course en vue FPS
                    </MenuItemCheckbox>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.RaceTPStart, data.id)}>
                        Téléportation au départ
                    </MenuItemButton>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.RaceUpdateNPCLocation, data.id)}>
                        Changer la position du PNJ
                    </MenuItemButton>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.RaceUpdateStart, data.id)}>
                        Changer la position de départ
                    </MenuItemButton>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.RaceUpdateGarage, data.id)}>
                        Changer la position du garage
                    </MenuItemButton>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.RaceUpdateCarModel, data.id)}>
                        Voiture: {data.carModel}
                    </MenuItemButton>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.RaceClearRanking, data.id)}>
                        Vider le classement
                    </MenuItemButton>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.RaceDelete, data.id)}>Supprimer</MenuItemButton>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.RaceTry, data.id)}>Tester</MenuItemButton>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.RaceRun, data.id)}>Jouer</MenuItemButton>
                    <MenuItemSelect
                        title="Ajouter un checkpoint après"
                        value={data.checkpoints.length}
                        onConfirm={async (_, index) => {
                            await fetchNui(NuiEvent.RaceAddCheckpoint, {
                                raceId: data.id,
                                index: index,
                            });
                        }}
                        titleWidth={70}
                    >
                        {Array(data.checkpoints.length + 1)
                            .fill(0)
                            .map((_, index) => (
                                <MenuItemSelectOption value={index} key={`addcheckpoint_${index}`}>
                                    {index}
                                </MenuItemSelectOption>
                            ))}
                    </MenuItemSelect>
                    {data.checkpoints.map((zonename, index) => {
                        return (
                            <MenuItemSelect
                                title={'Checkpoint ' + (index + 1)}
                                key={'Checkpoint' + (index + 1)}
                                onConfirm={async (_, option) => {
                                    await fetchNui(NuiEvent.RaceUpdateCheckPoint, {
                                        raceId: data.id,
                                        index,
                                        option,
                                    });
                                }}
                            >
                                {Object.entries(RaceCheckpointMenuOptions).map(([key, value]) => (
                                    <MenuItemSelectOption value={value} key={'race_checkpoint_' + '_' + key}>
                                        {value}
                                    </MenuItemSelectOption>
                                ))}
                            </MenuItemSelect>
                        );
                    })}
                </MenuContent>
            </SubMenu>
        </>
    );
};
