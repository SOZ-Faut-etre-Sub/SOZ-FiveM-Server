import { Command } from '@public/core/decorators/command';
import { Inject } from '@public/core/decorators/injectable';
import { ClientEvent } from '@public/shared/event';

import { Provider } from '../../core/decorators/provider';
import { Notifier } from '../notifier';

@Provider()
export class ThunderProvider {
    @Inject(Notifier)
    public notifier: Notifier;

    @Command('thunder', {
        role: ['admin'],
    })
    public thunder(source: number, target: number) {
        const ped = GetPlayerPed(target);
        if (!ped) {
            this.notifier.error(source, 'Joueur non trouvé - ' + target);
            return;
        }

        TriggerLatentClientEvent(ClientEvent.THUNDER, -1, 1024, target, GetEntityCoords(ped));
    }
}
