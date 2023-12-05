import { Injectable } from '../core/decorators/injectable';
import { RGBAColor } from '../shared/color';
import { Font } from '../shared/hud';
import { Vector2, Vector3 } from '../shared/polyzone/vector';

type Style = {
    font: Font;
    size: number;
    color: RGBAColor;
    shadow: {
        distance: number;
        color: RGBAColor;
    };
    border: {
        size: number;
        color: RGBAColor;
    } | null;
    centered: boolean;
    outline: boolean;
};

@Injectable()
export class DrawService {
    public drawText(text: string, position: Vector2, style: Partial<Style> = {}) {
        const computedStyle = {
            font: Font.ChaletLondon,
            size: 1.0,
            color: [255, 255, 255, 255],
            shadow: {
                distance: 0,
                color: [0, 0, 0, 255],
            },
            border: null,
            centered: false,
            outline: false,
            ...style,
        };

        SetTextFont(computedStyle.font);
        SetTextScale(0.0, computedStyle.size);
        SetTextProportional(true);
        SetTextColour(computedStyle.color[0], computedStyle.color[1], computedStyle.color[2], computedStyle.color[3]);
        SetTextDropshadow(
            computedStyle.shadow.distance,
            computedStyle.shadow.color[0],
            computedStyle.shadow.color[1],
            computedStyle.shadow.color[2],
            computedStyle.shadow.color[3]
        );

        if (computedStyle.border) {
            SetTextEdge(
                computedStyle.border.size,
                computedStyle.border.color[0],
                computedStyle.border.color[1],
                computedStyle.border.color[2],
                computedStyle.border.color[3]
            );
        }

        if (computedStyle.centered) {
            SetTextCentre(true);
        }

        if (computedStyle.outline) {
            SetTextOutline();
        }

        SetTextEntry('STRING');
        AddTextComponentString(text);
        DrawText(position[0], position[1]);
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
