import { Once, OnEvent } from '@public/core/decorators/event';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { UpwConfig, UpwPollution } from '@public/shared/job/upw';

import { Provider } from '../../../core/decorators/provider';

@Provider()
export class UpwPollutionProvider {
    private pollutionLevel = UpwPollution.Neutral;
    private pollutionPercent = 0;

    @Once()
    public init() {
        TriggerServerEvent(ServerEvent.UPW_POLLUTION_INIT);
    }

    @OnEvent(ClientEvent.UPW_POLLUTION_UPDATE)
    public onPollutionChanged(value: UpwPollution, percent: number) {
        this.pollutionLevel = value;
        this.pollutionPercent = percent;
    }

    public getPollutionLevel() {
        return this.pollutionLevel;
    }

    public getPollutionPercent() {
        return this.pollutionPercent;
    }

    public calculateDuration(baseDuration: number) {
        return baseDuration * UpwConfig.Pollution.Multiplier[this.pollutionLevel];
    }
}
