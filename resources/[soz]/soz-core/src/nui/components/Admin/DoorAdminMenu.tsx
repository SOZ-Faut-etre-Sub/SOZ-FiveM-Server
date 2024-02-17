import { Gang } from '@private/shared/gang';
import { fetchNui } from '@public/nui/fetch';
import { Door } from '@public/shared/door';
import { NuiEvent } from '@public/shared/event/nui';
import { JobType } from '@public/shared/job';
import { JobRegistry } from '@public/shared/job/config';
import { AskInput } from '@public/shared/nui/input';
import { FunctionComponent, useEffect, useState } from 'react';

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
    MenuItemText,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type DoorMenuStateProps = {
    data: Door;
};

export const DoorGangSubMenu: FunctionComponent<DoorMenuStateProps> = ({ data }) => {
    const [gangs, setGangs] = useState<Gang[]>(null);
    const [assignedGangs, setAssignedGangs] = useState<number[]>(data.gangs);

    useEffect(() => {
        fetchNui<never, Gang[]>(NuiEvent.GangFetch).then(result => {
            setGangs(result);
        });
    }, []);

    if (!gangs) {
        return;
    }

    return (
        <SubMenu id="gang">
            <MenuTitle banner="https://nui-img/soz/menu_mapper">Gestion de Porte - Gang</MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title="Ajouter"
                    onConfirm={async (index, gangId) => {
                        if (data.gangs) {
                            data.gangs.push(gangId);
                        } else {
                            data.gangs = [gangId];
                        }
                        await fetchNui(NuiEvent.AdminDoorSetState, data);
                        setAssignedGangs(data.gangs);
                    }}
                >
                    {gangs.map(gang => {
                        return (
                            <MenuItemSelectOption value={gang.id} key={'gang_' + gang.id}>
                                {gang.name}
                            </MenuItemSelectOption>
                        );
                    })}
                </MenuItemSelect>
                {assignedGangs &&
                    assignedGangs.map((gangId, index) => {
                        const gang = gangs.find(gang => gang.id == gangId);
                        return (
                            <MenuItemButton
                                onConfirm={async () => {
                                    data.gangs.splice(index, 1);
                                    await fetchNui(NuiEvent.AdminDoorSetState, data);
                                    setAssignedGangs(data.gangs);
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
    const [assignedJobs, setAssignedJobs] = useState<JobType[]>(data.jobs);

    return (
        <SubMenu id="job">
            <MenuTitle banner="https://nui-img/soz/menu_mapper">Gestion de Porte - Métier</MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title="Ajouter"
                    onConfirm={async (index, jobId) => {
                        if (data.jobs) {
                            data.jobs.push(jobId);
                        } else {
                            data.jobs = [jobId];
                        }
                        await fetchNui(NuiEvent.AdminDoorSetState, data);
                        setAssignedJobs(data.jobs);
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
                {assignedJobs &&
                    assignedJobs.map((job, index) => {
                        return (
                            <MenuItemButton
                                onConfirm={async () => {
                                    data.jobs.splice(index, 1);
                                    await fetchNui(NuiEvent.AdminDoorSetState, data);
                                    setAssignedJobs(data.jobs);
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
    const [assignedKeys, setAssignedKeys] = useState<string[]>(data.keyMetadata);

    return (
        <SubMenu id="key">
            <MenuTitle banner="https://nui-img/soz/menu_mapper">Gestion de Porte - Clef</MenuTitle>
            <MenuContent>
                <MenuItemButton
                    onConfirm={async () => {
                        const inputData: AskInput = {
                            title: 'Valeur de clef',
                        };
                        await fetchNui<any, string>(NuiEvent.AskInput, inputData).then(async input => {
                            if (data.keyMetadata) {
                                data.keyMetadata.push(input);
                            } else {
                                data.keyMetadata = [input];
                            }
                            await fetchNui(NuiEvent.AdminDoorSetState, data);
                            setAssignedKeys(data.keyMetadata);
                        });
                    }}
                >
                    Ajouter une valeur de clef
                </MenuItemButton>
                {assignedKeys &&
                    assignedKeys.map((key, index) => {
                        return (
                            <MenuItemButton
                                onConfirm={async () => {
                                    data.keyMetadata.splice(index, 1);
                                    await fetchNui(NuiEvent.AdminDoorSetState, data);
                                    setAssignedKeys(data.keyMetadata);
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
    return (
        <Menu type={MenuType.DoorAdmin}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_mapper">Gestion de Porte</MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        checked={data.lock}
                        onChange={async value => {
                            data.lock = value;
                            await fetchNui(NuiEvent.AdminDoorSetState, data);
                        }}
                    >
                        Verrouillé
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.holdOpen}
                        onChange={async value => {
                            data.holdOpen = value;
                            await fetchNui(NuiEvent.AdminDoorSetState, data);
                        }}
                    >
                        Reste Ouverte
                    </MenuItemCheckbox>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminDoorAddSub, data.id);
                        }}
                    >
                        Ajouter un battant
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.AdminDoorDelete, data.id);
                        }}
                    >
                        Supprimer la porte
                    </MenuItemButton>
                    <MenuItemText>Permissions</MenuItemText>
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
