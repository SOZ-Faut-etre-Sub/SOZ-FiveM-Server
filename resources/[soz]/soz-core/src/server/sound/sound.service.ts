import { Inject, Injectable } from '@core/decorators/injectable';
import { ServerStateService } from '@public/server/server.state.service';
import { getDistance, Vector3, Vector4 } from '@public/shared/polyzone/vector';

type GlobalSound = {
    name: string;
    location: Vector3;
    maxDistance: number;
    volume?: number;
};

@Injectable()
export class SoundService {
    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    private globalSound: GlobalSound;

    public playGlobal(sound: GlobalSound) {
        this.globalSound = sound;
        TriggerClientEvent(
            'InteractSound_CL:PlayWithinDistanceRatioLoop',
            -1,
            sound.location,
            sound.maxDistance,
            sound.name,
            sound.volume
        );
    }

    public stopGlobal() {
        this.globalSound = null;
        TriggerClientEvent('InteractSound_CL:Stoploop', -1);
    }

    public playGlobalForPlayer(source: number) {
        if (this.globalSound) {
            TriggerClientEvent(
                'InteractSound_CL:PlayWithinDistanceRatioLoop',
                source,
                this.globalSound.location,
                this.globalSound.maxDistance,
                this.globalSound.name,
                this.globalSound.volume
            );
        }
    }

    public play(source: number, name: string, volume: number) {
        TriggerClientEvent('InteractSound_CL:PlayOnOne', source, name, volume);
    }

    public playAround(source: number, name: string, distance: number, volume: number) {
        TriggerEvent('InteractSound_SV:PlayWithinDistance', distance, name, volume);
    }

    public playAtPosition(name: string, position: Vector3 | Vector4, distance: number, volume: number) {
        const players = this.serverStateService.getPlayers();

        for (const player of players) {
            const ped = GetPlayerPed(player.source);
            const playerPosition = GetEntityCoords(ped) as Vector3;

            if (getDistance(position, playerPosition) < distance) {
                TriggerClientEvent('InteractSound_CL:PlayOnOne', player.source, name, volume);
            }
        }
    }
}
