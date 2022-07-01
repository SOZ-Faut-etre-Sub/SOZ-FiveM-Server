import { Once } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { StateBagHandler } from '../../core/decorators/state';
import { Time } from '../../shared/weather';

@Provider()
export class TimeProvider {
    @StateBagHandler('time', 'global')
    async onTimeChange(_name, _key, time: Time) {
        NetworkOverrideClockTime(time.hour, time.minute, time.second);
    }

    @Once()
    onStart(): void {
        NetworkOverrideClockTime(GlobalState.time.hour, GlobalState.time.minute, GlobalState.time.second);
        SetMillisecondsPerGameMinute(2000);
    }
}
