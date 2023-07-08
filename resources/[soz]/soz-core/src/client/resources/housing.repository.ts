import { Injectable } from '../../core/decorators/injectable';
import { emitRpc } from '../../core/rpc';
import { Apartment, Property } from '../../shared/housing/housing';
import { RpcServerEvent } from '../../shared/rpc';

@Injectable()
export class HousingRepository {
    private properties: Property[] = [];

    public async load() {
        this.properties = await emitRpc(RpcServerEvent.REPOSITORY_GET_DATA, 'housing');
    }

    public update(properties: Property[]) {
        this.properties = properties;
    }

    public get(): Property[] {
        return this.properties;
    }

    public findProperty(propertyId: number): Property | null {
        return this.properties.find(property => property.id === propertyId) ?? null;
    }

    public findApartment(propertyId: number, apartmentId: number): Apartment | null {
        const property = this.findProperty(propertyId);

        if (!property) {
            return null;
        }

        return property.apartments.find(apartment => apartment.id === apartmentId) ?? null;
    }
}
