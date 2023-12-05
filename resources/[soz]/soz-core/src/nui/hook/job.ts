import { useEffect, useState } from 'react';

import { NuiEvent } from '../../shared/event';
import { Job } from '../../shared/job';
import { isOk, Result } from '../../shared/result';
import { fetchNui } from '../fetch';

export const useJobs = (): Job[] => {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        fetchNui<void, Result<Job[], never>>(NuiEvent.AdminGetJobs).then(result => {
            if (isOk(result)) {
                setJobs(result.ok);
            }
        });
    }, []);

    return jobs;
};
