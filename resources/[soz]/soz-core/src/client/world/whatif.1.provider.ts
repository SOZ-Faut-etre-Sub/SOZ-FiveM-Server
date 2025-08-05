import { Tick, TickInterval } from '@public/core/decorators/tick';
import { Feature } from '@public/shared/features';
import { Vector3 } from '@public/shared/polyzone/vector';
import { WhatIfExcludeZone } from '@public/shared/whatif';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { FeatureProvider } from '../feature/feature.provider';
import { Notifier } from '../notifier';
import { AudioService } from '../nui/audio.service';
import { PlayerService } from '../player/player.service';

@Provider()
export class WhatIf1Provider {
    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(AudioService)
    private audioService: AudioService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private inZone = false;
    private audio: string = null;

    @Tick(5000)
    public whatIfZoneCheck() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode)) {
            return;
        }

        const coords = GetEntityCoords(PlayerPedId()) as Vector3;
        const inZone = WhatIfExcludeZone.isPointInside(coords);
        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (inZone && !player.metadata.isdead) {
            this.notifier.notify(
                '☠️ Cette zone est ~r~irradiée~s~, tu vas mourir définitivement si tu y restes. ~b~Éloigne-toi aussi vite que tu le peux !~s~',
                'warning'
            );
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

    @Tick(TickInterval.EVERY_SECOND)
    public whatIfZoneDamage() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode)) {
            return;
        }

        if (!this.inZone) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (!player || player.metadata.godmode || player.metadata.isdead) {
            return;
        }

        const playerPed = PlayerPedId();
        SetEntityHealth(playerPed, GetEntityHealth(playerPed) - 5);
    }
}
