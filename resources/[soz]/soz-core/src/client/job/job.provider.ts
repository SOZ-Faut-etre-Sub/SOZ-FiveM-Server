import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { JobCloakrooms } from '../../shared/job';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { StorageManager } from '../storage/storage.manager';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class JobProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(StorageManager)
    private storageManager: StorageManager;

    @Inject(Notifier)
    private notifier: Notifier;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        this.createCloakrooms();
    }

    private createCloakrooms() {
        Object.values(JobCloakrooms)
            .flatMap(cloakrooms => cloakrooms)
            .forEach(zone => {
                this.targetFactory.createForBoxZone(zone.data.id, zone, [
                    {
                        label: 'Se changer',
                        icon: 'c:jobs/habiller.png',
                        blackoutGlobal: true,
                        blackoutJob: zone.data.job,
                        job: zone.data.job,
                        canInteract: () => {
                            return this.playerService.isOnDuty();
                        },
                        action: async () => {
                            const result = await this.storageManager.search(zone.data.storage, 'work_clothes');
                            if (!result) {
                                this.notifier.notify(`Il n'y a plus de tenues de travail dans le vestiaire.`);
                                return false;
                            }
                            TriggerEvent(zone.data.event);
                        },
                    },
                ]);
            });
    }
}
