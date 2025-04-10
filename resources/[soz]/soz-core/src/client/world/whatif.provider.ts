import { Tick } from '@public/core/decorators/tick';
import { Feature } from '@public/shared/features';
import { Vector3 } from '@public/shared/polyzone/vector';
import { WhatIfExcludeZone } from '@public/shared/whatif';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { FeatureProvider } from '../feature/feature.provider';
import { Notifier } from '../notifier';
import { AudioService } from '../nui/audio.service';

@Provider()
export class WhatIfProvider {
    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(AudioService)
    private audioService: AudioService;

    private inZone = false;
    private audio: string = null;

    @Tick(5000)
    public whatIfZoneCheck() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode)) {
            return;
        }

        const coords = GetEntityCoords(PlayerPedId()) as Vector3;
        const inZone = WhatIfExcludeZone.isPointInside(coords);
        if (inZone) {
            this.notifier.notify(' Cette zone est iradiée, tu devrais partir !', 'warning');
        }

        if (inZone && !this.inZone) {
            this.audio = this.audioService.playAudio('audio/whatif/geiger.mp3', 0.1, true);
            AnimpostfxPlay('DMT_flight', 0, false);
        } else if (!inZone && this.inZone) {
            this.audioService.stopAudio(this.audio);
            AnimpostfxStopAndDoUnk('DMT_flight');
        }

        this.inZone = inZone;
    }
}
