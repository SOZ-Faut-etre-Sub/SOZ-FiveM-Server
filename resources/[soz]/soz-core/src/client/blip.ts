import { Once, OnceStep } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Qbcore } from '@public/client/qbcore';

import { Blip } from '../shared/blip';

type GameBlip = {
    blip: Blip;
    id: string;
    gameId: number;
};

@Provider()
export class BlipFactory {
    @Inject(Qbcore)
    private qbcore: Qbcore;

    private blips = new Map<string, GameBlip>();

    public create(id: string, blipCreated: Blip): number {
        const blip = {
            range: true,
            scale: 0.8,
            ...blipCreated,
        };

        if (blip.coords) {
            blip.position = [blip.coords.x, blip.coords.y, blip.coords.z];
        }

        const gameId = AddBlipForCoord(blip.position[0], blip.position[1], blip.position[2]);

        if (!gameId) {
            throw new Error(`Failed to create blip ${id}`);
        }

        this.updateGameBlip(id, gameId, blip);
        this.blips.set(id, { blip, id, gameId });

        return gameId;
    }

    public hide(id: string, value: boolean): void {
        const gameBlip = this.blips.get(id);

        if (!gameBlip) {
            return;
        }

        if (value) {
            SetBlipAlpha(gameBlip.gameId, 0);
            SetBlipHiddenOnLegend(gameBlip.gameId, true);
        } else {
            SetBlipAlpha(gameBlip.gameId, 255);
            SetBlipHiddenOnLegend(gameBlip.gameId, false);
        }
    }

    public qbHide(id: string, value: boolean): void {
        this.qbcore.HideBlip(id, value);
    }

    public remove(id: string): void {
        const gameBlip = this.blips.get(id);

        if (!gameBlip) {
            return;
        }

        RemoveBlip(gameBlip.gameId);
        this.blips.delete(id);
    }

    public exist(id: string): boolean {
        const existInMemory = this.blips.has(id);

        if (!existInMemory) {
            return false;
        }

        const existInGame = DoesBlipExist(this.blips.get(id).gameId);

        if (!existInGame) {
            this.blips.delete(id);
        }

        return existInGame;
    }

    public update(id: string, blip: Partial<Blip>): void {
        const gameBlip = this.blips.get(id);

        if (!gameBlip) {
            return;
        }

        this.updateGameBlip(id, gameBlip.gameId, blip);
        gameBlip.blip = { ...gameBlip.blip, ...blip };
    }

    private updateGameBlip(id: string, gameId: number, blip: Partial<Blip>) {
        if (blip.position !== undefined) {
            SetBlipCoords(gameId, blip.position[0], blip.position[1], blip.position[2]);
        }

        if (blip.sprite !== undefined) {
            SetBlipSprite(gameId, blip.sprite);
        }

        if (blip.range !== undefined) {
            SetBlipAsShortRange(gameId, blip.range);
        }

        if (blip.color !== undefined) {
            SetBlipColour(gameId, blip.color);
        }

        if (blip.alpha !== undefined) {
            SetBlipAlpha(gameId, blip.alpha);
        }

        if (blip.display !== undefined) {
            SetBlipDisplay(gameId, blip.display);
        }

        if (blip.playerId !== undefined) {
            SetBlipNameToPlayerName(gameId, blip.playerId);
        }

        if (blip.showCone !== undefined) {
            SetBlipShowCone(gameId, true);
        }

        if (blip.heading !== undefined) {
            SetBlipRotation(gameId, Math.ceil(blip.heading));
        }

        if (blip.showHeading !== undefined) {
            ShowHeadingIndicatorOnBlip(gameId, blip.showHeading);
        }

        if (blip.secondaryColor !== undefined) {
            SetBlipSecondaryColour(gameId, blip.secondaryColor[0], blip.secondaryColor[1], blip.secondaryColor[2]);
        }

        if (blip.friend !== undefined) {
            ShowFriendIndicatorOnBlip(gameId, blip.friend);
        }

        if (blip.friendly !== undefined) {
            SetBlipAsFriendly(gameId, blip.friendly);
        }

        if (blip.mission !== undefined) {
            SetBlipAsMissionCreatorBlip(gameId, blip.mission);
        }

        if (blip.route !== undefined) {
            SetBlipRoute(gameId, blip.route);
        }

        if (blip.routeColor !== undefined) {
            SetBlipRouteColour(gameId, blip.routeColor);
        }

        if (blip.scale !== undefined) {
            SetBlipScale(gameId, blip.scale);
        }

        if (blip.category !== undefined) {
            SetBlipCategory(gameId, blip.category);
        }

        if (blip.name !== undefined) {
            const blipTextEntryKey = `BLIP_SOZ_CORE_${id}`;

            AddTextEntry(blipTextEntryKey, blip.name);
            BeginTextCommandSetBlipName(blipTextEntryKey);
            EndTextCommandSetBlipName(gameId);
        }
    }

    @Once(OnceStep.Stop)
    public removeAll(): void {
        for (const [id, gameBlip] of this.blips) {
            RemoveBlip(gameBlip.gameId);
            this.blips.delete(id);
        }
    }
}
