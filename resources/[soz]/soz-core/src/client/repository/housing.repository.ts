import { Injectable } from '../../core/decorators/injectable';
import { Apartment, Property } from '../../shared/housing/housing';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(HousingRepository, Repository)
export class HousingRepository extends Repository<RepositoryType.Housing> {
    public type = RepositoryType.Housing;

    public findProperty(propertyId: number): Property | null {
        return this.find(propertyId);
    }

    public findApartment(propertyId: number, apartmentId: number): Apartment | null {
        const property = this.findProperty(propertyId);

        if (!property) {
            return null;
        }

        return property.apartments.find(apartment => apartment.id === apartmentId) ?? null;
    }

    public async findApartmentFromCollision(entity: number): Promise<Apartment | null> {
        const targetInterior = GetInteriorFromEntity(entity);

        if (!targetInterior) {
            return null;
        }

        const allProperties = this.get();
        for (const property of allProperties) {
            for (const apartment of property.apartments) {
                if (apartment.position) {
                    const interior = GetInteriorFromCollision(
                        apartment.position[0],
                        apartment.position[1],
                        apartment.position[2]
                    );
                    if (targetInterior === interior) {
                        return apartment;
                    }
                }
            }
        }

        return null;
    }
}
