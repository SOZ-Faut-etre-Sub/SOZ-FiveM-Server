import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
    useIsInSubMenu,
} from '@public/nui/components/Styleguide/Menu';
import { fetchNui } from '@public/nui/fetch';
import { usePlayer } from '@public/nui/hook/data';
import { useRepository } from '@public/nui/hook/repository';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { RepositoryType } from '@public/shared/repository';
import { TravelingCamera } from '@public/shared/traveling';
import { FunctionComponent, useLayoutEffect } from 'react';

export const MenuTraveling: FunctionComponent = () => {
    const player = usePlayer();
    const travelings = Object.values(useRepository(RepositoryType.Traveling)).filter(
        elem => ['staff', 'admin'].includes(player.role) || player.job.id === elem.job
    );

    return (
        <Menu type={MenuType.Traveling}>
            <MainMenu>
                <MenuTitle title="Prise de vue" />
                <MenuContent>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.TravelingAdd)}>
                        ➕ Ajouter une prise de vue
                    </MenuItemButton>
                    {travelings
                        .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name))
                        .map(traveling => {
                            return (
                                <MenuItemSubMenuLink key={traveling.name} id={traveling.id.toString()}>
                                    {traveling.name}
                                </MenuItemSubMenuLink>
                            );
                        })}
                </MenuContent>
            </MainMenu>
            {travelings.map(traveling => {
                return <MenuSubTraveling key={traveling.name} data={traveling} />;
            })}
        </Menu>
    );
};

type MenuTravelingSubProps = {
    data: TravelingCamera;
};

const MenuSubTraveling: FunctionComponent<MenuTravelingSubProps> = ({ data }) => {
    const inSubMenu = useIsInSubMenu(data.id.toString());

    useLayoutEffect(() => {
        if (inSubMenu) {
            fetchNui(NuiEvent.TravelingStartEditing, data.id);
        }

        return () => {
            if (inSubMenu) {
                fetchNui(NuiEvent.TravelingStopEditing, data.id);
            }
        };
    }, [inSubMenu]);

    return (
        <>
            <SubMenu id={data.id.toString()}>
                <MenuTitle title={`Prise de vue: ${data.name}`} />
                <MenuContent>
                    <MenuItemSelect
                        title="➕ Ajouter un point après"
                        value={data.points.length}
                        onConfirm={async (_, index) => {
                            await fetchNui(NuiEvent.TravelingPointAdd, {
                                id: data.id,
                                index: index,
                            });
                        }}
                        titleWidth={70}
                    >
                        {Array(data.points.length + 1)
                            .fill(0)
                            .map((_, index) => (
                                <MenuItemSelectOption value={index} key={`addcheckpoint_${index}`}>
                                    {index}
                                </MenuItemSelectOption>
                            ))}
                    </MenuItemSelect>
                    {data.points.map((point, index) => {
                        return (
                            <MenuItemSelect
                                title={index + 1}
                                key={index}
                                onConfirm={async (_, option) => {
                                    await fetchNui(NuiEvent.TravelingPointUpdate, {
                                        id: data.id,
                                        index,
                                        option,
                                    });
                                }}
                                titleWidth={20}
                                description={
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span>FOV</span>
                                            <span className="mr-1">{point.fov}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Délai</span>
                                            <span className="mr-1">{point.wait}</span>
                                        </div>
                                    </>
                                }
                            >
                                <MenuItemSelectOption value="editPos">Editer position/rotation</MenuItemSelectOption>
                                <MenuItemSelectOption value="editFov">Editer FOV</MenuItemSelectOption>
                                <MenuItemSelectOption value="editDelay">Editer délai</MenuItemSelectOption>
                                <MenuItemSelectOption value="tp">Téléporter</MenuItemSelectOption>
                                <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                            </MenuItemSelect>
                        );
                    })}
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.TravelingLaunch, data.id)}>
                        ✅ Lancer
                    </MenuItemButton>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.TravelingRename, data.id)}>
                        ✎ Renommer
                    </MenuItemButton>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.TravelingDelete, data.id)}>
                        ❌ Supprimer
                    </MenuItemButton>
                </MenuContent>
            </SubMenu>
        </>
    );
};
