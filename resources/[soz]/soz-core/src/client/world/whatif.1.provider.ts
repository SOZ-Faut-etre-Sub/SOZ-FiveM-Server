import { Tick, TickInterval } from '@public/core/decorators/tick';
import { ServerEvent } from '@public/shared/event/server';
import { Feature } from '@public/shared/features';
import { Vector3 } from '@public/shared/polyzone/vector';
import { WhatIfRadiationZone } from '@public/shared/whatif';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { FeatureProvider } from '../feature/feature.provider';
import { Notifier } from '../notifier';
import { AudioService } from '../nui/audio.service';
import { PlayerService } from '../player/player.service';
import { NoClipProvider } from '../utils/noclip.provider';

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

    @Inject(NoClipProvider)
    private noClipProvider: NoClipProvider;

    private isNotSafe = false;
    private audio: string = null;

    @Tick(5000)
    public whatIfZoneCheck() {
        if (
            !this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode) &&
            !this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)
        ) {
            return;
        }

        const coords = GetEntityCoords(PlayerPedId()) as Vector3;
        const inZone = WhatIfRadiationZone.some(zone => zone.isPointInside(coords));
        const player = this.playerService.getPlayer();
        let isNotSafe = inZone;

        if (
            !player ||
            player.metadata.godmode ||
            this.noClipProvider.IsNoClipMode() ||
            player.metadata.isdead ||
            (player.metadata.hazmat && player.metadata.hazmat_protection > 0)
        ) {
            isNotSafe = false;
        }

        if (isNotSafe && !player?.metadata?.isdead) {
            this.notifier.notify(
                '☠️ Cette zone est ~r~irradiée~s~, tu vas mourir définitivement si tu y restes. ~b~Éloigne-toi aussi vite que tu le peux !~s~',
                'warning'
            );
        }
        if (
            inZone &&
            player &&
            player.metadata.hazmat &&
            player.metadata.hazmat_protection > 0 &&
            !player.metadata.godmode &&
            !this.noClipProvider.IsNoClipMode()
        ) {
            TriggerServerEvent(
                ServerEvent.QBCORE_SET_METADATA,
                'hazmat_protection',
                Math.max(0, player.metadata.hazmat_protection - 0.135)
            );
        }

        if (isNotSafe && !this.isNotSafe) {
            this.audio = this.audioService.playAudio('audio/whatif/geiger.mp3', 0.05, true);
            AnimpostfxPlay('DMT_flight', 0, false);
        } else if (!isNotSafe && this.isNotSafe) {
            this.audioService.stopAudio(this.audio);
            AnimpostfxStopAndDoUnk('DMT_flight');
        }

        this.isNotSafe = isNotSafe;
    }

    @Tick(TickInterval.EVERY_SECOND)
    public whatIfZoneDamage() {
        if (
            !this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode) &&
            !this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)
        ) {
            return;
        }

        if (!this.isNotSafe) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (
            !player ||
            player.metadata.godmode ||
            this.noClipProvider.IsNoClipMode() ||
            player.metadata.isdead ||
            (player.metadata.hazmat && player.metadata.hazmat_protection > 0)
        ) {
            return;
        }

        const playerPed = PlayerPedId();
        SetEntityHealth(playerPed, GetEntityHealth(playerPed) - 5);
    }
}
