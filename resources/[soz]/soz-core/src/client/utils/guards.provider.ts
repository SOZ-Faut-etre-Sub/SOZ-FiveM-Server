import { campGuards } from '../../config/guards';
import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { PedFactory } from '../factory/ped.factory';

@Provider()
export class GuardsProvider {
    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Once()
    async onInit() {
        AddRelationshipGroup('GUARD');
        SetRelationshipBetweenGroups(0, 'GUARD', 'GUARD');

        for (const guard of campGuards) {
            await this.pedFactory.createPedOnGrid(guard);
        }
    }
}
