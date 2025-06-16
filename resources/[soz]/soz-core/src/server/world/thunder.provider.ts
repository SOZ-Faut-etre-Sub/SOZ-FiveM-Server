import { Command } from '@public/core/decorators/command';
import { Inject } from '@public/core/decorators/injectable';
import { ClientEvent } from '@public/shared/event';
import { Vector3 } from '@public/shared/polyzone/vector';

import { Provider } from '../../core/decorators/provider';
import { Notifier } from '../notifier';
import { WeaponProvider } from '../weapon/weapon.provider';

@Provider()
export class ThunderProvider {
    @Inject(WeaponProvider)
    public weaponProvider: WeaponProvider;

    @Inject(Notifier)
    public notifier: Notifier;

    @Command('lightning', {
        role: ['admin'],
    })
    public thunder(source: number, target: number) {
        const ped = GetPlayerPed(target);
        if (!ped) {
            this.notifier.error(source, 'Joueur non trouvé - ' + target);
            return;
        }

        const coords = GetEntityCoords(ped) as Vector3;
        this.weaponProvider.addMutedExplosion(coords);
        TriggerLatentClientEvent(ClientEvent.THUNDER, -1, 1024, target, coords, false);
    }

    @Command('lightning2', {
        role: ['admin'],
    })
    public thunder2(source: number, target: number) {
        const ped = GetPlayerPed(target);
        if (!ped) {
            this.notifier.error(source, 'Joueur non trouvé - ' + target);
            return;
        }

        const coords = GetEntityCoords(ped) as Vector3;
        this.weaponProvider.addMutedExplosion(coords);
        TriggerLatentClientEvent(ClientEvent.THUNDER, -1, 1024, target, coords, true);
    }
}
