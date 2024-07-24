import { SocietySafeStorage } from '../../config/bank';
import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event/server';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class BankProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Once(OnceStep.PlayerLoaded)
    public async init() {
        Object.entries(SocietySafeStorage).forEach(([job, safe]) => {
            this.targetFactory.createForBoxZone(`bank:safe:${job}`, BoxZone.fromZone(safe.zone), [
                {
                    label: 'Imprimer',
                    color: 'news',
                    icon: 'c:news/imprimer.png',
                    action: () => {
                        TriggerServerEvent(ServerEvent.NEWS_NEWSPAPER_FARM);
                    },
                    canInteract: () => {
                        return true;
                    },
                },
            ]);
        });
    }
}
