import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { PrismaService } from '@public/server/database/prisma.service';
import { Notifier } from '@public/server/notifier';
import { VehicleStateService } from '@public/server/vehicle/vehicle.state.service';
import { ServerEvent } from '@public/shared/event/server';
import { JobType } from '@public/shared/job';
import { JobRegistry } from '@public/shared/job/config';

@Provider()
export class PoliceVehicleProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.POLICE_GET_VEHICLE_OWNER)
    public async getVehicleOwner(source: number, plate: string, netId: number) {
        const data = await this.prismaService.playerVehicle.findFirst({
            where: {
                plate: plate,
            },
            select: {
                player: {
                    select: {
                        charinfo: true,
                    },
                },
                job: true,
                crimiImport: true,
                boughttime: true,
                plateUpdateTime: true,
            },
        });

        let msg = `Propriétaire: ~b~inconnu`;
        if (data) {
            if (data.job) {
                msg = `Propriétaire: ~b~${JobRegistry[data.job as JobType].label}`;
            } else {
                const charInfo = JSON.parse(data.player.charinfo);
                msg = `Propriétaire: ~b~${charInfo.firstname + ' ' + charInfo.lastname}~s~`;

                if (data.crimiImport) {
                    const plateUpdate = data.plateUpdateTime || data.boughttime;
                    const deltaInDays = Math.floor((Date.now() / 1000 - plateUpdate) / (24 * 3_600_000));
                    if (Math.random() < deltaInDays * 0.1) {
                        msg += '~n~Voiture importée de ~r~contrebande~s~';
                    }
                }
            }
        } else {
            const state = this.vehicleStateService.getVehicleState(netId);
            if (state && state.volatile.exportBiz) {
                msg = 'Voiture importée de contrebande';
            }
        }

        this.notifier.advancedNotify(source, 'San Andreas', 'Vérification de plaque', msg, 'CHAR_DAVE', 'info');
    }
}
