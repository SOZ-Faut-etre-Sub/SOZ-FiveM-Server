import { Inject, Injectable } from '../../core/decorators/injectable';
import { Field } from '../../shared/field';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(FieldRepository, Repository)
export class FieldRepository extends Repository<RepositoryType.Field> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.Field;

    protected async load(): Promise<Record<string, Field>> {
        return {};
    }

    public async createField(field: Field): Promise<Field> {
        const databaseField = await this.prismaService.field.findFirst({
            where: {
                identifier: field.identifier,
                owner: field.owner,
            },
        });

        if (databaseField) {
            this.data[field.identifier] = { ...field, ...JSON.parse(databaseField.data) };

            return this.data[field.identifier];
        }

        this.data[field.identifier] = {
            ...field,
        };

        return this.data[field.identifier];
    }

    public async save() {
        const fields = await this.get();

        for (const field of fields) {
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
