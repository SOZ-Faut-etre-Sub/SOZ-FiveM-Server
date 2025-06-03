import { MenuType } from '@public/shared/nui/menu';

import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { TargetFactory } from '../target/target.factory';
import { ComputerTargetList } from '../../config/worldinterraction';
import { AnimationService } from '../animation/animation.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerTokenProvider } from '../player/player.token.provider';
import { wait } from '@public/core/utils';

@Provider()
export class computerProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerTokenProvider)
    private playerTokenProvider: PlayerTokenProvider;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Once(OnceStep.PlayerLoaded)
    public getComputer() {
        this.targetFactory.createForModel(
            ComputerTargetList,
            [
                {
                    label: "Aller sur le panel",
                    icon: 'fas fa-mouse-pointer',
                    action: async entity=>{
                        TaskTurnPedToFaceEntity(PlayerPedId(),entity,2000);
                        await wait(2000);
                        this.nuiDispatch.dispatch('panel', 'ShowPanel', `${GetConvar('soz_public_endpoint', 'https://soz.zerator.com')}/token-callback?token=${this.playerTokenProvider.getJwtToken()}`);
                        this.animationService.playAnimation({
                            base: {
                                name: 'loop',
                                dictionary: 'mp_fib_grab',
                                options: {
                                    repeat: true,
                                    onlyUpperBody: true,
                                },
                            },
                        });
                    },
        
                }
            ],
            1.2
        )
    }



    
}