import { Feature } from '@public/shared/features';

import { On, Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { WhatIfSafeZone } from '../../shared/whatif';
import { FeatureProvider } from '../feature/feature.provider';
import { Notifier } from '../notifier';
import { PlayerInOutService } from '../player/player.inout.service';
import { WeaponService } from '../weapon/weapon.service';

@Provider()
export class WhatIf2Provider {
    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Inject(PlayerInOutService)
    private playerInOutService: PlayerInOutService;

    @Inject(WeaponService)
    private weapon: WeaponService;

    @Inject(Notifier)
    private notifier: Notifier;

    private inSafeZone = false;

    @Once(OnceStep.Start)
    async onStart() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const playerBlip = GetMainPlayerBlipId();
        const northBlip = GetNorthRadarBlip();

        SetBlipAlpha(playerBlip, 0);
        SetBlipAlpha(northBlip, 0);

        this.playerInOutService.add('SafeZone', WhatIfSafeZone, isInside => {
            this.weapon.setDisabled('hub', isInside);
            this.inSafeZone = isInside;

            this.safeZoneLoop();

            if (isInside) {
                this.notifier.notify(
                    'Ici, les murs tiennent encore. Un maigre rempart contre l’enfer extérieur.~n~' +
                        'Aucune créature, aucune arme, aucune trahison n’a sa place entre ces barrières.~n~' +
                        ' Reprenez votre souffle, échangez, préparez-vous… car au-delà de cette limite, c’est la survie, rien d’autre.',
                    'info',
                    20000
                );
            }
        });
    }

    private async safeZoneLoop() {
        while (this.inSafeZone) {
            await wait(0);
            //disable firing and aim
            DisablePlayerFiring(PlayerId(), true);
            DisableControlAction(0, 24, true);
            DisableControlAction(0, 25, true);
            DisableControlAction(0, 29, true);
            DisableControlAction(0, 44, true);
            DisableControlAction(1, 37, true);
            DisableControlAction(0, 47, true);
            DisableControlAction(0, 58, true);
            DisableControlAction(0, 140, true);
            DisableControlAction(0, 141, true);
            DisableControlAction(0, 142, true);
            DisableControlAction(0, 143, true);
            DisableControlAction(0, 263, true);
            DisableControlAction(0, 264, true);
            DisableControlAction(0, 257, true);
        }
    }

    @On('populationPedCreating')
    public async onPopulationPedCreating() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        CancelEvent();
    }
}
