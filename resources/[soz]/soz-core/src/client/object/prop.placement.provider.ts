import { OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { NuiEvent, ServerEvent } from '@public/shared/event';

import { OnEvent } from '../../core/decorators/event';
import { ClientEvent } from '../../shared/event/client';
import { MenuType } from '../../shared/nui/menu';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';

@Provider()
export class PropPlacementProvider {
    @Inject(NuiMenu)
    private menu: NuiMenu;

    @Inject(InputService)
    private inputService: InputService;

    @OnEvent(ClientEvent.PROP_OPEN_MENU)
    public async openPlacementMenu() {
        this.menu.openMenu(MenuType.PropPlacementMenu);
    }

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
