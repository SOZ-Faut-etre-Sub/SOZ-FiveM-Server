import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { PlayerData } from '../../shared/player';
import { ResourceLoader } from '../resources/resource.loader';
import { PlayerService } from './player.service';

/**
 * Added here as missing in @citizenfx/client/natives_universal.d.ts
 * Returns The current movement clipset hash.
 */
declare function GetPedMovementClipset(ped: number): number;

@Provider()
export class PlayerWalkstyleProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private overrideWalkStyle = false;

    @OnEvent(ClientEvent.PLAYER_UPDATE_WALK_STYLE)
    async applyWalkStyle(walkStyle: string | null, overrideWalkStyle = false, transitionSpeed = 1.0): Promise<void> {
        const ped = PlayerPedId();
        if (GetPedMovementClipset(ped) == GetHashKey(walkStyle)) {
            return;
        }

        if (this.overrideWalkStyle && !overrideWalkStyle) {
            return;
        }

        this.overrideWalkStyle = overrideWalkStyle;

        ResetPedMovementClipset(ped, transitionSpeed);

        if (walkStyle === null || walkStyle === '') {
            return;
        }

        await this.resourceLoader.loadAnimationSet(walkStyle);
        SetPedMovementClipset(ped, walkStyle, transitionSpeed);

        if (walkStyle == 'move_ped_crouched') {
            SetPedWeaponMovementClipset(ped, 'move_ped_crouched');
            SetPedStrafeClipset(ped, 'move_ped_crouched_strafing');
        } else {
            ResetPedWeaponMovementClipset(ped);
            ResetPedStrafeClipset(ped);
        }
    }

    @OnEvent(ClientEvent.PLAYER_REFRESH_WALK_STYLE)
    async refresh(): Promise<void> {
        if (!this.playerService.isLoggedIn()) {
            return;
        }
        if (!this.playerService.getPlayer()) {
            return;
        }

        this.overrideWalkStyle = false;
        await this.applyWalkStyle(this.playerService.getPlayer().metadata.walk);
    }

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded(player: PlayerData): Promise<void> {
        if (player.metadata.walk) {
            await this.applyWalkStyle(player.metadata.walk);
        }
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    async onPlayerUpdate(player: PlayerData): Promise<void> {
        await this.applyWalkStyle(player.metadata.walk);
    }
}
