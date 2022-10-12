import { Injectable } from '../core/decorators/injectable';
import {Vector3} from "../shared/polyzone/vector";

@Injectable()
export class DrawService {
    public drawText(
        x: number,
        y: number,
        width: number,
        height: number,
        scale: number,
        r: number,
        g: number,
        b: number,
        a: number,
        text: string
    ): void {
        SetTextFont(4);
        SetTextProportional(false);
        SetTextScale(scale, scale);
        SetTextColour(r, g, b, a);
        SetTextDropshadow(0, 0, 0, 0, 255);
        SetTextEdge(2, 0, 0, 0, 255);
        SetTextDropShadow();
        SetTextOutline();
        SetTextEntry('STRING');
        AddTextComponentString(text);
        DrawText(x - width / 2, y - height / 2 + 0.005);
    }

    public drawText3d(position: Vector3, text: string) {
        const [onScreen, _x, _y] = World3dToScreen2d(position[0], position[1], position[2]);

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
