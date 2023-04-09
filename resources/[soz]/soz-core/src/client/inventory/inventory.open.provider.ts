import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { emitRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { computeBinId } from '@public/shared/job/garbage';
import { RpcServerEvent } from '@public/shared/rpc';

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
                        const id = computeBinId(entity);
                        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 800);
                        await wait(800);

                        PlaySoundFrontend(-1, 'Collect_Pickup', 'DLC_IE_PL_Player_Sounds', true);
                        const cancelled = await this.animationService.playScenario({
                            name: 'PROP_HUMAN_BUM_BIN',
                            duration: 4000,
                        });

                        if (!cancelled && (await emitRpc<boolean>(RpcServerEvent.BIN_IS_NOT_LOCKED, id))) {
                            this.openTargetInventory('bin', id);
                        }
                    },
                    canInteract: async (entity: number) => {
                        const id = computeBinId(entity);
                        return emitRpc<boolean>(RpcServerEvent.BIN_IS_NOT_LOCKED, id);
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
