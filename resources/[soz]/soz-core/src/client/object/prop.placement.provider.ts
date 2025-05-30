import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { NuiEvent, ServerEvent } from '@public/shared/event';

import { InputService } from '../nui/input.service';

@Provider()
export class PropPlacementProvider {
    @Inject(InputService)
    private inputService: InputService;

    @OnNuiEvent(NuiEvent.RequestCreatePropCollection)
    public async onRequestCreatePropCollection() {
        const name = await this.inputService.askInput({
            title: 'Nom de la collection',
            maxCharacters: 50,
        });
        if (!name) {
            return;
        }

        TriggerServerEvent(ServerEvent.SCENE_CREATE, name);
    }
}
