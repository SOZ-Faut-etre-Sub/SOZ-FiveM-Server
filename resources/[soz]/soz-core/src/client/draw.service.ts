import { Injectable } from '../core/decorators/injectable';

@Injectable()
export class DrawService {
    public drawText3d(x: number, y: number, z: number, text: string) {
        const [onScreen, _x, _y] = World3dToScreen2d(x, y, z);

        if (onScreen) {
            SetTextScale(0.35, 0.35);
            SetTextFont(4);
            SetTextProportional(true);
            SetTextColour(255, 255, 255, 255);
            SetTextEntry('STRING');
            SetTextCentre(true);
            AddTextComponentString(text);
            DrawText(_x, _y);
        }
    }
}
