import { BlipFactory } from '@public/client/blip';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { UpwChargerRepository } from '@public/client/resources/upw.station.repository';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { ClientEvent, NuiEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { UpwFacility, UpwFacilityType } from '@public/shared/job/upw';
import { MenuType } from '@public/shared/nui/menu';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { RpcEvent } from '@public/shared/rpc';

@Provider()
export class UpwMenuProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(UpwChargerRepository)
    private upwChargerRepository: UpwChargerRepository;

    private displayedBlips = {
        inverter: false,
        jobTerminal: false,
        globalTerminal: false,
        plant: false,
        resell: false,
        charger: false,
    };

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepositoryLoad() {
        const chargers = this.upwChargerRepository.get();
        for (const charger of Object.values(chargers)) {
            this.blipFactory.create('job_upw_charger_' + charger.id, {
                coords: {
                    x: charger.position[0],
                    y: charger.position[1],
                    z: charger.position[2],
                },
                name: 'Emplacement de chargeur UPW',
                sprite: 620,
                color: 3,
            });
            this.blipFactory.hide('job_upw_charger_' + charger.id, true);
        }
    }

    @OnEvent(ClientEvent.JOB_OPEN_MENU)
    public async toggleJobMenu(job: JobType) {
        if (job != JobType.Upw) {
            return;
        }
        if (this.nuiMenu.getOpened() === MenuType.JobUpw) {
            this.nuiMenu.closeMenu();
        } else {
            this.nuiMenu.openMenu(MenuType.JobUpw, { blips: this.displayedBlips });
        }
    }

    @OnNuiEvent(NuiEvent.UpwDisplayBlips)
    public async onDisplayBlisp({ blip, value }) {
        this.displayedBlips[blip] = value;

        if (blip == 'charger') {
            const chargers = this.upwChargerRepository.get();
            for (const charger of Object.values(chargers)) {
                if (value && !charger.active) {
                    this.blipFactory.hide('job_upw_charger_' + charger.id, false);
                } else {
                    this.blipFactory.hide('job_upw_charger_' + charger.id, true);
                }
            }
            if (value) {
                const end = GetGameTimer() + 15000;
                while (GetGameTimer() < end) {
                    for (const charger of Object.values(chargers)) {
                        if (!charger.active) {
                            const pedPosition = GetEntityCoords(PlayerPedId()) as Vector3;
                            const distanceToCharger = getDistance(pedPosition, charger.position);
                            if (distanceToCharger < 100) {
                                DrawLightWithRange(
                                    charger.position[0],
                                    charger.position[1],
                                    charger.position[2] + 0.5,
                                    0,
                                    229,
                                    255,
                                    1.5,
                                    80.0
                                );
                            }
                        }
                    }
                    await wait(0);
                }
            }
            return;
        }

        const facilityType: UpwFacilityType = blip == 'jobTerminal' || blip == 'globalTerminal' ? 'terminal' : blip;
        if (facilityType == 'resell') {
            this.blipFactory.hide('job_upw_resell', !value);
            return;
        }
        const facilities = await emitRpc<UpwFacility[]>(RpcEvent.UPW_GET_FACILITIES, facilityType);
        for (const facility of facilities) {
            const data = JSON.parse(facility.data);
            const blip_id = 'job_upw_' + facility.identifier;
            if (
                (blip == 'jobTerminal' && data.scope != 'entreprise') ||
                (blip == 'globalTerminal' && data.scope == 'entreprise')
            ) {
                continue;
            }
            this.blipFactory.hide(blip_id, !value);
        }
    }
}
