import { On, OnEvent } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';
import { ServerEvent } from '@public/shared/event';

@Provider()
export class ObjectAttachedProvider {
    private objects = new Map<number, Set<number>>();

    @OnEvent(ServerEvent.OBJECT_ATTACHED_REGISTER)
    public async onObjectAttachedRegister(source: number, netId: number) {
        let playerObjects = this.objects.get(source);
        if (!playerObjects) {
            playerObjects = new Set();
            this.objects.set(source, playerObjects);
        }

        playerObjects.add(netId);
    }

    @OnEvent(ServerEvent.OBJECT_ATTACHED_UNREGISTER)
    public async onObjectAttachedUnregister(source: number, netId: number) {
        const playerObjects = this.objects.get(source);
        if (!playerObjects) {
            return;
        }

        playerObjects.delete(netId);
    }

    @On('playerDropped')
    public onDropped(source: number) {
        const playerObjects = this.objects.get(source);
        if (!playerObjects) {
            return;
        }

        for (const obj of playerObjects) {
            const entityId = NetworkGetEntityFromNetworkId(obj);
            if (entityId) {
                DeleteEntity(entityId);
            }
        }
        this.objects.delete(source);
    }
}
