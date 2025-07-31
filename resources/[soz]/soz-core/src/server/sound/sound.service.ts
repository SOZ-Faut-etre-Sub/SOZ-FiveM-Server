import { Inject, Injectable } from '@core/decorators/injectable';
import { ServerStateService } from '@public/server/server.state.service';
import { getDistance, Vector3, Vector4 } from '@public/shared/polyzone/vector';

type GlobalSound = {
    id: string;
    name: string;
    location: Vector3;
    maxDistance: number;
    volume?: number;
};

@Injectable()
export class SoundService {
    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    private globalSounds: Record<string, GlobalSound> = {};

    public getAllGlobalSounds() {
        return this.globalSounds;
    }

    public playGlobal(sound: GlobalSound) {
        this.globalSounds[sound.id] = sound;
        TriggerClientEvent(
            'InteractSound_CL:PlayWithinDistanceRatioLoop',
            -1,
            sound.id,
            sound.location,
            sound.maxDistance,
            sound.name,
            sound.volume
        );
    }

    public stopGlobal(id: string) {
        delete this.globalSounds[id];
        TriggerClientEvent('InteractSound_CL:Stoploop', -1, id);
    }

    public playGlobalForPlayer(source: number) {
        for (const sound of Object.values(this.globalSounds)) {
            TriggerClientEvent(
                'InteractSound_CL:PlayWithinDistanceRatioLoop',
                source,
                sound.id,
                sound.location,
                sound.maxDistance,
                sound.name,
                sound.volume
            );
        }
    }

    public playLoopForPlayer(source: number, sound: GlobalSound) {
        TriggerClientEvent('InteractSound_CL:PlayLoop', source, sound.id, sound.name, sound.volume);
    }

    public stopLoopForPlayer(source: number, id: string) {
        TriggerClientEvent('InteractSound_CL:Stoploop', source, id);
    }

    public play(source: number, name: string, volume: number) {
        TriggerClientEvent('InteractSound_CL:PlayOnOne', source, name, volume);
    }

    public stop(source: number, name: string) {
        TriggerClientEvent('InteractSound_CL:StopOnOne', source, name);
    }

    public playAround(source: number, name: string, distance: number, volume: number) {
        TriggerEvent('InteractSound_SV:PlayWithinDistance', distance, name, volume);
    }

    public playAtPosition(
        name: string,
        position: Vector3 | Vector4,
        distance: number,
        volume: number,
        scaling = false
    ) {
        const players = this.serverStateService.getPlayers();

        for (const player of players) {
            const ped = GetPlayerPed(player.source);
            const playerPosition = GetEntityCoords(ped) as Vector3;
            const playerDistance = getDistance(position, playerPosition);

            if (playerDistance < distance) {
                const playerVolume = scaling
                    ? Math.max((volume * (distance - playerDistance)) / distance, 0.2)
                    : volume;
                TriggerClientEvent('InteractSound_CL:PlayOnOne', player.source, name, playerVolume);
            }
        }
    }
}
