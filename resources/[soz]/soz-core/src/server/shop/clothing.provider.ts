import { Provider } from '@core/decorators/provider';
import {
    ExcludedClothes,
    SameUnder,
    UndershirtTypeCategory,
    UndershirtTypeForTop,
    UndershirtTypes,
    UndershirtTypeShops,
} from '@public/config/shops';
import { Command } from '@public/core/decorators/command';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Rpc } from '@public/core/decorators/rpc';
import { emitClientRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { Component, Outfit, OutfitItem, ScubaOutfit } from '@public/shared/cloth';
import { VanillaComponentDrawableIndexMaxValue } from '@public/shared/drawable';
import { ServerEvent } from '@public/shared/event';
import { HAZMAT_OUTFIT_NAME, LsmcCloakroom } from '@public/shared/job/lsmc';
import { PlayerPedHash } from '@public/shared/player';
import { RpcClientEvent, RpcServerEvent } from '@public/shared/rpc';
import {
    ClothingShop,
    ClothingShopCategory,
    ClothingShopID,
    ClothingShopItemData,
    ClothingShopRepositoryData,
} from '@public/shared/shop';

import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ClothingShopRepository } from '../repository/cloth.shop.repository';

@Provider()
export class ClothingProvider {
    @Inject(ClothingShopRepository)
    private clothingShopRepository: ClothingShopRepository;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Rpc(RpcServerEvent.CLOTHING_GET_SHOP)
    public async getShopData(
        source: number,
        playerPedHash: number,
        shop: string
    ): Promise<{ shop: ClothingShop; content: Record<number, ClothingShopCategory> }> {
        const clothingData = await this.getClothingData(source, playerPedHash);

        if (!clothingData) {
            return null;
        }

        return {
            shop: clothingData.shops[shop],
            content: clothingData.categories[playerPedHash][clothingData.shops[shop].id],
        };
    }

