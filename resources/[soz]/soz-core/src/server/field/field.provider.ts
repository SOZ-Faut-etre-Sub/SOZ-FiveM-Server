import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import {
    Field,
    getAmount,
    getTreeIdentifier,
    isItemField,
    isPawlField,
    isTreeCutted,
    PawlFieldTree,
} from '../../shared/field';
import { FieldRepository } from '../repository/field.repository';

@Provider()
export class FieldProvider {
    @Inject(FieldRepository)
    private fieldRepository: FieldRepository;

    public async createField(field: Field) {
        await this.fieldRepository.createField(field);
    }

    public async getField(identifier: string) {
        return await this.fieldRepository.find(identifier);
    }

    public async harvestField(identifier: string, amount: number) {
        const field = await this.getField(identifier);

        if (!isItemField(field)) {
            return;
        }

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

    public async getTree(fieldIdentifier: string, treeIdentifier: string): Promise<PawlFieldTree> {
        const field = await this.getField(fieldIdentifier);

        if (!isPawlField(field)) {
            return null;
        }

        let treeFound = null;

        for (const tree of field.field) {
            const identifier = getTreeIdentifier(field, tree);

            if (identifier === treeIdentifier) {
                treeFound = tree;
                break;
            }
        }

        if (!treeFound) {
            return null;
        }

        if (isTreeCutted(field, treeFound)) {
            return null;
        }

        return treeFound;
    }

    public async harvestTree(fieldIdentifier: string, treeIdentifier: string) {
        const tree = await this.getTree(fieldIdentifier, treeIdentifier);

        if (!tree) {
            return false;
        }

        tree.harvestTime = Math.round(new Date().getTime() / 1000);

        return true;
    }

    @Tick(TickInterval.EVERY_SECOND, 'field:refill')
    public async onTick() {
        const fields = await this.fieldRepository.get();

        for (const field of fields) {
            if (!isItemField(field)) {
                continue;
            }

            if (!field.refill) {
                console.log('Field is missing refill options', field);
                continue;
            }

            if ((field.refill.lastAction || 0) + field.refill.delay < new Date().getTime()) {
                if (field.capacity >= field.maxCapacity) {
                    continue;
                }

                const refillAmount = getAmount(field.refill.amount);

                if (field.capacity + refillAmount > field.maxCapacity) {
                    field.capacity = field.maxCapacity;
                    continue;
                }

                field.capacity += refillAmount;
                field.refill.lastAction = new Date().getTime();
            }
        }
    }

    @Tick(TickInterval.EVERY_MINUTE, 'field:save')
    public async saveTick() {
        await this.fieldRepository.save();
    }
}
