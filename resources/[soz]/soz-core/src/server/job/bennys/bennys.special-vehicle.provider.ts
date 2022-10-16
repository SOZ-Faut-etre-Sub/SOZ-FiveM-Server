import { BankService } from '../../../client/bank/bank.service';
import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { wait } from '../../../core/utils';
import { Auction } from '../../../shared/dealership/auction';
import { BennysConfig } from '../../../shared/job/bennys';
import { PrismaService } from '../../database/prisma.service';

@Provider()
export class BennysSpecialVehicleProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(BankService)
    private bankProvider: BankService;

    @Once(OnceStep.Start)
    public async onStart() {
        // let auctions: Auction[] = [];
        // do {
        //     await wait(10);
        //     auctions = Object.values(exports['soz-vehicle'].GetAuctions());
        // } while (auctions.length === 0);
        // for (const vehicle of auctions) {
        //     const index = auctions.indexOf(vehicle);
        //
        //     await this.prismaService.PlayerVehicle.upsert({
        //         create: {
        //             plate: 'LUXE ' + (index + 1),
        //             hash: vehicle.hash.toString(),
        //             vehicle: vehicle.model,
        //             garage: 'bennys_luxury',
        //             job: 'bennys',
        //             state: 3,
        //             category: vehicle.required_licence,
        //             fuel: 100,
        //             engine: 1000,
        //             body: 1000,
        //             mods: JSON.stringify(BennysConfig.Mods.upgradedSimplifiedMods),
        //             condition: '{}',
        //         },
        //         update: {
        //             vehicle: vehicle.model,
        //             hash: vehicle.hash.toString(),
        //             garage: 'bennys_luxury',
        //             state: 3,
        //         },
        //         where: {
        //             plate: 'LUXE ' + (index + 1),
        //         },
        //     });
        // }
        //
        // await this.prismaService.PlayerVehicle.deleteMany({
        //     where: {
        //         plate: {
        //             startsWith: 'ESSAI',
        //         },
        //     },
        // });
    }
}
