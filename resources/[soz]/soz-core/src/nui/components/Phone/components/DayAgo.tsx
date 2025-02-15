import { useInterval } from '@public/nui/hook/useInterval';
import { formatDistanceStrict, formatISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FunctionComponent, useState } from 'react';

interface DayAgoProps {
    timestamp: string | number | Date;
}

export const DayAgo: FunctionComponent<DayAgoProps> = ({ timestamp }) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const valueAsDate = new Date(timestamp);

    useInterval(() => {
        setCurrentDate(new Date());
    }, 1000);

    if (isNaN(valueAsDate.getTime()) || valueAsDate.getTime() <= 0) {
        return <time>unknown</time>;
    }

    return (
        <time dateTime={formatISO(valueAsDate)}>
            {formatDistanceStrict(valueAsDate, currentDate, { locale: fr, addSuffix: true })}
        </time>
    );
};
