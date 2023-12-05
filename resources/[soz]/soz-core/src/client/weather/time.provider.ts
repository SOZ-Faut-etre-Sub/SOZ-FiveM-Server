import { Once, OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { Time } from '../../shared/weather';

@Provider()
export class TimeProvider {
    @OnEvent(ClientEvent.STATE_UPDATE_TIME)
    async onTimeChange(time: Time) {
        NetworkOverrideClockTime(time.hour, time.minute, time.second);
    }

    @Once()
    onStart(): void {
        SetMillisecondsPerGameMinute(2000);
    }
}
