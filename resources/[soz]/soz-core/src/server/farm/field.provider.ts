import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { Field } from '../../shared/field';
import { PrismaService } from '../database/prisma.service';

@Provider()
export class FieldProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    private fields: Field[] = [];

    public getFields(): Field[] {
        return this.fields;
    }

    public async createField(field: Field) {
        const databaseField = await this.prismaService.field.findFirst({
            where: {
                identifier: field.identifier,
                owner: field.owner,
            },
        });

        if (databaseField) {
            this.fields.push({ ...field, ...JSON.parse(databaseField.data) });
            return;
        }

        this.fields.push(field);
    }

    public getField(identifier: string): Field {
        return this.fields.find(field => field.identifier === identifier);
    }

    public harvestField(identifier: string, amount: number): boolean {
        const field = this.getField(identifier);
        if (!field) {
            return false;
        }

        if (field.capacity < amount) {
            return false;
        }

        field.capacity -= amount;
        field.harvest.lastAction = new Date().getTime();
        return true;
    }

    public async refillField(identifier: string) {
        const field = this.getField(identifier);
        if (!field) {
            return;
        }

        if (field.capacity >= field.maxCapacity) {
            return;
        }

        if (field.capacity + field.refill.amount > field.maxCapacity) {
            field.capacity = field.maxCapacity;
            return;
        }

        field.capacity += field.refill.amount;
        field.refill.lastAction = new Date().getTime();
    }

    @Tick(TickInterval.EVERY_SECOND)
    public async onTick() {
        this.fields.forEach(field => {
            if ((field.refill.lastAction || 0) + field.refill.delay < new Date().getTime()) {
                this.refillField(field.identifier);
            }
        });
    }
    @Tick(TickInterval.EVERY_SECOND)
    public async saveTick() {
        for (const field of this.fields) {
            const fieldData = JSON.stringify({ ...field, identifier: undefined, owner: undefined });

            await this.prismaService.field.upsert({
                create: {
                    owner: field.owner,
                    identifier: field.identifier,
                    data: fieldData,
                },
                update: {
                    data: fieldData,
                },
                where: {
                    fieldOwner: {
                        identifier: field.identifier,
                        owner: field.owner,
                    },
                },
            });
        }
    }
}
