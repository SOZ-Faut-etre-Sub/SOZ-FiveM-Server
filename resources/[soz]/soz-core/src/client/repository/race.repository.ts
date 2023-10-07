import { Injectable } from '@core/decorators/injectable';
import { emitRpc } from '@core/rpc';
import { Race } from '@public/shared/race';

import { RpcServerEvent } from '../../shared/rpc';

@Injectable()
export class RaceRepository {
    private objects: Record<number, Race> = {};

    public async load() {
        this.objects = await emitRpc<Record<number, Race>>(RpcServerEvent.REPOSITORY_GET_DATA, 'race');
    }

    public update(objects: Record<number, Race>) {
        this.objects = objects;
    }

    public get(): Record<number, Race> {
        return this.objects;
    }

    public find(id: number): Race | null {
        if (!this.objects) {
            return null;
        }
        return this.objects[id];
    }

    public updateRace(race: Race) {
        if (!this.objects) {
            return null;
        }

        const prev = this.objects[race.id];
        if (prev) {
            race.npc = prev.npc;
            race.display = prev.display;
        }
        this.objects[race.id] = race;

        return race;
    }

    public deleteRace(raceId: number) {
        if (!this.objects) {
            return;
        }

        delete this.objects[raceId];
    }
}
