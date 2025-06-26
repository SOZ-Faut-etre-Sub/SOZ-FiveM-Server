import { Provider } from '@public/core/decorators/provider';
import { getHeadingFromVector2d, Vector3 } from '@public/shared/polyzone/vector';

@Provider()
export class PositionService {
    public playerCoords(): Vector3 {
        return GetEntityCoords(PlayerPedId()) as Vector3;
    }

    public angleToCoords(coords: Vector3, offset: number = 0): number {
        const playerCoords = this.playerCoords();
        const heading = getHeadingFromVector2d(playerCoords[0] - coords[0], playerCoords[1] - coords[1]);
        return (heading - offset - 180) % 360;
    }
}
