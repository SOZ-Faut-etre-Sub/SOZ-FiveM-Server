import { Inject, Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { RewardWorldEvent, WorldEvent } from '../../shared/scene';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(WorldEventRepository, Repository)
export class WorldEventRepository extends Repository<RepositoryType.WorldEvent> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.WorldEvent;

    protected async load(): Promise<Record<string, WorldEvent>> {
        const events = await this.prismaService.event.findMany({
            select: {
                id: true,
                name: true,
                reward: true,
                start_sound: true,
            },
        });

        const list = {};

        for (const event of events) {
            list[event.id] = {
                id: event.id,
                name: event.name,
                reward: event.reward as RewardWorldEvent[],
                startSound: event.start_sound,
            } as WorldEvent;
        }

        return list;
    }

    public async getEvent(eventId: string) {
        return this.data[eventId];
    }

    public async addEvent(name: string) {
        const event = await this.prismaService.event.create({
            data: {
                name,
                reward: [],
            },
        });

        this.data[event.id] = {
            id: event.id,
            name: event.name,
            startSound: null,
            reward: [],
        };

        return this.data[event.id];
    }

    public async remove(eventId: string) {
        const event = this.data[eventId];

        delete this.data[eventId];

        await this.prismaService.event.delete({
            where: {
                id: eventId,
            },
        });

        return event;
    }

    public async addReward(eventId: string, reward: RewardWorldEvent) {
        const event = this.data[eventId];

        event.reward.push(reward);

        const rewards: RewardWorldEvent[] = [];

        for (const reward of event.reward) {
            rewards.push({
                item: reward.item,
                min: reward.min,
                max: reward.max,
                chance: reward.chance,
            });
        }

        await this.prismaService.event.update({
            where: {
                id: eventId,
            },
            data: {
                reward: rewards,
            },
        });

        return this.data[event.id];
    }

    public async removeReward(eventId: string, itemId: string) {
        const event = this.data[eventId];

        event.reward = event.reward.filter(reward => reward.item !== itemId);

        const rewards: RewardWorldEvent[] = [];

        for (const reward of event.reward) {
            rewards.push({
                item: reward.item,
                min: reward.min,
                max: reward.max,
                chance: reward.chance,
            });
        }

        await this.prismaService.event.update({
            where: {
                id: eventId,
            },
            data: {
                reward: rewards,
            },
        });

        return this.data[event.id];
    }

    public async setRewardChance(eventId: string, itemId: string, chance: number) {
        const event = this.data[eventId];
        const reward = event.reward.find(reward => reward.item === itemId);

        if (!reward) {
            console.log('reward not found for item id', itemId);
            return;
        }

        reward.chance = chance;

        await this.prismaService.event.update({
            where: {
                id: eventId,
            },
            data: {
                reward: event.reward,
            },
        });
    }

    public async setRewardMin(eventId: string, itemId: string, min: number) {
        const event = this.data[eventId];
        const reward = event.reward.find(reward => reward.item === itemId);

        if (!reward) {
            return;
        }

        reward.min = min;

        await this.prismaService.event.update({
            where: {
                id: eventId,
            },
            data: {
                reward: event.reward,
            },
        });
    }

    public async setRewardMax(eventId: string, itemId: string, max: number) {
        const event = this.data[eventId];
        const reward = event.reward.find(reward => reward.item === itemId);

        if (!reward) {
            return;
        }

        reward.max = max;

        await this.prismaService.event.update({
            where: {
                id: eventId,
            },
            data: {
                reward: event.reward,
            },
        });
    }

    public async setStartSound(eventId: string, sound: string | null) {
        const event = this.data[eventId];
        event.startSound = sound;

        await this.prismaService.event.update({
            where: {
                id: eventId,
            },
            data: {
                start_sound: sound,
            },
        });
    }
}
