import { SozRole } from '@core/permissions';
import { useJobGrades } from '@public/nui/hook/job';
import { NuiEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { JobRegistry } from '@public/shared/job/config';
import { FunctionComponent } from 'react';

import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import {
    MenuContent,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type JobSubMenuProps = {
    permission: SozRole;
};

export const JobSubMenu: FunctionComponent<JobSubMenuProps> = ({ permission }) => {
    const player = usePlayer();
    const jobGrades = useJobGrades();

    if (!jobGrades || !player) {
        return null;
    }

    const jobIds = Object.keys(JobRegistry) as JobType[];
    const grades = jobGrades.filter(grade => grade.jobId === player.job.id);

    return (
        <SubMenu id="job">
            <MenuTitle title={permission} />
            <MenuContent subtitle="Pour se construire un avenir">
                <MenuItemSelect
                    title="Changer de métier"
                    value={player.job.id}
                    onConfirm={async (index, jobId) => {
                        await fetchNui(NuiEvent.AdminSetJob, { jobId });
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
                <MenuItemSelect
                    title="Changer de grade"
                    value={player.job.grade.toString()}
                    onConfirm={async (selectedIndex, grade) => {
                        await fetchNui(NuiEvent.AdminSetJob, { jobId: player.job.id, jobGrade: grade });
                    }}
                >
                    {grades.map(grade => (
                        <MenuItemSelectOption
                            value={grade.id.toString()}
                            key={'grade_' + player.job.id + '_' + grade.id}
                        >
                            {grade.name}
                        </MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemCheckbox
                    checked={player.job.onduty}
                    onChange={async value => {
                        await fetchNui(NuiEvent.AdminToggleDuty, value);
                    }}
                >
                    Passer en service
                </MenuItemCheckbox>
            </MenuContent>
        </SubMenu>
    );
};
