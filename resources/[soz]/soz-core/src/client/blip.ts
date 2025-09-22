import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick } from '@core/decorators/tick';
import { uuidv4 } from '@core/utils';
import { FeatureProvider } from '@public/client/feature/feature.provider';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { Qbcore } from '@public/client/qbcore';
import { ClientEvent } from '@public/shared/event/client';
import { NuiEvent } from '@public/shared/event/nui';
import { Feature } from '@public/shared/features';
import { Vector3 } from '@public/shared/polyzone/vector';
import { WhatIfRadiationZone } from '@public/shared/whatif';

import { Blip, BlipType } from '../shared/blip';

type GameBlip = {
    blip: Blip;
    id: string;
    gameId: number;
    actions?: BlipAction<any>[];
};

export type BlipAction<T = undefined> = {
    id: string;
    label: string;
    action: (blip: Blip, data: T) => void | Promise<void>;
    data?: T;
};

@Provider()
export class BlipFactory {
    @Inject(Qbcore)
    private qbcore: Qbcore;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(FeatureProvider)
    public featureProvider: FeatureProvider;

    private blips = new Map<string, GameBlip>();

    public getAll(): Map<string, GameBlip> {
        return this.blips;
    }

    @Tick()
    public checkBlipSelected(): void {
        const blipId = GetNewSelectedMissionCreatorBlip();

        if (!blipId) {
            return;
        }

        let blip = null;

        for (const item of this.blips.values()) {
            if (item.gameId === blipId) {
                blip = item;
                break;
            }
        }

        if (!blip || !blip.actions) {
            return;
        }

        const nuiActions = blip.actions.map(action => {
            return {
                id: action.id,
                blipId: blip.id,
                label: action.label,
            };
        });

        this.nuiDispatch.dispatch('blip', 'SetActions', nuiActions);
    }

    @OnNuiEvent(NuiEvent.BlipAction)
    public async onBlipAction({ blipId, id }: { blipId: string; id: string }) {
        const blip = this.blips.get(blipId);

        if (!blip) {
            return;
        }

        const action = blip.actions.find(action => action.id === id);

        if (!action) {
            return;
        }

        await action.action(blip.blip, action.data);
    }

    @OnEvent(ClientEvent.BLIP_CREATE)
    public create<T = undefined>(id: string, blipCreated: Blip, actions?: Omit<BlipAction<T>, 'id'>[]): number {
        const blip = {
            range: true,
            scale: 0.8,
            type: BlipType.Coord,
            ...blipCreated,
        };

        if (blip.coords) {
            blip.position = [blip.coords.x, blip.coords.y, blip.coords.z];
        }

        if (
            this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode) &&
            WhatIfRadiationZone.some(zone => zone.isPointInside(blip.position as Vector3))
        ) {
            return -1;
        }

        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode) && blip.group !== 'admin') {
            return -1;
        }

        if (actions) {
            blip.mission = true;
        }

        let gameId = null;
        switch (blip.type) {
            case BlipType.Coord:
                gameId = AddBlipForCoord(blip.position[0], blip.position[1], blip.position[2]);
                break;
            case BlipType.Radius:
                gameId = AddBlipForRadius(blip.position[0], blip.position[1], blip.position[2], blip.radius);
                break;
        }

        if (!gameId) {
            throw new Error(`Failed to create blip ${id}`);
        }

        this.updateGameBlip(id, gameId, blip);
        this.blips.set(id, {
            blip,
            id,
            gameId,
            actions: actions?.map(action => {
                return {
                    ...action,
                    id: uuidv4(),
                };
            }),
        });

        if (blip.hidden) {
            this.hide(id, true);
        }

        return gameId;
    }

    public hide(id: string, value: boolean): void {
        const gameBlip = this.blips.get(id);

        if (!gameBlip) {
            return;
        }

        gameBlip.blip.hidden = value;
        if (value) {
            SetBlipAlpha(gameBlip.gameId, 0);
            SetBlipHiddenOnLegend(gameBlip.gameId, true);
        } else {
            SetBlipAlpha(gameBlip.gameId, gameBlip.blip.alpha || 255);
            SetBlipHiddenOnLegend(gameBlip.gameId, false);
        }
    }

    public hideGroup(group: string, value: boolean): void {
        for (const [id, gameBlip] of this.blips) {
            if (gameBlip.blip.group === group) {
                this.hide(id, value);
            }
        }
    }

    public isHidden(id: string) {
        const gameBlip = this.blips.get(id);

        if (!gameBlip) {
            return;
        }

        return gameBlip.blip.hidden;
    }

    public qbHide(id: string, value: boolean): void {
        this.qbcore.HideBlip(id, value);
    }

    @OnEvent(ClientEvent.BLIP_DELETE)
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

    public getBlipsByGroup(group: string): GameBlip[] {
        return Array.from(this.blips.values()).filter(blip => blip.blip.group === group);
    }

    private updateGameBlip(id: string, gameId: number, blip: Partial<Blip>) {
        if (blip.position !== undefined && blip.type !== BlipType.Radius) {
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

        if (blip.scale !== undefined && blip.type != BlipType.Radius) {
            SetBlipScale(gameId, blip.scale);
        }

        if (blip.category !== undefined) {
            SetBlipCategory(gameId, blip.category);
        }

        if (blip.flash !== undefined) {
            SetBlipFlashes(gameId, blip.flash);
        }

        if (blip.rotation !== undefined) {
            SetBlipRotation(gameId, blip.rotation);
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
