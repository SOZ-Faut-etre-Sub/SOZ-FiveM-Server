import { Inject, Injectable } from '../../core/decorators/injectable';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { ScreenService } from '../screen.service';

type FindedPlayer = {
    playerId: number;
    distance: number;
    entity: number;
    position: Vector3;
};

@Injectable()
export class PlayerFinderService {
    @Inject(ScreenService)
    private screenService: ScreenService;

    public getClosestPlayer(): FindedPlayer | null {
        const currentPos = GetEntityCoords(PlayerPedId()) as Vector3;
        const currentPed = PlayerPedId();
        let foundedClosetPlayer: FindedPlayer | null = null;

        for (const localPlayerId of GetActivePlayers()) {
            const playerId = GetPlayerServerId(localPlayerId);
            const playerPed = GetPlayerPed(localPlayerId);

            if (playerPed === currentPed) {
                continue;
            }

            const playerPosition = GetEntityCoords(playerPed) as Vector3;
            const playerDistance = getDistance(currentPos, playerPosition);

            if (!foundedClosetPlayer || playerDistance < foundedClosetPlayer.distance) {
                foundedClosetPlayer = {
                    playerId,
                    distance: playerDistance,
                    entity: playerPed,
                    position: playerPosition,
                };
            }
        }

        return foundedClosetPlayer;
    }

    public async getPlayerFromMode(mode: 'closest' | 'screen' | 'screen_fallback_closest'): Promise<FindedPlayer> {
        if (mode === 'closest') {
            return this.getClosestPlayer();
        }

        const [entity, position] = await this.screenService.getEntityOnMousePosition();

        if (entity === null || !IsPedAPlayer(entity)) {
            if (mode === 'screen_fallback_closest') {
                return this.getClosestPlayer();
            }

            return null;
        }

        const entityPlayerId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
        const currentPos = GetEntityCoords(PlayerPedId()) as Vector3;

        return {
            playerId: entityPlayerId,
            distance: getDistance(position, currentPos),
            entity,
            position,
        };
    }
}
