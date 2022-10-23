import { Once, OnceStep } from '../../core/decorators/event';
import { Injectable } from '../../core/decorators/injectable';

@Injectable()
export class EntityFactory {
    private entities: { [id: number]: any } = {};

    public async createEntity(model: string|number, x: number, y: number, z: number): Promise<number> {
        const hash = typeof model === 'string' ? GetHashKey(model) : model;

        const entity = CreateObjectNoOffset(hash, x, y, z, false, false, false);
        FreezeEntityPosition(entity, true);

        this.entities[entity] = true;
        return entity;
    }

    public async createEntityWithRotation(model: string|number, x: number, y: number, z: number, rx: number, ry: number, rz: number): Promise<number> {
        const entity = await this.createEntity(model, x, y, z);
        SetEntityRotation(entity, rx, ry, rz, 2, true);
        return entity;
    }

    @Once(OnceStep.Stop)
    public async onServerStop() {
        for (const entity in this.entities) {
            DeleteObject(Number(entity));
        }
        this.entities = {};
    }
}
