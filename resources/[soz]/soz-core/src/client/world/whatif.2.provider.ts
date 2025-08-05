import { Feature } from '@public/shared/features';

import { On, Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { joaat } from '../../shared/joaat';
import { Vector3 } from '../../shared/polyzone/vector';
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

    private zombieRelationHash = joaat('ZombieAgressive');

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

        AddRelationshipGroup('ZombieAgressive');
        SetRelationshipBetweenGroups(0, this.zombieRelationHash, this.zombieRelationHash);
        SetRelationshipBetweenGroups(5, this.zombieRelationHash, GetHashKey('PLAYER'));
        SetRelationshipBetweenGroups(3, GetHashKey('PLAYER'), this.zombieRelationHash);
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

    @Tick(TickInterval.EVERY_SECOND)
    async onPedConfigurationCheck() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        for (const pedHandle of GetGamePool('CPed')) {
            if (IsPedAPlayer(pedHandle) || !NetworkHasControlOfEntity(pedHandle)) {
                continue;
            }

            SetPedCombatAttributes(pedHandle, 0, false);
            SetPedCombatAttributes(pedHandle, 4, true);
            SetPedCombatAttributes(pedHandle, 5, true);
            SetPedCombatAttributes(pedHandle, 13, true);
            SetPedCombatAttributes(pedHandle, 21, true);
            SetPedCombatAttributes(pedHandle, 38, true);
            SetPedCombatAttributes(pedHandle, 42, true);
            SetPedCombatAttributes(pedHandle, 46, true);
            SetPedCombatAttributes(pedHandle, 50, true);

            SetPedCombatMovement(pedHandle, 3);
            SetPedFleeAttributes(pedHandle, 0, false);
            SetPedCombatRange(pedHandle, 3);
            SetPedCombatAbility(pedHandle, 2);
            SetPedSeeingRange(pedHandle, 200);
            SetPedHearingRange(pedHandle, 100);

            SetPedRelationshipGroupHash(pedHandle, this.zombieRelationHash);
        }
    }
}
