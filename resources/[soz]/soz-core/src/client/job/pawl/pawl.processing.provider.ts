import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { ClientEvent } from '../../../shared/event/client';
import { ServerEvent } from '../../../shared/event/server';
import { JobType } from '../../../shared/job';
import { RpcServerEvent } from '../../../shared/rpc';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class PawlProcessingProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    private processingEnabled: boolean = false;

    @Once(OnceStep.PlayerLoaded)
    public async setupPawlProcessing() {
        this.processingEnabled = await emitRpc<boolean>(RpcServerEvent.PAWL_IS_PROCESSING_ENABLED);

        this.targetFactory.createForBoxZone(
            'pawl:processing:tree_trunk',
            {
                center: [-552.46, 5347.36, 74.74],
                length: 0.3,
                width: 0.8,
                heading: 70,
                minZ: 73.74,
                maxZ: 76.34,
            },
            [
                {
                    label: 'Démarrer production',
                    icon: 'pawl/start-prod',
                    canInteract: () => {
                        return !this.processingEnabled;
                    },
                    action: () => {
                        TriggerServerEvent(ServerEvent.PAWL_PROCESSING_START);
                    },
                    job: JobType.Pawl,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Pawl,
                    category: 'society',
                },
                {
                    label: 'Arrêter production',
                    icon: 'pawl/stop-prod',
                    canInteract: () => {
                        return this.processingEnabled;
                    },
                    action: () => {
                        TriggerServerEvent(ServerEvent.PAWL_PROCESSING_STOP);
                    },
                    job: JobType.Pawl,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Pawl,
                    category: 'society',
                },
                {
                    label: 'État production',
                    icon: 'pawl/status-prod',
                    action: () => {
                        TriggerServerEvent(ServerEvent.PAWL_PROCESSING_STATUS);
                    },
                    job: JobType.Pawl,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Pawl,
                    category: 'society',
                },
            ]
        );
    }

    @OnEvent(ClientEvent.PAWL_SYNC_PROCESSING)
    public async onOpenSocietyMenu(enabled: boolean) {
        this.processingEnabled = enabled;
    }
}
