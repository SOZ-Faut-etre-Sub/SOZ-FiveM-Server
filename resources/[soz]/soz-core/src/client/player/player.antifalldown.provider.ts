import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { Vector3 } from '../../shared/polyzone/vector';

@Provider()
export class PlayerAntiFallDownProvider {
    @Tick(5000)
    private async checkAntiFallDown(): Promise<void> {
        const position = GetEntityCoords(PlayerPedId(), true) as Vector3;
        // Force height to 5000 to get the correct ground Z
        const [, groundZ] = GetGroundZFor_3dCoord(position[0], position[1], 5000, false);

        if (position[2] > 1000) {
            return;
        }

        if (position[2] - groundZ < -10) {
            SetPedCoordsKeepVehicle(PlayerPedId(), position[0], position[1], groundZ + 1);
        }
    }
}
