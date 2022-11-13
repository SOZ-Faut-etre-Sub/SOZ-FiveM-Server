import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { PrismaService } from '../database/prisma.service';

@Provider()
export class MigrationProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Once(OnceStep.DatabaseConnected)
    async migrate(): Promise<void> {
        const underwearLuxeCount = await this.prismaService.shop_content.count({
            where: {
                shop_id: 1,
                category_id: 32,
                data: {
                    contains: '"modelHash":1885233650',
                },
            },
        });

        console.log(underwearLuxeCount);

        if (underwearLuxeCount >= 13) {
            return;
        }

        await this.prismaService.shop_content.createMany({
            data: [
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_1',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":1}},"label":"#CLO_V2M_L_1_1","modelHash":1885233650}',
                },
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_2',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":2}},"label":"#CLO_V2M_L_1_2","modelHash":1885233650}',
                },
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_3',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":3}},"label":"#CLO_V2M_L_1_3","modelHash":1885233650}',
                },
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_4',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":4}},"label":"#CLO_V2M_L_1_4","modelHash":1885233650}',
                },
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_5',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":5}},"label":"#CLO_V2M_L_1_5","modelHash":1885233650}',
                },
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_6',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":6}},"label":"#CLO_V2M_L_1_6","modelHash":1885233650}',
                },
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_7',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":7}},"label":"#CLO_V2M_L_1_7","modelHash":1885233650}',
                },
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_8',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":8}},"label":"#CLO_V2M_L_1_8","modelHash":1885233650}',
                },
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_9',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":9}},"label":"#CLO_V2M_L_1_9","modelHash":1885233650}',
                },
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_10',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":10}},"label":"#CLO_V2M_L_1_10","modelHash":1885233650}',
                },
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_11',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":11}},"label":"#CLO_V2M_L_1_11","modelHash":1885233650}',
                },
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_12',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":12}},"label":"#CLO_V2M_L_1_12","modelHash":1885233650}',
                },
                {
                    shop_id: 1,
                    category_id: 32,
                    label: '#CLO_V2M_L_1_13',
                    price: 50,
                    data: '{"components":{"4":{"Drawable":61,"Palette":0,"Texture":13}},"label":"#CLO_V2M_L_1_13","modelHash":1885233650}',
                },
            ],
            skipDuplicates: true,
        });
    }
}
