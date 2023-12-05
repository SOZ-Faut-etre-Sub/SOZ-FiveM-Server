import { On, Once, OnEvent } from '@core/decorators/event';
import { Provider } from '@core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { ClientEvent } from '@public/shared/event';
import { RpcServerEvent } from '@public/shared/rpc';

const Animals = [
    3462393972, // A_C_Boar
    2334752500, // A_C_Boar_02
    1462895032, // A_C_Cat_01
    2864127842, // A_C_Chickenhawk
    2825402133, // A_C_Chimp
    2114741418, // A_C_Chimp_02
    351016938, // A_C_Chop
    1039404993, // A_C_Chop_02
    1457690978, // A_C_cormorant
    4244282910, // A_C_Cow
    1682622302, // A_C_Coyote
    734582471, // A_C_Coyote_02
    402729631, // A_C_Crow
    3630914197, // A_C_Deer
    2857068496, // A_C_Deer_02
    2344268885, // A_C_Dolphin
    802685111, // A_C_Fish
    1794449327, // A_C_Hen
    1193010354, // A_C_HumpBack
    1318032802, // A_C_Husky
    2374682809, // A_C_KillerWhale
    307287994, // A_C_MtLion
    2368442193, // A_C_MtLion_02
    3877461608, // A_C_Panther
    2971380566, // A_C_Pig
    111281960, // A_C_Pigeon
    1125994524, // A_C_Poodle
    1832265812, // A_C_Pug
    1072872081, // A_C_Pug_02
    3753204865, // A_C_Rabbit_01
    1553815115, // A_C_Rabbit_02
    3283429734, // A_C_Rat
    882848737, // A_C_Retriever
    3268439891, // A_C_Rhesus
    2506301981, // A_C_Rottweiler
    3549666813, // A_C_Seagull
    1015224100, // A_C_SharkHammer
    113504370, // A_C_SharkTiger
    1126154828, // A_C_shepherd
    2705875277, // A_C_Stingray
    2910340283, // A_C_Westy
];

@Provider()
export class FoodHuntProvider {
    private zonesDespawnTime: Record<string, number> = {};

    @Once()
    public async onStart() {
        this.zonesDespawnTime = await emitRpc<Record<string, number>>(RpcServerEvent.FOOD_HUNT_INIT);
    }

    @OnEvent(ClientEvent.FOOD_HUNT_SYNC)
    public onFoodHuntSync(zoneId: string, value: number) {
        this.zonesDespawnTime[zoneId] = value;
    }

    @On('populationPedCreating')
    public async onCreate(x: number, y: number, z: number, model: number) {
        if (!Animals.includes(model)) {
            return;
        }

        const zoneId = GetNameOfZone(x, y, z);
        const despawnTime = this.zonesDespawnTime[zoneId];
        if (despawnTime && despawnTime > Date.now()) {
            CancelEvent();
        }
    }
}
