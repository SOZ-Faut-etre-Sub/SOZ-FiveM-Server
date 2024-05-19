const getTimeZoneFormat = (zone: string) => {
    return new Intl.DateTimeFormat('en-US', {
        hour12: false,
        timeZone: zone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        era: 'short',
    });
};

type DateObject = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    era: string;
};

const getDateObject = (dtf: Intl.DateTimeFormat, date: Date): DateObject => {
    const formatted = dtf.formatToParts(date);
    const object = {};
    for (let i = 0; i < formatted.length; i++) {
        const { type, value } = formatted[i];

        if (type === 'era') {
            object[type] = value;
        } else {
            object[type] = parseInt(value, 10);
        }
    }
    return object as DateObject;
};

export const getOffsetForTimeZone = (zone: string): number => {
    const date = new Date();
    const dtf = getTimeZoneFormat(zone);
    const dateObject = getDateObject(dtf, date);
    const adjustedHour = dateObject.hour === 24 ? 0 : dateObject.hour;
    const dateInUtc = Date.UTC(
        dateObject.year,
        dateObject.month - 1,
        dateObject.day,
        adjustedHour,
        dateObject.minute,
        dateObject.second,
        date.getMilliseconds()
    );

    const offset = dateInUtc - date.getTime();

    return Math.round(offset / 1000);
};
