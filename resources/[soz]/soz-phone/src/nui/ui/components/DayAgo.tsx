import 'dayjs/locale/fr';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FunctionComponent, useState } from 'react';

import useInterval from '../../hooks/useInterval';

dayjs.extend(relativeTime);

type Props = {
    timestamp: string | number;
};

export const DayAgo: FunctionComponent<Props> = ({ timestamp }) => {
    const [currentDate, setCurrentDate] = useState<number>(new Date().getTime());

    useInterval(() => {
        setCurrentDate(new Date().getTime());
    }, 1000);

    return <>{dayjs(timestamp).locale('fr').from(currentDate, true)}</>;
};
