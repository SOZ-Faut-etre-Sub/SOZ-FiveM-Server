type Time = {
    hour: number;
    minute: number;
    second: number;
};

export const extractTime = (time: string) => {
    const [hour, minute] = time.split(':');
    return { hour: Number(hour), minute: Number(minute), second: 0 };
};

export const advanceTime = (time: Time, durationInMs: number) => {
    const incrementSeconds = durationInMs / 1000;
    time.second += incrementSeconds;
    if (time.second >= 60) {
        const incrementMinutes = Math.floor(time.second / 60);

        time.minute += incrementMinutes;
        time.second %= 60;

        if (time.minute >= 60) {
            const incrementHours = Math.floor(time.minute / 60);

            time.hour += incrementHours;
            time.minute %= 60;

            if (time.hour >= 24) {
                time.hour %= 24;
            }
        }
    }
    return time;
};

export const isDay = (time: Time) => {
    return time.hour >= 6 && time.hour < 21;
};
