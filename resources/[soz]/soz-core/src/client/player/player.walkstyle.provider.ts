import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';

import { ClientEvent } from '../../shared/event';
import { PlayerData } from '../../shared/player';
import { ResourceLoader } from '../resources/resource.loader';
import { PlayerService } from './player.service';

export type WalkStyleConf = {
    override: string;
    injury: string;
    drugAlcool: string;
    stress: string;
    item: string;
};

@Provider()
export class PlayerWalkstyleProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private conf: WalkStyleConf = {
        override: null,
        injury: null,
        drugAlcool: null,
        stress: null,
        item: null,
    };

    private async applyWalkStyle(base: string, transitionSpeed = 1.0): Promise<void> {
        const ped = PlayerPedId();

        let walkStyle = base;

        if (this.conf.override) {
            walkStyle = this.conf.override;
        } else if (this.conf.injury) {
            walkStyle = this.conf.injury;
        } else if (this.conf.drugAlcool) {
            walkStyle = this.conf.drugAlcool;
        } else if (this.conf.stress) {
            walkStyle = this.conf.stress;
        } else if (this.conf.item) {
            walkStyle = this.conf.item;
        }

        if (GetPedMovementClipset(ped) == GetHashKey(walkStyle)) {
            return;
        }

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

    async updateWalkStyle(kind: keyof WalkStyleConf, walkStyle: string | null, transitionSpeed = 1.0): Promise<void> {
        this.conf[kind] = walkStyle;
        const player = this.playerService.getPlayer();
        await this.applyWalkStyle(player.metadata.walk, transitionSpeed);
    }

    async applyMood(mood: string | null): Promise<void> {
        if (mood === null || mood === '') {
            return;
        }

        SetFacialIdleAnimOverride(PlayerPedId(), mood, null);
    }

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded(player: PlayerData): Promise<void> {
        if (player.metadata.walk) {
            await this.applyWalkStyle(player.metadata.walk);
        }

        if (player.metadata.mood) {
            await this.applyMood(player.metadata.mood);
        }
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    async onPlayerUpdate(player: PlayerData): Promise<void> {
        if (player.metadata.walk) {
            await this.applyWalkStyle(player.metadata.walk);
        }

        if (player.metadata.mood) {
            await this.applyMood(player.metadata.mood);
        }
    }
}
