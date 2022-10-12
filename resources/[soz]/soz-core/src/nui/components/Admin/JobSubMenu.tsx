import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { Job } from '../../../shared/job';
import { fetchNui } from '../../fetch';
import { useNuiEvent } from '../../hook/nui';
import {
    MenuContent,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type JobSubMenuProps = {
    banner: string;
    updateState: (namespace: 'job', key: keyof JobSubMenuProps['state'], value: any) => void;
    state: {
        currentJobIndex: number;
        currentJobGradeIndex: number;
        isOnDuty: boolean;
    };
};

export interface NuiAdminJobSubMenuMethodMap {
    SetJobs: Job[];
}

export const JobSubMenu: FunctionComponent<JobSubMenuProps> = ({ banner, state, updateState }) => {
    const [isOnDuty, setIsOnDuty] = useState<boolean>(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [grades, setGrades] = useState<Job['grades']>([]);

    useNuiEvent('admin_job_submenu', 'SetJobs', jobs => {
        setJobs(jobs);
        setGrades(jobs[0].grades);
    });

    useEffect(() => {
        if (jobs !== null && jobs.length === 0) {
            fetchNui<void, Job[]>(NuiEvent.AdminGetJobs).then();
        }
    }, [jobs]);

    useEffect(() => {
        if (jobs.length > 0 && state.currentJobIndex) {
            setGrades(jobs[state.currentJobIndex].grades);
        }
    }, [state.currentJobIndex, jobs]);

    if (!jobs) {
        return null;
    }

    return (
        <SubMenu id="job">
            <MenuTitle banner={banner}>Pour se construire un avenir</MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title="Changer de métier"
                    value={state.currentJobIndex || 0}
                    onConfirm={async selectedIndex => {
                        const job = jobs[selectedIndex];

                        updateState('job', 'currentJobIndex', selectedIndex);

                        if (job.grades && Object.keys(job.grades).length > 0) {
                            const currentJobGrade = Object.values(jobs[selectedIndex].grades)[0];

                            await fetchNui(NuiEvent.AdminSetJob, { jobId: job.id, jobGrade: currentJobGrade });
                            return;
                        }

                        await fetchNui(NuiEvent.AdminSetJob, { jobId: job.id, jobGrade: 0 });
                    }}
                >
                    {jobs.map(job => (
                        <MenuItemSelectOption key={'job_' + job.id}>{job.label}</MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title="Changer de grade"
                    value={state.currentJobGradeIndex || 0}
                    onConfirm={async selectedIndex => {
                        const job = jobs[state.currentJobIndex];
                        const currentJobGrade = job.grades[Object.keys(job.grades)[selectedIndex]].id;

                        await fetchNui(NuiEvent.AdminSetJob, { jobId: job.id, jobGrade: currentJobGrade });
                        await updateState('job', 'currentJobGradeIndex', selectedIndex);
                    }}
                >
                    {grades.map(grade => (
                        <MenuItemSelectOption key={'grade_' + state.currentJobIndex + '_' + grade.id}>
                            {grade.name}
                        </MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemCheckbox
                    checked={isOnDuty}
                    onChange={async value => {
                        setIsOnDuty(value);
                        await fetchNui(NuiEvent.AdminToggleDuty, value);
                        updateState('job', 'isOnDuty', value);
                    }}
                >
                    Passer en service
                </MenuItemCheckbox>
            </MenuContent>
        </SubMenu>
    );
};
