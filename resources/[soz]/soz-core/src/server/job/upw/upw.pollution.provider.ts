import { Command } from '@public/core/decorators/command';
import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick } from '@public/core/decorators/tick';
import { PrismaService } from '@public/server/database/prisma.service';
import { Notifier } from '@public/server/notifier';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { UpwConfig, UpwPollution } from '@public/shared/job/upw';

import { Provider } from '../../../core/decorators/provider';

const PM = 'pm1';

@Provider()
export class UpwPollutionProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Notifier)
    private notifier: Notifier;

    private pollutionThisTick = 0;
    private units: number[];
    private currentPollution = 0;

    @Once(OnceStep.DatabaseConnected)
    public async onDBReady() {
        const pm = await this.prismaService.upw_facility.findUnique({
            where: {
                identifier: PM,
            },
        });

        if (pm) {
            const data = JSON.parse(pm.data);
            this.units = data.units;
            this.currentPollution = data.currentPollution;
        } else {
            this.units = [];
            this.currentPollution = 0;
        }
    }

    public addPollution(value: number) {
        this.pollutionThisTick += value;
    }

    @Tick(UpwConfig.Pollution.Tick)
    private updatePollution() {
        if (!this.units) {
            return;
        }

        //Handle pollution buffer
        this.units.push(Math.round(this.pollutionThisTick));
        this.pollutionThisTick = 0;

        // Trim buffer to max number of units
        const maxNumberOfUnits = Math.ceil((UpwConfig.Pollution.Persistence * 3_600_000) / UpwConfig.Pollution.Tick);

        if (this.units.length > maxNumberOfUnits) {
            this.units.splice(0, this.units.length - maxNumberOfUnits);
        }

        // Calculate current pollution percentage
        const pastUnits = Math.ceil(this.units.reduce((prev, cur) => prev + cur, 0));
        const totalMaxUnits = UpwConfig.Pollution.Persistence * UpwConfig.Pollution.MaxUnitsPerHour;

        this.currentPollution = pastUnits / totalMaxUnits;

        const newPollutionLevel = this.getPollutionLevel();
        TriggerLatentClientEvent(
            ClientEvent.UPW_POLLUTION_UPDATE,
            -1,
            1024,
            newPollutionLevel,
            this.getPollutionPercent()
        );
    }

    @Tick(UpwConfig.Pollution.Tick * 5)
    public async saveLoop() {
        if (!this.units) {
            return;
        }
        await this.prismaService.upw_facility.upsert({
            create: {
                identifier: PM,
                type: 'pollution-manager',
                data: JSON.stringify({
                    units: this.units,
                    currentPollution: this.currentPollution,
                }),
            },
            update: {
                data: JSON.stringify({
                    units: this.units,
                    currentPollution: this.currentPollution,
                }),
            },
            where: {
                identifier: PM,
            },
        });
    }

    public getPollutionPercent() {
        return this.currentPollution * 100;
    }

    public getPollutionLevel(): UpwPollution {
        const currentPollution = this.currentPollution * 100;

        for (const level of Object.values(UpwPollution)) {
            const threshold = UpwConfig.Pollution.Threshold[level];
            if (currentPollution >= threshold.min && currentPollution < threshold.max) {
                return level;
            }
        }
        return UpwPollution.High;
    }

    @OnEvent(ServerEvent.UPW_POLLUTION_INIT)
    private init(source: number) {
        TriggerClientEvent(
            ClientEvent.UPW_POLLUTION_UPDATE,
            source,
            this.getPollutionLevel(),
            this.getPollutionPercent()
        );
    }

    @Command('resetpollution', {
        role: ['admin'],
    })
    public resetPollution(source: number) {
        this.units = [];
        this.notifier.notify(source, 'Pollution reset');
    }
}
