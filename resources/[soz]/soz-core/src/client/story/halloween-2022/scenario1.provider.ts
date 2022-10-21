import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Halloween2022Scenario1 } from '../../../shared/story/halloween-2022/scenario1';
import { TargetFactory } from '../../target/target.factory';
import { StoryService } from '../story.service';

@Provider()
export class Halloween2022Scenario1Provider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(StoryService)
    private storyService: StoryService;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        /*this.targetFactory.createForPed({
            model: 'mp_m_freemode_01',
            components: {
                0: [29, 44, 0],
                1: [46, 0, 0],
                2: [9, 17, 4],
                3: [12, 0, 0],
                4: [26, 11, 0],
                5: [0, 0, 0],
                6: [21, 4, 0],
                7: [0, 0, 0],
                8: [33, 3, 0],
                9: [0, 0, 0],
                10: [0, 0, 0],
                11: [292, 6, 0],
            },
            coords: { x: -2313.69, y: 3443.04, z: 30.45, w: 282.23 },
            invincible: true,
            freeze: true,
            spawnNow: true,
            blockevents: true,
            animDict: 'anim@amb@casino@valet_scenario@pose_d@',
            anim: 'base_a_m_y_vinewood_01',
            flag: 49,
            target: {
                distance: 2.5,
                options: [
                    {
                        label: 'Parler',
                        canInteract: () => {
                            return true;
                        },
                        action: async data => {
                            const location = GetOffsetFromEntityInWorldCoords(data.entity, 1.0, 1.0, 0.0);

                            TaskGoStraightToCoord(
                                PlayerPedId(),
                                location[0],
                                location[1],
                                location[2],
                                1.0,
                                1000,
                                102.23,
                                0.0
                            );
                            wait(1000);

                            const voice = await emitRpc<string>(RpcEvent.STORY_HALLOWEEN_SCENARIO1);

                            TriggerServerEvent(ServerEvent.PLAYER_HEALTH_GYM_SUBSCRIBE);
                        },
                    },
                ],
            },
        });
*/
        await this.storyService.launchDialog(Halloween2022Scenario1.dialog['part-1']);
    }
}
