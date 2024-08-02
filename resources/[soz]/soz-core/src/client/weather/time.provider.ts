import { Tick } from '@public/core/decorators/tick';

import { Once, OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import {
    addSecondstoTime,
    convertTimetoSeconds,
    DayDurationInMinutes,
    IRLDayDurationInMinutes,
    Time,
} from '../../shared/weather';

const MAX_SPEED = 1000;
const MAX_DELTA_SPEED = 2 * 3600;
const SPEED_ACCELERATION = 20;

@Provider()
export class TimeProvider {
    private init = false;
    private baseSpeed = (DayDurationInMinutes * 60_000) / IRLDayDurationInMinutes;
    private coefSpeed = 1;

    private serverTime: Time = null;
    private serverSyncTimestamp = 0;

    @OnEvent(ClientEvent.STATE_UPDATE_TIME)
    async onTimeChange(time: Time) {
        this.serverTime = time;
        this.serverSyncTimestamp = Date.now();
        if (!this.init) {
            SetClockTime(time.hour, time.minute, time.second);
            NetworkOverrideClockTime(time.hour, time.minute, time.second);
            this.init = true;
            return;
        }
    }

    @Once()
    onStart(): void {
        SetMillisecondsPerGameMinute(this.baseSpeed);
    }

    @Tick(100)
    public manageClockSpeed() {
        if (!this.serverTime) {
            return;
        }

        const cur: Time = {
            hour: GetClockHours(),
            minute: GetClockMinutes(),
            second: GetClockSeconds(),
        };
        const curCorrected: Time = { ...cur };

        const estimatedServerTime = { ...this.serverTime };
        addSecondstoTime(
            estimatedServerTime,
            Math.round(
                ((IRLDayDurationInMinutes / DayDurationInMinutes) * (Date.now() - this.serverSyncTimestamp)) / 1000
            )
        );

        if (cur.hour == 0 && estimatedServerTime.hour == 23) {
            curCorrected.hour = 24;
        } else if (cur.hour == 23 && estimatedServerTime.hour == 0) {
            estimatedServerTime.hour = 24;
        }

        let timeDiff = convertTimetoSeconds(estimatedServerTime) - convertTimetoSeconds(curCorrected);

        const absTimeDiff = Math.abs(timeDiff);
        if (absTimeDiff < 20) {
            return;
        }
        if (absTimeDiff < 30) {
            SetClockTime(estimatedServerTime.hour, estimatedServerTime.minute, estimatedServerTime.second);
            NetworkOverrideClockTime(estimatedServerTime.hour, estimatedServerTime.minute, estimatedServerTime.second);
            SetMillisecondsPerGameMinute(this.baseSpeed);
            this.coefSpeed = 1;
            return;
        }

        if (timeDiff < 0) {
            timeDiff += 3600 * 24;
        }

        let expected = MAX_SPEED;
        if (timeDiff < MAX_DELTA_SPEED) {
            expected = (MAX_SPEED * timeDiff) / MAX_DELTA_SPEED + 1;
        }

        if (this.coefSpeed > expected) {
            this.coefSpeed = expected;
        } else {
            this.coefSpeed += SPEED_ACCELERATION;
            this.coefSpeed = Math.min(expected, this.coefSpeed);
        }

        SetMillisecondsPerGameMinute(Math.round(this.baseSpeed / this.coefSpeed));
        SetClockTime(cur.hour, cur.minute, cur.second);
        NetworkOverrideClockTime(cur.hour, cur.minute, cur.second);
    }
}
