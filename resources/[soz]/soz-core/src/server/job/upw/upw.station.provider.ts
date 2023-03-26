import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { PrismaService } from '@public/server/database/prisma.service';
import { PropsService } from '@public/server/props.service';

@Provider()
export class UpwStationProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PropsService)
    private propsService: PropsService;

    @Once(OnceStep.DatabaseConnected)
    public async onServerStart() {
        const chargers = await this.prismaService.upw_chargers.findMany();
        for (const charger of chargers) {
            if (charger.active) {
                try {
                    const position = JSON.parse(charger.position) as { x: number; y: number; z: number; w: number };
                    this.propsService.createObject(
                        GetHashKey('upwcarcharger'),
                        [position.x, position.y, position.z, position.w],
                        0,
                        true
                    );
                } catch (e) {
                    console.error('cannot create object of station: ', charger.station, e);
                    continue;
                }
            }
        }
    }
}
