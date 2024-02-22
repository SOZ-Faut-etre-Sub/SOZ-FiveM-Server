import { Module } from '../../../core/decorators/module';
import { FightForStyleCraftProvider } from './ffs.craft.provider';
import { FightForStyleHarvestProvider } from './ffs.harvest.provider';
import { FightForStyleProvider } from './ffs.provider';
import { FightForStyleRestockProvider } from './ffs.restock.provider';
import { FightForStylShowRoomProvider } from './ffs.showroom.provider';

@Module({
    providers: [
        FightForStyleHarvestProvider,
        FightForStyleCraftProvider,
        FightForStyleRestockProvider,
        FightForStyleProvider,
        FightForStylShowRoomProvider,
    ],
})
export class FightForStyleModule {}
