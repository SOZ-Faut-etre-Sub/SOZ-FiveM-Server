import { Once, OnceStep, OnNuiEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { NuiMenu } from '../../nui/nui.menu';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class LSMCPharmacyProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @OnNuiEvent(NuiEvent.LsmcPharmacyBuyItem)
    async buyItem({ item }: { item: string }) {
        TriggerServerEvent(ServerEvent.LSMC_BUY_ITEM, item);
    }

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
        const model = 's_m_m_doctor_01';
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
                        label: 'Liste des médicaments',
                        icon: 'c:/ems/painkiller.png',
                        action: () => {
                            this.nuiMenu.openMenu(MenuType.LsmcPharmacy);
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
