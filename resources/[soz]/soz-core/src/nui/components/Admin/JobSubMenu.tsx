import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { Job, JobType } from '../../../shared/job';
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
        currentJobIndex: number;
        currentJobGradeIndex: number;
        isOnDuty: boolean;
    };
};

export const JobSubMenu: FunctionComponent<JobSubMenuProps> = ({ banner, state, updateState }) => {
    const [currentJobId, setCurrentJobId] = useState<JobType>(undefined);
    const [currentJobIndex, setCurrentJobIndex] = useState<number>(undefined);
    const [currentJobGradeIndex, setCurrentJobGradeIndex] = useState<number>(undefined);
    const [isOnDuty, setIsOnDuty] = useState<boolean>(false);
    const [jobs, setJobs] = useState<Job[]>(null);
    const [grades, setGrades] = useState<Job['grades']>(null);

    useEffect(() => {
        if (!jobs) {
            fetchNui<void, Job[]>(NuiEvent.AdminGetJobs).then(setJobs);
        }
        if (state && state.isOnDuty) {
            setIsOnDuty(state.isOnDuty);
        }
        if (state && state.currentJobIndex !== undefined) {
            setCurrentJobIndex(state.currentJobIndex);
        }
        if (state && state.currentJobGradeIndex !== undefined) {
            setCurrentJobGradeIndex(state.currentJobGradeIndex);
        }
    }, [state, jobs]);

    useEffect(() => {
        if (currentJobIndex) {
            setGrades(jobs[currentJobIndex].grades);
        }
    }, [currentJobIndex]);

    if (!jobs || typeof jobs !== 'array') {
        return null;
    }

    return (
        <SubMenu id="job">
            <MenuTitle banner={banner}>Pour se construire un avenir</MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title="Changer de métier"
                    value={currentJobIndex || 0}
                    onConfirm={async selectedIndex => {
                        const jobId = jobs[selectedIndex].id;

                        setCurrentJobId(jobId);
                        setCurrentJobIndex(selectedIndex);
                        updateState('job', 'currentJobIndex', selectedIndex);
                    }}
                >
                    {jobs.map(job => (
                        <MenuItemSelectOption key={job.id}>{job.label}</MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title="Changer de grade"
                    value={currentJobGradeIndex || 0}
                    onConfirm={async selectedIndex => {
                        const job = jobs[currentJobIndex];
                        const currentJobGrade = job.grades[Object.keys(job.grades)[selectedIndex]].id;

                        setCurrentJobGradeIndex(selectedIndex);
                        await fetchNui(NuiEvent.AdminSetJob, { jobId: currentJobId, jobGrade: currentJobGrade });
                        await updateState('job', 'currentJobGradeIndex', selectedIndex);
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
