import { Injectable } from '../core/decorators/injectable';
import { Draw2dTextParameters, Draw3dTextParameters } from '../shared/draw';

@Injectable()
export class DrawService {
    public drawText(drawRequest: Draw2dTextParameters): void {
        SetTextFont(4);
        SetTextProportional(false);
        SetTextScale(drawRequest.scale, drawRequest.scale);
        SetTextColour(drawRequest.r, drawRequest.g, drawRequest.b, drawRequest.a);
        SetTextDropshadow(0, 0, 0, 0, 255);
        SetTextEdge(2, 0, 0, 0, 255);
        SetTextDropShadow();
        SetTextOutline();
        SetTextEntry('STRING');
        AddTextComponentString(drawRequest.text);
        DrawText(drawRequest.x - drawRequest.width / 2, drawRequest.y - drawRequest.height / 2 + 0.005);
    }

    public draw3dCenteredText(drawRequest: Draw3dTextParameters): void {
        SetTextScale(0.35, 0.35);
        SetTextFont(4);
        SetTextProportional(true);
        SetTextColour(255, 255, 255, 215);
        SetTextEntry('STRING');
        SetTextCentre(true);
        AddTextComponentString(drawRequest.text);
        SetDrawOrigin(drawRequest.x, drawRequest.y, drawRequest.z, 0);
        DrawText(0.0, 0.0);
        const factor = drawRequest.text.length / 370;
        DrawRect(0.0, 0.0125, 0.017 + factor, 0.03, 0, 0, 0, 75);
        ClearDrawOrigin();
    }

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
