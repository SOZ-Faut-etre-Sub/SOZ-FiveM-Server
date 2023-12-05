import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FunctionComponent, useState } from 'react';

import useInterval from '../../hooks/useInterval';

type Props = {
    timestamp: string | number;
};

export const DayAgo: FunctionComponent<Props> = ({ timestamp }) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    useInterval(() => {
        setCurrentDate(new Date());
    }, 1000);

    let date;

    try {
        date = new Date(timestamp);
    } catch (e) {
        date = new Date();
    }

    return (
        <>
            {formatDistance(currentDate, date, {
                locale: fr,
            })}
        </>
    );
};
