import { Inject, Injectable } from '@core/decorators/injectable';
import { ServerEvent } from '@public/shared/event/server';
import { Vector3 } from '@public/shared/polyzone/vector';

import { ResourceLoader } from '../repository/resource.loader';

export type AttachedObject = {
    model: string;
    bone: number;
    position: Vector3;
    rotation: Vector3;
    rotationOrder?: number;
    entity?: number;
};

@Injectable()
export class AttachedObjectService {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private objects = new Map<number, AttachedObject>();

    public async attachObjectToPlayer(attached: AttachedObject): Promise<number> {
        const position = GetEntityCoords(PlayerPedId()) as Vector3;

        if (!(await this.resourceLoader.loadModel(attached.model))) {
            return;
        }

        const object = CreateObject(
            GetHashKey(attached.model),
            position[0],
            position[1],
            position[2] - 1.0,
            true,
            true,
            true
        );
        SetEntityAsMissionEntity(object, true, true);
        const netId = ObjToNet(object);
        SetNetworkIdCanMigrate(netId, false);
        SetEntityCollision(object, false, true);
        TriggerServerEvent(ServerEvent.OBJECT_ATTACHED_REGISTER, netId);

        AttachEntityToEntity(
            object,
            attached.entity ? attached.entity : PlayerPedId(),
            attached.entity ? attached.bone : GetPedBoneIndex(PlayerPedId(), attached.bone),
            attached.position[0],
            attached.position[1],
            attached.position[2],
            attached.rotation[0],
            attached.rotation[1],
            attached.rotation[2],
            true,
            true,
            false,
            true,
            attached.rotationOrder || 0,
            true
        );

        this.objects.set(object, attached);
        this.resourceLoader.unloadModel(attached.model);

        return object;
    }

    public detachObjectToPlayer(entity: number) {
        if (!this.objects.has(entity)) {
            return;
        }

        SetEntityAsMissionEntity(entity, true, true);
        DetachEntity(entity, false, false);
        TriggerServerEvent(ServerEvent.OBJECT_ATTACHED_UNREGISTER, ObjToNet(entity));
        DeleteEntity(entity);
        this.objects.delete(entity);
    }

    public detachAll() {
        for (const entity of this.objects.keys()) {
            this.detachObjectToPlayer(entity);
        }
    }
}
