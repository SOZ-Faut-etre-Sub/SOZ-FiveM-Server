import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { PrismaService } from '@public/server/database/prisma.service';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class PoliceVehicleProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Rpc(RpcServerEvent.POLICE_GET_VEHICLE_OWNER)
    public async getVehicleOwner(source: number, plate: string): Promise<string> {
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
            },
        });
        if (!data) {
            return 'inconnu';
        }
        const charInfo = JSON.parse(data.player.charinfo);
        if (data.job) {
            return data.job;
        } else {
            return charInfo.firstname + ' ' + charInfo.lastname;
        }
    }
}
