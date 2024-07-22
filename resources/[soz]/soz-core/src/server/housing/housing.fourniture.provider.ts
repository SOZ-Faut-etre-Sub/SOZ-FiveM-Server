import { Prisma } from '@prisma/client';
import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { BankService } from '@public/server/bank/bank.service';
import { PrismaService } from '@public/server/database/prisma.service';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { PlayerService } from '@public/server/player/player.service';
import { HousingRepository } from '@public/server/repository/housing.repository';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Apartment, getMaxFourntiure } from '@public/shared/housing/housing';
import { HousingProp } from '@public/shared/nui/prop_placement';
import { Vector4 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';
import {
    isHousingPropvalid,
    ZkeaBaseFourntiure,
    ZkeaFourniture,
    ZkeaFournitureModelTranslate,
    ZkeaPlateModel,
    ZkeaSpecialPlateModel,
} from '@public/shared/shop/zkea_fourniture';
import { isEqual } from 'lodash';

import { InventoryFactory } from '../inventory/inventory.factory';

@Provider()
export class HousingFournitureProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(Monitor)
    public monitor: Monitor;

    @Inject(HousingRepository)
    private housingRepository: HousingRepository;

    private fournitures: Record<number, Record<number, HousingProp>> = {};
    private lights: Record<string, Record<number, boolean>> = {};
    private plateChecked: Record<number, boolean> = {};

    @Once(OnceStep.DatabaseConnected)
    public async loadFournituresOnStart() {
        const fournitures = await this.prismaService.apartment_fourniture.findMany();

        for (const fourniture of fournitures) {
            this.fournitures[fourniture.apartment_id] ??= {};
            const modelName = this.translateModel(fourniture.model);
            if (isHousingPropvalid(modelName)) {
                this.fournitures[fourniture.apartment_id][fourniture.id] = this.formatFourniture(fourniture);
            }
        }
    }

    @OnEvent(ServerEvent.HOUSING_STORE_FOURNITURE)
    public async onStoreFourniture(source: number, apartmentId: number, propertyId: number) {
        await this.createBaseFourntiureIfNeeded(source, apartmentId, propertyId);
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory) {
            return;
        }

        const crates = Object.values(inventory.items()).filter(item => item.metadata.zkeaCrateElements);

        if (!crates) {
            return;
        }

        const fournituresDB: Prisma.apartment_fournitureCreateManyInput[] = [];
        const fournitureLabel: string[] = [];
        for (const crate of crates) {
            for (const item of crate.metadata.zkeaCrateElements) {
                fournituresDB.push({
                    apartment_id: apartmentId,
                    model: item.model,
                });
                fournitureLabel.push(ZkeaFourniture[item.model].name);
            }

            inventory.removeAtSlot(crate.slot, 1);
        }

        if (!fournituresDB.length) {
            return;
        }

        await this.addFourntiureForApartement(apartmentId, fournituresDB);
        this.notifier.notify(source, `Tu as stocké un ou plusieurs meubles !<br>- ${fournitureLabel.join('<br>- ')}`);
    }

    public async storeBaseFourntiure(source: number, apartmentId: number) {
        const fournituresDB: Prisma.apartment_fournitureCreateManyInput[] = [];
        const fournitureLabel: string[] = [];
        for (const model of ZkeaBaseFourntiure) {
            fournituresDB.push({
                apartment_id: apartmentId,
                model: model,
            });
            fournitureLabel.push(ZkeaFourniture[model].name);
        }

        await this.addFourntiureForApartement(apartmentId, fournituresDB);
        this.notifier.notify(
            source,
            `Des meubles t'ont été offert par le Zkea, n'hésite pas à en acheter plus !<br>- ${fournitureLabel.join('<br>- ')}`
        );
    }

    private async addFourntiureForApartement(
        apartmentId: number,
        fourniture: Prisma.apartment_fournitureCreateManyInput[]
    ) {
        await this.prismaService.apartment_fourniture.createMany({
            data: fourniture,
            skipDuplicates: false,
        });

        const fournitures = await this.prismaService.apartment_fourniture.findMany({
            where: { apartment_id: apartmentId },
        });

        for (const fourniture of fournitures) {
            this.logFourniture(source, 'create', fourniture.apartment_id, fourniture.id, fourniture.model);
        }

        this.fournitures[apartmentId] ??= {};
        for (const fourniture of fournitures) {
            const modelName = this.translateModel(fourniture.model);
            if (isHousingPropvalid(modelName)) {
                this.fournitures[apartmentId][fourniture.id] = this.formatFourniture(fourniture);
            }
        }
        TriggerClientEvent(ClientEvent.HOUSING_SYNC_FOURNITURE, -1, apartmentId);
    }

    @Rpc(RpcServerEvent.HOUSING_GET_FOURNITURE)
    public async getFournitureData(
        source: number,
        apartmentId: number,
        propertyId: number,
        lastUpdate: number | null
    ): Promise<{ fournitures: HousingProp[]; newDate: number }> {
        const newDate = Date.now();
        const createdBase = await this.createBaseFourntiureIfNeeded(source, apartmentId, propertyId);
        const modifiedPlate = await this.checkPlateFourntiureIfNeeded(source, apartmentId, propertyId);
        return createdBase || modifiedPlate
            ? { fournitures: [], newDate: newDate }
            : { fournitures: this.getFilteredFourntiure(apartmentId, lastUpdate), newDate: newDate };
    }

    @Rpc(RpcServerEvent.HOUSING_GET_LIGHTS)
    public async getLightsData(source: number, apartmentId: number): Promise<{ lights: Record<number, boolean> }> {
        return { lights: this.lights[apartmentId] || {} };
    }

    private getFilteredFourntiure(apartmentId: number, lastUpdate: number | null): HousingProp[] {
        const allFournitures = Object.values(this.fournitures[apartmentId]);
        if (!lastUpdate) {
            return allFournitures;
        }

        return allFournitures.filter(fourntiure => {
            return fourntiure.updated >= lastUpdate;
        });
    }

    private async createBaseFourntiureIfNeeded(source: number, apartmentId: number, propertyId: number) {
        if (!this.fournitures[apartmentId] || Object.values(this.fournitures[apartmentId]).length === 0) {
            const [, apartement] = await this.housingRepository.getApartment(propertyId, apartmentId);

            if (!apartement.owner) {
                return false;
            }

            await this.storeBaseFourntiure(source, apartmentId);
            return true;
        }
        return false;
    }

    private async checkPlateFourntiureIfNeeded(source: number, apartmentId: number, propertyId: number) {
        if (this.plateChecked[apartmentId]) {
            return;
        }

        const [, apartement] = await this.housingRepository.getApartment(propertyId, apartmentId);
        if (!apartement) {
            return;
        }

        this.plateChecked[apartmentId] = true;
        const owner = this.playerService.getPlayerByCitizenId(apartement.owner);
        const roommate = this.playerService.getPlayerByCitizenId(apartement.roommate);

        const plates = Object.values(this.fournitures[apartmentId]).filter(v => v.model === ZkeaPlateModel);
        const target = (owner?.metadata?.plate ? 1 : 0) + (roommate?.metadata?.plate ? 1 : 0);

        if (plates.length < target) {
            await this.addFourntiureForApartement(
                apartmentId,
                Array(target - plates.length).fill({ apartment_id: apartmentId, model: ZkeaPlateModel })
            );
            this.notifier.notify(
                source,
                `Des meubles t'ont été offert par le Zkea, n'hésite pas à en acheter plus !<br>- ${Array(
                    target - plates.length
                )
                    .fill(ZkeaFourniture[ZkeaPlateModel].name)
                    .join('<br>- ')}`
            );
        }

        const special_plate = Object.values(this.fournitures[apartmentId]).find(v => v.model === ZkeaSpecialPlateModel);
        if (!special_plate && (owner?.metadata?.special_plate || roommate?.metadata?.special_plate)) {
            await this.addFourntiureForApartement(
                apartmentId,
                Array(1).fill({ apartment_id: apartmentId, model: ZkeaSpecialPlateModel })
            );
            this.notifier.notify(
                source,
                `Des meubles t'ont été offert par le Zkea, n'hésite pas à en acheter plus !<br>- ${ZkeaFourniture[ZkeaSpecialPlateModel].name}`
            );
        }
    }

    public async deletePlatesIfNeeded(apartment: Apartment) {
        await this.deletePlateIfNeeded(apartment);
        await this.deleteSpecialPlateIfNeeded(apartment);
    }

    private async deletePlateIfNeeded(apartment: Apartment) {
        const owner = this.playerService.getPlayerByCitizenId(apartment.owner);
        const roommate = this.playerService.getPlayerByCitizenId(apartment.roommate);

        const plates = Object.values(this.fournitures[apartment.id]).filter(v => v.model === ZkeaPlateModel);
        const target = (owner?.metadata?.plate ? 1 : 0) + (roommate?.metadata?.plate ? 1 : 0);
        if (plates.length <= target) {
            return;
        }

        await this.prismaService.apartment_fourniture.delete({
            where: { id: plates[0].id },
        });

        delete this.fournitures[apartment.id][plates[0].id];
        this.clearPlateCheck(apartment.id);
        TriggerClientEvent(ClientEvent.HOUSING_DELETE_FOURNITURE, -1, apartment.id, plates[0].id);
    }

    private async deleteSpecialPlateIfNeeded(apartment: Apartment) {
        const owner = this.playerService.getPlayerByCitizenId(apartment.owner);
        const roommate = this.playerService.getPlayerByCitizenId(apartment.roommate);

        const plates = Object.values(this.fournitures[apartment.id]).filter(v => v.model === ZkeaSpecialPlateModel);
        const target = owner?.metadata?.special_plate ? 1 : 0 + (roommate?.metadata?.special_plate ? 1 : 0);
        if (plates.length <= target) {
            return;
        }

        await this.prismaService.apartment_fourniture.delete({
            where: { id: plates[0].id },
        });

        delete this.fournitures[apartment.id][plates[0].id];
        this.clearPlateCheck(apartment.id);
        TriggerClientEvent(ClientEvent.HOUSING_DELETE_FOURNITURE, -1, apartment.id, plates[0].id);
    }

    public clearPlateCheck(apartmentId: number) {
        this.plateChecked[apartmentId] = false;
    }

    @Rpc(RpcServerEvent.HOUSING_SET_SHELL)
    public async editHousingShell(source: number, apartmentId: number, propertyId: number, shellEnable: boolean) {
        await this.housingRepository.updateApartmentShell(apartmentId, propertyId, shellEnable);

        if (shellEnable) {
            this.notifier.notify(
                source,
                "Tu as ~r~désactivé~s~ ton aménagement personnalisé ! Tes meubles d'origines ont été remis dans ton habitation.",
                'info'
            );
        } else {
            this.notifier.notify(
                source,
                "Tu as ~g~activé~s~ ton aménagement personnalisé ! Tes meubles d'origines ont été retirés de ton habitation.",
                'info'
            );
        }
        this.logShell(source, apartmentId, shellEnable);
    }

    @Rpc(RpcServerEvent.HOUSING_EDIT_FOURNITURE)
    public async editFournitureData(
        source: number,
        apartmentId: number,
        propertyId: number,
        fournitureId: number,
        position: Vector4,
        matrix: number[],
        storageType: string
    ) {
        const [, apartement] = await this.housingRepository.getApartment(propertyId, apartmentId);
        if (!apartement) {
            return false;
        }

        const currentFourniture = this.fournitures?.[apartement.id]?.[fournitureId];
        const [validateStorage, fourntiuresWithSameStorage] = await this.validateStorage(
            source,
            apartement,
            currentFourniture,
            storageType
        );
        if (!validateStorage) {
            return false;
        }

        const validateCount = await this.validateCount(apartement, currentFourniture, position);
        if (!validateCount) {
            this.notifier.notify(
                source,
                'Tu as placé assez de meuble. Améliore ton habitation pour faire plus de place!',
                'error'
            );
            return false;
        }

        this.fournitures[apartmentId] ??= {};

        for (const fourntiureWithSameStorage of fourntiuresWithSameStorage) {
            await this.editFourniture(
                source,
                fourntiureWithSameStorage,
                fourntiureWithSameStorage.position,
                fourntiureWithSameStorage.matrix,
                null
            );
        }

        await this.editFourniture(source, currentFourniture, position, matrix, storageType);
        TriggerClientEvent(ClientEvent.HOUSING_SYNC_FOURNITURE, -1, apartmentId);

        return true;
    }

    private async editFourniture(
        source: number,
        currentFourniture: HousingProp,
        position: Vector4,
        matrix: number[],
        storageType: string
    ) {
        const fourniture = await this.prismaService.apartment_fourniture.update({
            where: {
                id: currentFourniture.id,
            },
            data: {
                position: position ? JSON.stringify(position) : null,
                matrix: matrix ? JSON.stringify(matrix) : null,
                storage_type: storageType,
            },
        });

        this.logFourniture(source, 'update', fourniture.apartment_id, fourniture.id, fourniture.model);

        const formatedFourntiure = this.formatFourniture(fourniture);
        this.fournitures[fourniture.apartment_id][fourniture.id] = formatedFourntiure;

        this.notifyPropChange(source, currentFourniture, formatedFourntiure);
    }

    private notifyPropChange(source: number, currentFourniture: HousingProp, newFourniture: HousingProp) {
        let notification: string;

        if (currentFourniture.position && !newFourniture.position) {
            notification = `L'objet ~p~${ZkeaFourniture[currentFourniture.model].name}~s~ ~r~a été supprimé~s~ de ton habitation.`;
        } else if (!currentFourniture.position && newFourniture.position) {
            notification = `L'objet ~p~${ZkeaFourniture[currentFourniture.model].name}~s~ ~g~a été placé~s~ dans ton habitation.`;
        } else if (
            currentFourniture.position &&
            newFourniture.position &&
            !isEqual(currentFourniture.position, newFourniture.position)
        ) {
            if (currentFourniture.storageType === newFourniture.storageType) {
                notification = `L'objet ~p~${ZkeaFourniture[currentFourniture.model].name}~s~ ~y~a été déplacé~s~ dans ton habitation.`;
            } else {
                notification = `L'objet ~p~${ZkeaFourniture[currentFourniture.model].name}~s~ ~y~a été déplacé~s~ et ~b~modifié~s~ dans ton habitation.`;
            }
        } else if (currentFourniture.storageType !== newFourniture.storageType) {
            notification = `L'objet ~p~${ZkeaFourniture[currentFourniture.model].name}~s~ ~b~a été modifié~s~ dans ton habitation.`;
        }

        if (!notification) {
            return;
        }

        this.notifier.notify(source, notification, 'info');
    }

    private async validateStorage(
        source: number,
        apartement: Apartment,
        currentFourniture: HousingProp,
        storageType: string
    ): Promise<[boolean, HousingProp[]]> {
        if (!currentFourniture) {
            return [false, null];
        }

        let fourntiuresWithSameStorage: HousingProp[] = [];
        if (currentFourniture.storageType !== storageType) {
            let message = null;

            if (currentFourniture.storageType !== null || currentFourniture.storageType !== 'cloth_stock') {
                if (currentFourniture.storageType === 'stock') {
                    const inventory = await this.inventoryFactory.get(`house_stash_${apartement.identifier}`);

                    if (Object.values(inventory.items()).length) {
                        message = `Attention, tu essaies de ~r~supprimer~s~ un coffre avec des objets à l'intérieur ! Si tu souhaites faire cela, il est nécessaire de vider ton ~p~${ZkeaFourniture[currentFourniture.model].name}~s~.`;
                    }
                } else if (currentFourniture.storageType === 'food_stock') {
                    const inventory = await this.inventoryFactory.get(`house_fridge_${apartement.identifier}`);

                    if (Object.values(inventory.items()).length) {
                        message = `Attention, tu essaies de ~r~supprimer~s~ un coffre avec des objets à l'intérieur ! Si tu souhaites faire cela, il est nécessaire de vider ton ~p~${ZkeaFourniture[currentFourniture.model].name}~s~.`;
                    }
                } else if (currentFourniture.storageType === 'cash_stock') {
                    const money = await this.bankService.getAccountMoney(apartement.identifier, 'marked_money');
                    if (money !== 0) {
                        message = `Attention, tu essaies de ~r~supprimer~s~ un coffre avec de l'argent à l'intérieur ! Si tu souhaites faire cela, il est nécessaire de vider ton ~p~${ZkeaFourniture[currentFourniture.model].name}~s~.`;
                    }
                }
            }

            if (storageType !== null) {
                fourntiuresWithSameStorage = Object.values(this.fournitures[apartement.id]).filter(
                    fourntiure => storageType === fourntiure.storageType && fourntiure.id !== currentFourniture.id
                );
            }

            if (message !== null) {
                this.notifier.notify(source, message, 'error');
                return [false, null];
            }
        }

        return [true, fourntiuresWithSameStorage];
    }

    private async validateCount(
        apartement: Apartment,
        currentFourniture: HousingProp,
        position: Vector4
    ): Promise<boolean> {
        if (!currentFourniture) {
            return false;
        }

        if (!apartement) {
            return false;
        }

        if (currentFourniture && currentFourniture.position === null && position !== null) {
            let fournitureCount = 0;
            for (const fourniture of Object.values(this.fournitures[apartement.id])) {
                if (fourniture.position) {
                    fournitureCount++;
                }
            }

            if (fournitureCount + 1 > getMaxFourntiure(apartement)) {
                return false;
            }
        }

        return true;
    }

    public async clearFourniture(apartmentId: number) {
        await this.prismaService.apartment_fourniture.deleteMany({
            where: { apartment_id: apartmentId },
        });
        this.fournitures[apartmentId] = {};
        this.clearPlateCheck(apartmentId);
    }

    private formatFourniture(fourniture: {
        id: number;
        apartment_id: number;
        model: string;
        position: string | null;
        matrix: string | null;
        storage_type: string | null;
    }): HousingProp {
        const realModel = this.translateModel(fourniture.model);
        return {
            id: fourniture.id,
            model: realModel,
            label: ZkeaFourniture[realModel].name,
            position: fourniture.position ? (JSON.parse(fourniture.position) as Vector4) : null,
            matrix: fourniture.matrix ? (JSON.parse(fourniture.matrix) as number[]) : null,
            storageType: fourniture.storage_type,
            updated: Date.now(),
        };
    }

    private translateModel(model: string): string {
        return ZkeaFournitureModelTranslate[model] || model;
    }

    private logFourniture(source: number, type: string, apartmentId: number, fournitureId: number, model: string) {
        this.monitor.traceEvent(`apartment_fourniture_${type}`, {
            player_source: source,
            prop_model: model,
            apartment_id: apartmentId,
            fourniture_id: fournitureId,
        });
    }

    private logShell(source: number, apartmentId: number, shellEnable: boolean) {
        this.monitor.traceEvent(`apartment_shell_toggle`, {
            player_source: source,
            apartment_id: apartmentId,
            apartment_shell: shellEnable,
        });
    }

    @OnEvent(ServerEvent.HOUSING_TOGGLE_LIGHTS)
    public async housingToggleLights(source: number, apartmentId: number, room: number) {
        this.lights[apartmentId] ??= {};
        this.lights[apartmentId][room] = !this.lights[apartmentId][room];

        TriggerClientEvent(ClientEvent.HOUSING_SYNC_LIGHT, -1, apartmentId, room, this.lights[apartmentId][room]);
    }
}