    private async getClothingData(source: number, playerPedHash: number): Promise<ClothingShopRepositoryData> {
        const shop = await this.clothingShopRepository.get();
        if (!shop) {
            return null;
        }

        // remove categories from another ped model
        return {
            ...shop,
            categories: Object.entries(shop.categories)
                .filter(([key]) => Number(key) === playerPedHash)
                .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {}) as { [key: string]: any },
        };
    }

    @Rpc(RpcServerEvent.CLOTHING_GET_WARM_SCORE)
    public async getClothCategory(
        source: number,
        outfit: Partial<Record<Component, OutfitItem>>
    ): Promise<Partial<Record<Component, number>>> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return null;
        }

        const shop = await this.clothingShopRepository.get();
        if (!shop) {
            return null;
        }

        const ret: Partial<Record<Component, number>> = {};

        for (const compString of Object.keys(outfit)) {
            const component = Number(compString) as Component;
            if (component == Component.Torso) {
                continue;
            }

            for (const shopContent of Object.values(shop.categories[player.skin.Model.Hash])) {
                const cat = Object.values(shopContent).find(category => {
                    return !!Object.values(category.content).find(item => {
                        return item.find(
                            elem =>
                                elem.components[component] &&
                                outfit[component] &&
                                elem.components[component].Drawable == outfit[component].Drawable
                        );
                    });
                });
                if (cat) {
                    ret[component] = cat.warmScore;
                    break;
                }
            }
        }

        return ret;
    }

    @OnEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES)
    public setJobClothes(source: number, outfit: Outfit) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (!outfit) {
            this.playerService.setPlayerMetaDatas(source, {
                hazmat: false,
                scuba: false,
            });
            return;
        }

        let scuba = true;
        let hazmat = true;

        for (const [componentkey, item] of Object.entries(
            LsmcCloakroom[player.skin.Model.Hash][HAZMAT_OUTFIT_NAME].Components
        )) {
            const component = Number(componentkey) as Component;
            if (!outfit.Components[component] || outfit.Components[component].Drawable != item.Drawable) {
                hazmat = false;
                break;
            }
        }

        for (const [componentkey, item] of Object.entries(ScubaOutfit[player.skin.Model.Hash].Components)) {
            const component = Number(componentkey) as Component;
            if (!outfit.Components[component] || outfit.Components[component].Drawable != item.Drawable) {
                scuba = false;
                break;
            }
        }

        this.playerService.setPlayerMetaDatas(source, {
            hazmat,
            scuba,
        });
    }

    @Command('clothSQL', {
        role: 'admin',
    })
    public async genereteSQLDiff() {
        const items = await this.prismaService.shop_content.findMany({
            where: {
                shop_id: {
                    in: [ClothingShopID.BINCO, ClothingShopID.SUBURBAN, ClothingShopID.PONSONBYS],
                },
            },
        });

        const parsedItem: Record<
            PlayerPedHash,
            Partial<
                Record<
                    Component,
                    { id: number; data: ClothingShopItemData; shop: number; cat: number; label: string }[]
                >
            >
        > = {};

        for (const item of items) {
            const shopItemData: ClothingShopItemData = JSON.parse(item.data) as ClothingShopItemData;
            let comp: Component = 0 as Component;
            if (shopItemData.components[11]) {
                comp = 11;
            } else if (shopItemData.components[4]) {
                comp = 4;
            } else if (shopItemData.components[6]) {
                comp = 6;
            } else if (shopItemData.components[8]) {
                comp = 8;
            }
            parsedItem[shopItemData.modelHash] ??= {};
            parsedItem[shopItemData.modelHash][comp] ??= [];
            parsedItem[shopItemData.modelHash][comp].push({
                data: shopItemData,
                shop: item.shop_id,
                cat: item.category_id,
                id: item.id,
                label: item.label,
            });
        }

        let sql = "INSERT INTO category (id, name, parent_id, warm_score) VALUES (67, 'Décolté', 60, 0);\r\n";

        console.log('Start recreate Unders');
        for (const [genderStr, data] of Object.entries(UndershirtTypes)) {
            const gender = parseInt(genderStr);
            for (let under = 0; under < VanillaComponentDrawableIndexMaxValue[gender][Component.Undershirt]; under++) {
                const type = data[under];
                const shopDatas = parsedItem[gender][Component.Undershirt].filter(
                    elem => elem.data.components[Component.Undershirt].Drawable == under
                );

                if (!type) {
                    for (const shopItem of shopDatas) {
                        sql += `DELETE from shop_content WHERE id =${shopItem.id};\r\n`;
                    }
                    continue;
                }

                for (let index = 0; index < 26; index++) {
                    const texture = type.textures[index];
                    for (const shop of Object.values(ClothingShopID)) {
                        const existing = shopDatas.find(item => {
                            return item.data.components[8].Texture == index && item.shop == shop;
                        });

                        if (!texture || !UndershirtTypeShops[type.type].includes(shop)) {
                            if (existing) {
                                sql += `DELETE from shop_content WHERE id =${existing.id};\r\n`;
                            }
                            continue;
                        }

                        const cat = UndershirtTypeCategory[type.type];
                        if (!existing) {
                            const shopItemData: ClothingShopItemData = {
                                colorLabel: texture,
                                components: {
                                    [8]: {
                                        Drawable: under,
                                        Texture: index,
                                        Palette: 0,
                                    },
                                },
                                undershirtType: type.type,
                                modelLabel: type.label,
                                modelHash: gender,
                            };
                            sql += `INSERT INTO shop_content (shop_id, category_id, label, price, data, stock) VALUES (${shop}, ${cat}, '${type.label.replace("'", "\\'") + ' ' + texture.replace("'", "\\'")}', 70, '${JSON.stringify(shopItemData).replace("'", "\\'")}', 0);\r\n`;
                        } else {
                            const shopItemData = existing.data;
                            if (
                                shopItemData.undershirtType != type.type ||
                                shopItemData.modelLabel != type.label ||
                                shopItemData.colorLabel != texture ||
                                existing.label != type.label + ' ' + texture ||
                                existing.cat != cat
                            ) {
                                shopItemData.undershirtType = type.type;
                                shopItemData.colorLabel = texture;
                                shopItemData.modelLabel = type.label;
                                sql += `UPDATE shop_content set data = '${JSON.stringify(shopItemData).replace("'", "\\'")}', label = '${type.label.replace("'", "\\'") + ' ' + texture.replace("'", "\\'")}', category_id = ${cat} WHERE id =${existing.id};\r\n`;
                            }
                        }
                    }
                }
            }
            await wait(0);
        }

        console.log('Start update Tops');
        for (const [genderStr, data] of Object.entries(UndershirtTypeForTop)) {
            const gender = parseInt(genderStr);
            for (let top = 0; top < VanillaComponentDrawableIndexMaxValue[gender][Component.Tops]; top++) {
                const type = data[top] ?? [];

                const shopDatas: {
                    id: number;
                    data: ClothingShopItemData;
                    shop: number;
                    cat: number;
                    label: string;
                }[] = [];
                let update = false;
                for (const item of parsedItem[gender][Component.Tops]) {
                    const shopItemData = item.data;
                    if (shopItemData.components[11].Drawable == top) {
                        shopDatas.push(item);

                        if (JSON.stringify(shopItemData.underTypes.sort()) != JSON.stringify(type.sort())) {
                            update = true;
                        }
                    }
                }

                if (update) {
                    for (const shopData of shopDatas) {
                        const shopItemData = shopData.data;
                        shopItemData.underTypes = type;
                        sql += `UPDATE shop_content set data = '${JSON.stringify(shopItemData).replace("'", "\\'")}' WHERE id =${shopData.id};\r\n`;
                    }
                }
                await wait(0);
            }
        }

        SaveResourceFile('soz-core', 'update.sql', sql, -1);
        console.log('End clothSQL');
    }

    @Command('clothDelta', {
        role: 'admin',
    })
    public async delta() {
        const items = await this.prismaService.shop_content.findMany({
            where: {
                shop_id: {
                    in: [ClothingShopID.BINCO, ClothingShopID.SUBURBAN, ClothingShopID.PONSONBYS],
                },
            },
        });

        const drawblesForTypeDB: Record<PlayerPedHash, Record<number, Set<number>>> = {
            [PlayerPedHash.Female]: {},
            [PlayerPedHash.Male]: {},
        };
        const drawblesForTypeCode: Record<PlayerPedHash, Record<number, Set<number>>> = {
            [PlayerPedHash.Female]: {},
            [PlayerPedHash.Male]: {},
        };
        const typeForTopDB: Record<PlayerPedHash, Record<number, Set<number>>> = {
            [PlayerPedHash.Female]: {},
            [PlayerPedHash.Male]: {},
        };
        const typeForTopCode: Record<PlayerPedHash, Record<number, Set<number>>> = {
            [PlayerPedHash.Female]: {},
            [PlayerPedHash.Male]: {},
        };

        for (const [genderStr, data] of Object.entries(UndershirtTypes)) {
            const gender = parseInt(genderStr);
            for (const [underStr, type] of Object.entries(data)) {
                const under = parseInt(underStr);
                drawblesForTypeCode[gender as PlayerPedHash][type.type] ??= new Set<number>();
                drawblesForTypeCode[gender as PlayerPedHash][type.type].add(under);
            }
        }

        for (const [genderStr, data] of Object.entries(UndershirtTypeForTop)) {
            const gender = parseInt(genderStr);
            for (const [underStr, type] of Object.entries(data)) {
                const under = parseInt(underStr);
                typeForTopCode[gender as PlayerPedHash][under] ??= new Set<number>();
                for (const elem of type) {
                    typeForTopCode[gender as PlayerPedHash][under].add(elem);
                }
            }
        }

        for (const item of items) {
            const shopItemData: ClothingShopItemData = JSON.parse(item.data) as ClothingShopItemData;
            if (shopItemData.components[8]) {
                drawblesForTypeDB[shopItemData.modelHash][shopItemData.undershirtType] ??= new Set<number>();
                drawblesForTypeDB[shopItemData.modelHash][shopItemData.undershirtType].add(
                    shopItemData.components[8].Drawable
                );
            }
            if (shopItemData.components[11]) {
                typeForTopDB[shopItemData.modelHash][shopItemData.components[11].Drawable] ??= new Set<number>();
                for (const elem of shopItemData.underTypes) {
                    typeForTopDB[shopItemData.modelHash][shopItemData.components[11].Drawable].add(elem);
                }
            }
        }

        console.log('Mid cloth delta');

        for (const genderStr of Object.keys(UndershirtTypeForTop)) {
            const gender = parseInt(genderStr);
            let delta = '';
            for (let top = 0; top < VanillaComponentDrawableIndexMaxValue[gender][11]; top++) {
                if (!typeForTopDB[gender][top]) {
                    delta += `${top.toString().padStart(3)} | No Shop \r\n`;
                    continue;
                }

                const typesDB = typeForTopDB[gender][top] ? Array.from(typeForTopDB[gender][top]) : [];
                const drawableDB: number[] = [];

                for (const type of typesDB) {
                    for (const d of Array.from(drawblesForTypeDB[gender][type])) {
                        drawableDB.push(d);
                    }
                }

                const typesCode = typeForTopCode[gender][top] ? Array.from(typeForTopCode[gender][top]) : [];
                const drawableCode: number[] = [];

                for (const type of typesCode) {
                    for (const d of Array.from(drawblesForTypeCode[gender][type])) {
                        drawableCode.push(d);
                    }
                }

                drawableDB.sort((a, b) => a - b);
                drawableCode.sort((a, b) => a - b);

                if (JSON.stringify(drawableDB) != JSON.stringify(drawableCode)) {
                    const missingCode = drawableDB.filter(elem => !drawableCode.includes(elem));
                    const missingDB = drawableCode.filter(elem => !drawableDB.includes(elem));

                    const newMissingCode = [];
                    const newMissingDB = [];
                    for (const missing of missingCode) {
                        const samesList = SameUnder[gender].filter(elem => elem.includes(missing));
                        if (samesList.find(sames => sames.find(same => drawableCode.includes(same)))) {
                            continue;
                        }
                        newMissingCode.push(missing);
                    }
                    for (const missing of missingDB) {
                        const sames = SameUnder[gender].find(elem => elem.includes(missing));
                        if (sames && sames.find(same => drawableDB.includes(same))) {
                            continue;
                        }
                        newMissingDB.push(missing);
                    }

                    delta += `${top.toString().padStart(3)} | ${newMissingCode.toString().padStart(60)} | ${newMissingDB
                        .toString()
                        .padStart(80)} | ${drawableCode} \r\n`;
                }

                await wait(0);
            }
            SaveResourceFile('soz-core', 'delta' + gender + '.txt', delta, -1);
        }

        console.log('End cloth dela');
    }

    @Command('clothMissing', {
        role: 'admin',
    })
    public async missing(source: number) {
        const items = await this.prismaService.shop_content.findMany({
            where: {
                shop_id: {
                    in: [ClothingShopID.BINCO, ClothingShopID.SUBURBAN, ClothingShopID.PONSONBYS],
                },
            },
        });

        let missing: Record<PlayerPedHash, Record<number, number[]>> = {
            [PlayerPedHash.Female]: {},
            [PlayerPedHash.Male]: {},
        };

        const components = [Component.Legs, Component.Shoes, Component.Tops];

        for (const genderStr of Object.keys(UndershirtTypeForTop)) {
            const gender = parseInt(genderStr);

            for (const comp of components) {
                for (let j = 0; j < VanillaComponentDrawableIndexMaxValue[gender][comp]; j++) {
                    const textures = new Set<number>();
                    for (const item of items) {
                        const shopItemData: ClothingShopItemData = JSON.parse(item.data) as ClothingShopItemData;
                        if (shopItemData.modelHash != gender) {
                            continue;
                        }

                        if (shopItemData.components[comp] && shopItemData.components[comp].Drawable == j) {
                            textures.add(shopItemData.components[comp].Texture);
                        }
                    }

                    if (textures.size == 0) {
                        if (!ExcludedClothes[gender][comp].includes(j)) {
                            missing[gender][comp] ??= [];
                            missing[gender][comp].push(j);
                        }
                    } else {
                        const count = await emitClientRpc(RpcClientEvent.CLOTH_TEXTURE_COUNT, source, gender, comp, j);
                        if (count != textures.size) {
                            console.log(gender, comp, j, count, textures.size);
                        }
                    }

                    await wait(0);
                }
            }
        }

        missing = await emitClientRpc(RpcClientEvent.CLOTH_FILTER_GEN9, source, missing);

        for (const genderStr of Object.keys(missing)) {
            const gender = parseInt(genderStr);
            const data = missing[gender];

            let missingTxt = '';

            for (const [comp, missingsD] of Object.entries(data)) {
                missingTxt += `${comp}:\r\n`;
                for (const m of missingsD) {
                    missingTxt += `${m}\r\n`;
                }
                missingTxt += `\r\n`;
            }

            SaveResourceFile('soz-core', 'missing' + gender + '.txt', missingTxt, -1);
        }

        console.log('End cloth missing');
    }

    @Command('restockShop', {
        role: 'admin',
    })
    public async restockShop(source: number) {
        const data = await this.clothingShopRepository.get();
        for (const cat of Object.values(data.categories)) {
            for (const catGenders of Object.values(cat)) {
                for (const catGender of Object.values(catGenders)) {
                    for (const contents of Object.values(catGender.content)) {
                        for (const content of contents) {
                            content.stock = 33;
                        }
                    }
                }
            }
        }
        this.notifier.notify(source, 'Magasins de vêtements restockés');
    }
}
