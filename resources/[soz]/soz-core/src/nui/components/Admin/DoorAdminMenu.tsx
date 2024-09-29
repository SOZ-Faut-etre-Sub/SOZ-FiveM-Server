import { fetchNui } from '@public/nui/fetch';
import { useRepository } from '@public/nui/hook/repository';
import { NuiEvent } from '@public/shared/event/nui';
import { JobType } from '@public/shared/job';
import { JobRegistry } from '@public/shared/job/config';
import { AskInput } from '@public/shared/nui/input';
import { RepositoryType } from '@public/shared/repository';
import { FunctionComponent } from 'react';

import { defaultDrawDistance, defaultInteractionDistance } from '../../../shared/interaction';
import { MenuType } from '../../../shared/nui/menu';
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
} from '../Styleguide/Menu';

export type DoorMenuStateProps = {
    data: string;
};

export const DoorGangSubMenu: FunctionComponent<DoorMenuStateProps> = ({ data }) => {
    const doors = useRepository(RepositoryType.Door);
    const gangs = useRepository(RepositoryType.Gang);

    const door = doors[data];

    if (!doors || !gangs) {
        return;
    }

    return (
        <SubMenu id="gang">
            <MenuTitle banner="https://nui-img/soz/menu_mapper">Gestion de Porte - Gang</MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title="Ajouter"
                    onConfirm={async (index, gangId) => {
                        door.gangs.push(gangId);
                        fetchNui(NuiEvent.AdminDoorSetState, door);
                    }}
                >
                    {Object.values(gangs).map(gang => {
                        return (
                            <MenuItemSelectOption value={gang.id} key={'gang_' + gang.id}>
                                {gang.name}
                            </MenuItemSelectOption>
                        );
                    })}
                </MenuItemSelect>
                {door.gangs &&
                    door.gangs.map((gangId, index) => {
                        const gang = Object.values(gangs).find(gang => gang.id == gangId);
                        return (
                            <MenuItemButton
                                onConfirm={async () => {
                                    door.gangs.splice(index, 1);
                                    fetchNui(NuiEvent.AdminDoorSetState, door);
                                }}
                                key={'DoorGangSubMenu' + index}
                            >
                                Supprimer {gang?.name || gangId}
                            </MenuItemButton>
                        );
                    })}
            </MenuContent>
        </SubMenu>
    );
};

export const DoorJobSubMenu: FunctionComponent<DoorMenuStateProps> = ({ data }) => {
    const jobIds = Object.keys(JobRegistry) as JobType[];
    const doors = useRepository(RepositoryType.Door);
    const door = doors[data];

    if (!door) {
        return null;
    }

    return (
        <SubMenu id="job">
            <MenuTitle banner="https://nui-img/soz/menu_mapper">Gestion de Porte - Métier</MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title="Ajouter"
                    onConfirm={async (index, jobId) => {
                        door.jobs.push(jobId);
                        fetchNui(NuiEvent.AdminDoorSetState, door);
                    }}
                >
                    {jobIds.map(jobId => {
                        const job = JobRegistry[jobId];

                        return (
                            <MenuItemSelectOption value={jobId} key={'job_' + jobId}>
                                {job.label}
                            </MenuItemSelectOption>
                        );
                    })}
                </MenuItemSelect>
                {door.jobs &&
                    door.jobs.map((job, index) => {
                        return (
                            <MenuItemButton
                                onConfirm={async () => {
                                    door.jobs.splice(index, 1);
                                    fetchNui(NuiEvent.AdminDoorSetState, door);
                                }}
                                key={'DoorJobSubMenu' + index}
                            >
                                Supprimer {JobRegistry[job].label}
                            </MenuItemButton>
                        );
                    })}
            </MenuContent>
        </SubMenu>
    );
};

export const DoorKeySubMenu: FunctionComponent<DoorMenuStateProps> = ({ data }) => {
    const doors = useRepository(RepositoryType.Door);
    const door = doors[data];

    if (!door) {
        return null;
    }

    return (
        <SubMenu id="key">
            <MenuTitle banner="https://nui-img/soz/menu_mapper">Gestion de Porte - Clef</MenuTitle>
            <MenuContent>
                <MenuItemButton
                    onConfirm={async () => {
                        const inputData: AskInput = {
                            title: 'Valeur de clef',
                        };
                        fetchNui<any, string>(NuiEvent.AskInput, inputData).then(async input => {
                            door.keyMetadata.push(input);
                            await fetchNui(NuiEvent.AdminDoorSetState, door);
                        });
                    }}
                >
                    Ajouter une valeur de clef
                </MenuItemButton>
                {door.keyMetadata &&
                    door.keyMetadata.map((key, index) => {
                        return (
                            <MenuItemButton
                                onConfirm={async () => {
                                    door.keyMetadata.splice(index, 1);
                                    fetchNui(NuiEvent.AdminDoorSetState, door);
                                }}
                                key={'DoorKeySubMenu' + index}
                            >
                                Supprimer {key}
                            </MenuItemButton>
                        );
                    })}
            </MenuContent>
        </SubMenu>
    );
};

export const DoorAdminMenu: FunctionComponent<DoorMenuStateProps> = ({ data }) => {
    const doors = useRepository(RepositoryType.Door);
    const door = doors[data];

    if (!door) {
        return null;
    }

    return (
        <Menu type={MenuType.DoorAdmin}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Gestion de Porte</MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        checked={door.lock}
                        onChange={async value => {
                            door.lock = value;
                            fetchNui(NuiEvent.AdminDoorSetState, door);
                        }}
                    >
                        Verrouillée
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={door.holdOpen}
                        onChange={async value => {
                            door.holdOpen = value;
                            fetchNui(NuiEvent.AdminDoorSetState, door);
                        }}
                    >
                        Reste Ouverte
                    </MenuItemCheckbox>
                    <MenuItemButton
                        onConfirm={async () => {
                            fetchNui(NuiEvent.AdminDoorAddSub, door.id);
                        }}
                    >
                        Ajouter un battant
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            fetchNui(NuiEvent.AdminDoorDelete, door.id);
                        }}
                    >
                        Supprimer la porte
                    </MenuItemButton>

                    <MenuTitle>Intéraction</MenuTitle>
                    <MenuItemButton
                        onConfirm={async () => {
                            fetchNui(NuiEvent.AdminDoorSetTarget, { id: door.id, type: 'draw' });
                        }}
                    >
                        <div className="pr-2 flex items-center justify-between">
                            <span>Modifier la distance d'affichage</span>
                            <span>{door.target?.draw || defaultDrawDistance}</span>
                        </div>
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            fetchNui(NuiEvent.AdminDoorSetTarget, { id: door.id, type: 'interaction' });
                        }}
                    >
                        <div className="pr-2 flex items-center justify-between">
                            <span>Modifier la distance d'intéraction</span>
                            <span>{door.target?.interaction || defaultInteractionDistance}</span>
                        </div>
                    </MenuItemButton>

                    <MenuTitle>Permissions</MenuTitle>
                    <MenuItemSubMenuLink id="gang">Gang</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="job">Métier</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="key">Clef</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <DoorGangSubMenu data={data} />
            <DoorJobSubMenu data={data} />
            <DoorKeySubMenu data={data} />
        </Menu>
    );
};
