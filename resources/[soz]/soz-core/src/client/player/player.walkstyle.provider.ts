import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { PlayerData } from '../../shared/player';
import { ResourceLoader } from '../resources/resource.loader';
import { PlayerService } from './player.service';

@Provider()
export class PlayerWalkstyleProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private currentWalkStyle: string | null = null;

    @OnEvent(ClientEvent.PLAYER_UPDATE_WALK_STYLE)
    async applyWalkStyle(walkStyle: string | null): Promise<void> {
        if (this.currentWalkStyle === walkStyle) {
            return;
        }

        ResetPedMovementClipset(PlayerPedId(), 1.0);
        this.currentWalkStyle = walkStyle;

        if (walkStyle === null || walkStyle === '') {
            return;
        }

        await this.resourceLoader.loadAnimationSet(walkStyle);
        SetPedMovementClipset(PlayerPedId(), walkStyle, 1.0);
    }

    @OnEvent(ClientEvent.PLAYER_REFRESH_WALK_STYLE)
    async refresh(): Promise<void> {
        if (!this.playerService.isLoggedIn()) {
            return;
        }
        if (!this.playerService.getPlayer()) {
            return;
        }

        await this.applyWalkStyle(this.playerService.getPlayer().metadata.walk);
    }

    @Once(OnceStep.PlayerLoaded)
    async onPlayerLoaded(player: PlayerData): Promise<void> {
        if (player.metadata.walk) {
            await this.applyWalkStyle(player.metadata.walk);
        }
    }

    @OnEvent(ClientEvent.PLAYER_UPDATE)
    async onPlayerUpdate(): Promise<void> {
        await this.refresh();
    }
}
