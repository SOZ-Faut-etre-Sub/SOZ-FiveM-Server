import { FunctionComponent, useState } from 'react';

import { JobType } from '../../../shared/job';
import { useNuiEvent } from '../../hook/nui';

export const TwitchNewsOverlay: FunctionComponent = () => {
    const [job, setJob] = useState<JobType>(null);

    useNuiEvent('hud', 'SetTwitchNewsOverlay', setJob);

    if (!job) {
        return null;
    }

    if (job === JobType.YouNews) {
        return (
            <div className="absolute bottom-[3vh] right-[5vh] width-[30vw] z-20 text-right">
                <img src="/public/images/twitch-news/logo-younews.webp" alt="TN logo" />
            </div>
        );
    }

    return (
        <div className="absolute bottom-[3vh] right-[5vh] width-[30vw] z-20 text-right">
            <img src="/public/images/twitch-news/logo.webp" alt="TN logo" />
        </div>
    );
};
