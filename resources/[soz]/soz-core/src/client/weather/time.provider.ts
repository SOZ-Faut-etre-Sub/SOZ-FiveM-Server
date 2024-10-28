import { Inject } from '@public/core/decorators/injectable';
import { Tick } from '@public/core/decorators/tick';
import { Logger } from '@public/core/logger';
import { Feature } from '@public/shared/features';

import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import {
    addSecondstoTime,
    convertTimetoSeconds,
    DayDurationInMinutes,
    IRLDayDurationInMinutes,
    Time,
} from '../../shared/weather';
import { FeatureProvider } from '../feature/feature.provider';

const MAX_SPEED = 1000;
const MAX_DELTA_SPEED = 2 * 3600;
const SPEED_ACCELERATION = 20;

@Provider()
export class TimeProvider {
    @Inject(Logger)
    private logger: Logger;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    private init = false;
    private baseSpeed = (DayDurationInMinutes * 60_000) / IRLDayDurationInMinutes;
    private coefSpeed = 1;

    private serverTime: Time = null;
    private serverSyncTimestamp = 0;

    @OnEvent(ClientEvent.STATE_UPDATE_TIME)
    async onTimeChange(time: Time) {
        if (this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            NetworkOverrideClockTime(time.hour, time.minute, time.second);
            return;
        }

        this.serverTime = time;
        this.serverSyncTimestamp = Date.now();
    }

    @Tick(100)
    public manageClockSpeed() {
        if (!this.serverTime) {
            return;
        }

        if (this.featureProvider.isFeatureEnabled(Feature.Halloween)) {
            return;
        }

        const cur: Time = {
            hour: GetClockHours(),
            minute: GetClockMinutes(),
            second: GetClockSeconds(),
        };

        const estimatedServerTime = { ...this.serverTime };
        addSecondstoTime(
            estimatedServerTime,
            Math.round(
                ((IRLDayDurationInMinutes / DayDurationInMinutes) * (Date.now() - this.serverSyncTimestamp)) / 1000
            )
        );

        if (!this.init) {
            NetworkOverrideClockMillisecondsPerGameMinute(this.baseSpeed);
            NetworkOverrideClockTime(estimatedServerTime.hour, estimatedServerTime.minute, estimatedServerTime.second);
            this.init = true;
            return;
        }

        const curCorrected: Time = { ...cur };
        const estimatedCorrectedServerTime = { ...estimatedServerTime };
        if (estimatedServerTime.hour - cur.hour > 12) {
            curCorrected.hour = cur.hour + 24;
        } else if (cur.hour - estimatedServerTime.hour > 12) {
            estimatedCorrectedServerTime.hour = estimatedServerTime.hour + 24;
        }

        let timeDiff = convertTimetoSeconds(estimatedCorrectedServerTime) - convertTimetoSeconds(curCorrected);

        if (-30 < timeDiff && timeDiff < 30) {
            return;
        }

        if (-900 < timeDiff && timeDiff < 60) {
            SetMillisecondsPerGameMinute(this.baseSpeed);
            NetworkOverrideClockTime(estimatedServerTime.hour, estimatedServerTime.minute, estimatedServerTime.second);
            this.coefSpeed = 1;
            return;
        }

        if (this.coefSpeed == 1) {
            this.logger.info(
                'Timediff ' +
                    timeDiff +
                    ' Server time ' +
                    this.serverTime.hour +
                    ':' +
                    this.serverTime.minute +
                    ':' +
                    this.serverTime.second +
                    ' delta (ms) ' +
                    (Date.now() - this.serverSyncTimestamp) +
                    ' Server estimated time ' +
                    estimatedServerTime.hour +
                    ':' +
                    estimatedServerTime.minute +
                    ':' +
                    estimatedServerTime.second +
                    ' Client time ' +
                    cur.hour +
                    ':' +
                    cur.minute +
                    ':' +
                    cur.second
            );
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

        NetworkOverrideClockMillisecondsPerGameMinute(Math.round(this.baseSpeed / this.coefSpeed));
        NetworkOverrideClockTime(cur.hour, cur.minute, cur.second);
    }
}
