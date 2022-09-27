import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { Job } from '../../../shared/job';
import { fetchNui } from '../../fetch';
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
        currentJob: string;
        currentJobGrade: string;
        isOnDuty: boolean;
    };
};

export const JobSubMenu: FunctionComponent<JobSubMenuProps> = ({ banner, state, updateState }) => {
    const [currentJobId, setCurrentJobId] = useState<string>(undefined);
    const [isOnDuty, setIsOnDuty] = useState<boolean>(false);
    const [jobs, setJobs] = useState<Job[]>(null);
    const [grades, setGrades] = useState<Job['grades']>(null);

    if (!jobs) {
        fetchNui<void, Job[]>(NuiEvent.AdminGetJobs).then(setJobs);
    }

    useEffect(() => {
        if (state && state.isOnDuty) {
            setIsOnDuty(state.isOnDuty);
        }
    });

    useEffect(() => {
        if (currentJobId) {
            setGrades(jobs[currentJobId].grades);
        }
    }, [currentJobId]);

    if (!jobs) {
        return null;
    }

    return (
        <SubMenu id="job">
            <MenuTitle banner={banner}>Pour se construire un avenir</MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title="Changer de métier"
                    onConfirm={async selectedIndex => {
                        const jobId = Object.keys(jobs)[selectedIndex];

                        setCurrentJobId(jobId);
                    }}
                >
                    {Object.entries(jobs)
                        .sort(([, a], [, b]) => a.label.localeCompare(b.label))
                        .map(([jobId, job]) => (
                            <MenuItemSelectOption key={jobId}>{job.label}</MenuItemSelectOption>
                        ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title="Changer de grade"
                    onConfirm={async selectedIndex => {
                        const job = jobs[currentJobId];
                        const currentJobGrade = job.grades[Object.keys(job.grades)[selectedIndex]].id;

                        await fetchNui(NuiEvent.AdminSetJob, { jobId: currentJobId, jobGrade: currentJobGrade });
                        await updateState('job', 'currentJobGrade', currentJobGrade);
                    }}
                >
                    {grades &&
                        Object.entries(grades)
                            .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                            .map(([gradeId, grade]) => (
                                <MenuItemSelectOption key={gradeId}>{grade.name}</MenuItemSelectOption>
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
