import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ServerEvent } from '@public/shared/event/server';
import { Feature, isFeatureEnabled } from '@public/shared/features';

import { ObjectProvider } from '../object/object.provider';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class EasterHuntProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.Easter)) {
            return;
        }

        this.targetFactory.createForModel(
            ['egg_basket'],
            [
                {
                    label: 'Fouiller',
                    icon: 'global/search',
                    category: 'citizen',
                    action: async entity => TriggerServerEvent(ServerEvent.EASTER_HUNT, GetEntityCoords(entity)),
                    canInteract: entity => !this.objectProvider.getIdFromEntity(entity),
                },
            ]
        );
    }
}
