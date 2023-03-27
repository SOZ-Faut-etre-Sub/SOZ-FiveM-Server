import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { wait } from '@public/core/utils';
import { getLocationHash } from '@public/shared/locationhash';
import { Vector3 } from '@public/shared/polyzone/vector';

import { Provider } from '../../core/decorators/provider';
import { AnimationService } from '../animation/animation.service';
import { SoundService } from '../sound.service';
import { TargetFactory } from '../target/target.factory';

const bins = GetHashKey('soz_prop_bb_bin');

@Provider()
export class InventoryOpenProvider {
    @Inject(TargetFactory)
    public targetFactory: TargetFactory;

    @Inject(AnimationService)
    public animationService: AnimationService;

    @Inject(SoundService)
    public soundService: SoundService;

    @Once(OnceStep.Start)
    public init() {
        this.targetFactory.createForModel(
            bins,
            [
                {
                    label: 'Fouiller',
                    icon: 'c:inventory/ouvrir_la_poubelle.png',
                    action: async (entity: number) => {
                        const coords = GetEntityCoords(entity) as Vector3;
                        const coordsHash = getLocationHash(coords);
                        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 800);
                        await wait(800);

                        PlaySoundFrontend(-1, 'Collect_Pickup', 'DLC_IE_PL_Player_Sounds', true);
                        const cancelled = await this.animationService.playScenario({
                            name: 'PROP_HUMAN_BUM_BIN',
                            duration: 4000,
                        });

                        if (!cancelled) {
                            this.openTargetInventory('bin', 'bin_' + coordsHash);
                        }
                    },
                },
            ],
            1.3
        );
    }

    public openTargetInventory(type: string, id: string) {
        TriggerServerEvent('inventory:server:openInventory', type, id);
    }
}
