import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class LSMCPharmacyProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        const model = isFeatureEnabled(Feature.Halloween) ? 'u_f_y_corpse_02' : 's_m_m_doctor_01';
        this.targetFactory.createForPed({
            model: model,
            coords: { x: 356.64, y: -1419.74, z: 31.51, w: 57.62 },
            invincible: true,
            freeze: true,
            spawnNow: true,
            blockevents: true,
            animDict: 'anim@amb@casino@valet_scenario@pose_d@',
            anim: 'base_a_m_y_vinewood_01',
            flag: 49,
            target: {
                options: [
                    {
                        label: 'Acheter un mouchoir',
                        icon: 'c:/ems/tissue.png',
                        action: () => {
                            TriggerServerEvent(ServerEvent.LSMC_BUY_ITEM, 'tissue');
                        },
                    },
                    {
                        label: 'Acheter un antibiotique',
                        icon: 'c:/ems/antibiotic.png',
                        action: () => {
                            TriggerServerEvent(ServerEvent.LSMC_BUY_ITEM, 'antibiotic');
                        },
                    },
                    {
                        label: 'Acheter une pommade',
                        icon: 'c:/ems/ointment.png',
                        action: () => {
                            TriggerServerEvent(ServerEvent.LSMC_BUY_ITEM, 'pommade');
                        },
                    },
                    {
                        label: 'Acheter un antidouleur',
                        icon: 'c:/ems/painkiller.png',
                        action: () => {
                            TriggerServerEvent(ServerEvent.LSMC_BUY_ITEM, 'painkiller');
                        },
                    },
                    {
                        label: 'Soins médicaux',
                        icon: 'c:/ems/heal.png',
                        action: () => {
                            TriggerServerEvent(ServerEvent.LSMC_HEAL);
                        },
                    },
                ],
                distance: 2.5,
            },
        });
    }
}
