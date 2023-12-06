import { useEffect, useState } from 'react';

import { NuiEvent } from '../../shared/event';
import { JobGrade } from '../../shared/job';
import { isOk, Result } from '../../shared/result';
import { fetchNui } from '../fetch';

export const useJobGrades = (): JobGrade[] => {
    const [jobGrades, setJobGrades] = useState<JobGrade[]>([]);

    useEffect(() => {
        fetchNui<void, Result<JobGrade[], never>>(NuiEvent.AdminGetJobGrades).then(result => {
            if (isOk(result)) {
                setJobGrades(result.ok);
            }
        });
    }, []);

    return jobGrades;
};
