import { JobType } from '../shared/job';
import { BoxZone } from '../shared/polyzone/box.zone';
import { Garage, GarageCategory, GarageType } from '../shared/vehicle/garage';

export const GarageList: Record<string, Garage> = {
    motel: {
        name: 'Motel Parking',
        legacyId: 'motelgarage',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([279.6615905761719, -348.95648193359375, 44.939395904541016], 0.8, 1, {
            heading: 340,
            minZ: 43.939395904541016,
            maxZ: 46.939395904541016,
        }),
        parkingPlaces: [
            new BoxZone([298.83, -333.19, 44.92], 6, 4, {
                heading: 70,
                minZ: 43.92,
                maxZ: 47.92,
            }),
            new BoxZone([295.41, -342.99, 44.92], 6, 4, {
                heading: 70,
                minZ: 43.92,
                maxZ: 47.92,
            }),
            new BoxZone([266.27, -332.19, 44.92], 6, 4, {
                heading: 70,
                minZ: 43.92,
                maxZ: 47.92,
            }),
            new BoxZone([269.85, -322.48, 44.92], 6, 4, {
                heading: 70,
                minZ: 43.92,
                maxZ: 47.92,
            }),
            new BoxZone([282.91, -323.71, 44.92], 6, 4, {
                heading: 70,
                minZ: 43.92,
                maxZ: 47.92,
            }),
            new BoxZone([285.78, -335.88, 44.92], 6, 4, {
                heading: 70,
                minZ: 43.92,
                maxZ: 47.92,
            }),
        ],
    },
    spanish_avenue: {
        name: 'Spanish Avenue Parking',
        legacyId: 'spanishave',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([-1180.13232421875, -724.5946655273438, 20.72418212890625], 0.8, 1, {
            heading: 40,
            minZ: 19.72418212890625,
            maxZ: 22.72418212890625,
        }),
        parkingPlaces: [
            new BoxZone([-1202.06, -729.73, 21.16], 6, 4, {
                heading: 310,
                minZ: 20.16,
                maxZ: 24.16,
            }),
            new BoxZone([-1186.35, -742.68, 20.1], 6, 4, {
                heading: 310,
                minZ: 19.1,
                maxZ: 23.1,
            }),
            new BoxZone([-1141.51, -740.48, 20.11], 6, 4, {
                heading: 290,
                minZ: 19.11,
                maxZ: 23.11,
            }),
            new BoxZone([-1143.48, -748.56, 19.2], 6, 4, {
                heading: 290,
                minZ: 18.2,
                maxZ: 22.2,
            }),
            new BoxZone([-1131.74, -752.44, 19.58], 6, 4, {
                heading: 290,
                minZ: 18.58,
                maxZ: 22.58,
            }),
            new BoxZone([-1131.07, -763.37, 18.57], 6, 4, {
                heading: 290,
                minZ: 17.57,
                maxZ: 21.57,
            }),
        ],
    },
    great_ocean: {
        name: 'Great Ocean Parking',
        legacyId: 'greatoceanp',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([1466.4776611328125, 6547.7509765625, 14.575380325317383], 1, 0.8, {
            heading: 0,
            minZ: 13.575380325317383,
            maxZ: 16.575380325317383,
        }),
        parkingPlaces: [
            new BoxZone([1459.62, 6560.63, 13.42], 6, 4, {
                heading: 275,
                minZ: 11.42,
                maxZ: 16.42,
            }),
            new BoxZone([1458.36, 6571.11, 13.52], 6, 4, {
                heading: 275,
                minZ: 11.52,
                maxZ: 16.52,
            }),
            new BoxZone([1456.24, 6581.96, 12.63], 6, 4, {
                heading: 310,
                minZ: 10.63,
                maxZ: 15.63,
            }),
            new BoxZone([1446.12, 6589.4, 12.73], 6, 4, {
                heading: 350,
                minZ: 10.73,
                maxZ: 15.73,
            }),
            new BoxZone([1382.51, 6587.28, 13.21], 6, 4, {
                heading: 35,
                minZ: 10.21,
                maxZ: 16.21,
            }),
            new BoxZone([1374.48, 6580.13, 13.08], 6, 4, {
                heading: 65,
                minZ: 10.08,
                maxZ: 16.08,
            }),
            new BoxZone([1371.12, 6558.75, 14.47], 6, 4, {
                heading: 275,
                minZ: 11.47,
                maxZ: 17.47,
            }),
            new BoxZone([1415.42, 6593.6, 13.19], 6, 4, {
                heading: 0,
                minZ: 11.19,
                maxZ: 16.19,
            }),
        ],
    },
    sandy_shore: {
        name: 'Sandy Shores Parking',
        legacyId: 'sandyshores',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([1508.1689453125, 3764.2041015625, 33.99585723876953], 0.8, 1, {
            heading: 20,
            minZ: 32.99585723876953,
            maxZ: 35.99585723876953,
        }),
        parkingPlaces: [
            new BoxZone([1542.85, 3780.37, 34.05], 6, 4, {
                heading: 30,
                minZ: 33.05,
                maxZ: 37.05,
            }),
            new BoxZone([1523.44, 3767.25, 34.05], 6, 4, {
                heading: 45,
                minZ: 33.05,
                maxZ: 37.05,
            }),
            new BoxZone([1516.91, 3763.2, 34.05], 6, 4, {
                heading: 15,
                minZ: 33.05,
                maxZ: 37.05,
            }),
            new BoxZone([1497.69, 3760.17, 33.91], 6, 4, {
                heading: 35,
                minZ: 32.91,
                maxZ: 36.91,
            }),
            new BoxZone([1484.04, 3751.61, 33.77], 6, 4, {
                heading: 30,
                minZ: 32.77,
                maxZ: 36.77,
            }),
            new BoxZone([1458.49, 3737.92, 33.52], 6, 4, {
                heading: 30,
                minZ: 32.52,
                maxZ: 36.52,
            }),
            new BoxZone([1446.82, 3732.24, 33.44], 6, 4, {
                heading: 20,
                minZ: 32.44,
                maxZ: 36.44,
            }),
            new BoxZone([1549.85, 3784.22, 34.12], 6, 4, {
                heading: 30,
                minZ: 33.12,
                maxZ: 37.12,
            }),
        ],
    },
    airport_private: {
        name: 'Airport Private Parking',
        legacyId: 'airportprivate',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([-985.0497436523438, -2690.776123046875, 13.830677032470703], 1.2, 1.4, {
            heading: 15,
            minZ: 12.830677032470703,
            maxZ: 15.830677032470703,
        }),
        parkingPlaces: [
            new BoxZone([-989.38, -2706.55, 13.83], 6, 4, {
                heading: 330,
                minZ: 12.83,
                maxZ: 16.83,
            }),
            new BoxZone([-960.53, -2709.54, 13.83], 6, 4, {
                heading: 10,
                minZ: 12.83,
                maxZ: 16.83,
            }),
            new BoxZone([-976.07, -2691.2, 13.85], 6, 4, {
                heading: 330,
                minZ: 12.85,
                maxZ: 16.85,
            }),
            new BoxZone([-970.34, -2694.46, 13.85], 6, 4, {
                heading: 330,
                minZ: 12.85,
                maxZ: 16.85,
            }),
            new BoxZone([-961.64, -2699.48, 13.83], 6, 4, {
                heading: 330,
                minZ: 12.83,
                maxZ: 16.83,
            }),
            new BoxZone([-976.82, -2710.44, 13.87], 6, 4, {
                heading: 350,
                minZ: 12.87,
                maxZ: 16.87,
            }),
        ],
    },
    airport_public_air: {
        name: 'Airport Public Air Parking',
        legacyId: 'airport_air',
        type: GarageType.Public,
        category: GarageCategory.Air,
        zone: new BoxZone([-1160.5179443359375, -2854.087646484375, 13.946089744567871], 1, 0.8, {
            heading: 330,
            minZ: 12.946089744567871,
            maxZ: 15.946089744567871,
        }),
        parkingPlaces: [
            new BoxZone([-1178.3, -2845.74, 13.95], 14.0, 13.8, {
                heading: 330,
                minZ: 12.95,
                maxZ: 23.95,
            }),
            new BoxZone([-1145.94, -2864.44, 13.95], 13.8, 13.8, {
                heading: 330,
                minZ: 12.95,
                maxZ: 23.95,
            }),
            new BoxZone([-1112.61, -2883.89, 13.95], 13.8, 13.8, {
                heading: 330,
                minZ: 12.95,
                maxZ: 23.95,
            }),
        ],
    },
    chumash: {
        name: 'Chumash Parking',
        legacyId: 'chumashp',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([-3132.887451171875, 1105.3194580078125, 20.640737533569336], 1, 0.8, {
            heading: 355,
            minZ: 19.640737533569336,
            maxZ: 22.640737533569336,
        }),
        parkingPlaces: [
            new BoxZone([-3164.37, 1067.13, 20.68], 6, 4, {
                heading: 280,
                minZ: 19.67,
                maxZ: 23.67,
            }),
            new BoxZone([-3139.69, 1078.75, 20.67], 6, 4, {
                heading: 80,
                minZ: 19.67,
                maxZ: 23.67,
            }),
            new BoxZone([-3152.04, 1092.59, 20.7], 6, 4, {
                heading: 280,
                minZ: 19.7,
                maxZ: 23.7,
            }),
            new BoxZone([-3137.17, 1094.5, 20.69], 6, 4, {
                heading: 80,
                minZ: 19.69,
                maxZ: 23.69,
            }),
            new BoxZone([-3141.37, 1117.16, 20.69], 6, 4, {
                heading: 280,
                minZ: 19.69,
                maxZ: 23.69,
            }),
            new BoxZone([-3158.21, 1081.02, 20.69], 6, 4, {
                heading: 280,
                minZ: 19.67,
                maxZ: 23.67,
            }),
        ],
    },
    stadium: {
        name: 'Stadium Parking',
        legacyId: 'stadiump',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([-75.52303314208984, -2006.92431640625, 18.016948699951172], 1.2, 1, {
            heading: 350,
            minZ: 17.016948699951172,
            maxZ: 20.016948699951172,
        }),
        parkingPlaces: [
            new BoxZone([-93.46, -2009.54, 18.02], 6, 4, {
                heading: 355,
                minZ: 17.02,
                maxZ: 21.02,
            }),
            new BoxZone([-97.17, -1986.03, 18.02], 6, 4, {
                heading: 355,
                minZ: 17.02,
                maxZ: 21.02,
            }),
            new BoxZone([-77.06, -2028.21, 18.02], 6, 4, {
                heading: 350,
                minZ: 17.02,
                maxZ: 21.02,
            }),
            new BoxZone([-67.19, -2008.96, 18.02], 6, 4, {
                heading: 20,
                minZ: 17.02,
                maxZ: 21.02,
            }),
            new BoxZone([-50.57, -2001.02, 18.02], 6, 4, {
                heading: 290,
                minZ: 17.02,
                maxZ: 21.02,
            }),
            new BoxZone([-88.86, -2003.37, 18.02], 6, 4, {
                heading: 355,
                minZ: 17.02,
                maxZ: 21.02,
            }),
        ],
    },
    diamond: {
        name: 'Diamond Parking',
        legacyId: 'diamondp',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([889.802490234375, -0.5692340731620789, 78.76500701904297], 0.8, 1, {
            heading: 25,
            minZ: 77.76500701904297,
            maxZ: 80.76500701904297,
        }),
        parkingPlaces: [
            new BoxZone([872.32, 9.04, 78.76], 6, 4, {
                heading: 330,
                minZ: 77.76,
                maxZ: 81.76,
            }),
            new BoxZone([878.32, 5.4, 78.76], 6, 4, {
                heading: 330,
                minZ: 77.76,
                maxZ: 81.76,
            }),
            new BoxZone([879.48, -21.8, 78.76], 6, 4, {
                heading: 60,
                minZ: 77.76,
                maxZ: 81.76,
            }),
            new BoxZone([862.64, -23.5, 78.76], 6, 4, {
                heading: 60,
                minZ: 77.76,
                maxZ: 81.76,
            }),
            new BoxZone([884.68, -53.54, 78.76], 6, 4, {
                heading: 60,
                minZ: 77.76,
                maxZ: 81.76,
            }),
            new BoxZone([906.19, -34.53, 78.76], 6, 4, {
                heading: 55,
                minZ: 77.76,
                maxZ: 81.76,
            }),
            new BoxZone([882.4, -31.85, 78.76], 6, 4, {
                heading: 60,
                minZ: 77.76,
                maxZ: 81.76,
            }),
            new BoxZone([852.19, -25.13, 78.76], 6, 4, {
                heading: 60,
                minZ: 77.76,
                maxZ: 81.76,
            }),
        ],
    },
    laguna: {
        name: 'Laguna Parking',
        legacyId: 'lagunapi',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([363.34515380859375, 296.7437744140625, 103.4406509399414], 1, 0.8, {
            heading: 340,
            minZ: 102.4406509399414,
            maxZ: 105.4406509399414,
        }),
        parkingPlaces: [
            new BoxZone([382.73, 292.21, 103.09], 6, 4, {
                heading: 345,
                minZ: 102.09,
                maxZ: 106.09,
            }),
            new BoxZone([391.74, 280.71, 103.0], 6, 4, {
                heading: 70,
                minZ: 102.0,
                maxZ: 106.0,
            }),
            new BoxZone([374.87, 283.68, 103.19], 6, 4, {
                heading: 340,
                minZ: 102.0,
                maxZ: 106.0,
            }),
            new BoxZone([375.86, 274.4, 103.06], 6, 4, {
                heading: 340,
                minZ: 102.0,
                maxZ: 106.0,
            }),
            new BoxZone([363.89, 270.1, 103.19], 6, 4, {
                heading: 340,
                minZ: 102.0,
                maxZ: 106.0,
            }),
            new BoxZone([358.75, 286.18, 103.37], 6, 4, {
                heading: 70,
                minZ: 102.0,
                maxZ: 106.0,
            }),
        ],
    },
    beach: {
        name: 'Beach Parking',
        legacyId: 'beachp',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([-1176.115478515625, -1503.5909423828125, 4.379672050476074], 0.8, 1, {
            heading: 35,
            minZ: 3.379672050476074,
            maxZ: 6.379672050476074,
        }),
        parkingPlaces: [
            new BoxZone([-1177.07, -1491.71, 4.38], 6, 3, {
                heading: 305,
                minZ: 3.5,
                maxZ: 7.5,
            }),
            new BoxZone([-1196.37, -1497.11, 4.38], 5.8, 3, {
                heading: 305,
                minZ: 3.5,
                maxZ: 7.5,
            }),
            new BoxZone([-1191.87, -1470.34, 4.38], 6, 3, {
                heading: 305,
                minZ: 3.5,
                maxZ: 7.5,
            }),
            new BoxZone([-1182.27, -1483.97, 4.38], 6, 3, {
                heading: 305,
                minZ: 3.5,
                maxZ: 7.5,
            }),
            new BoxZone([-1184.78, -1492.95, 4.38], 6, 3, {
                heading: 305,
                minZ: 3.5,
                maxZ: 7.5,
            }),
            new BoxZone([-1192.01, -1482.64, 4.38], 6, 3, {
                heading: 305,
                minZ: 3.5,
                maxZ: 7.5,
            }),
        ],
    },
    the_motor_hotel: {
        name: 'The Motor Hotel Parking',
        legacyId: 'themotorhotel',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([1134.453857421875, 2664.171142578125, 38.00752639770508], 1, 0.8, {
            heading: 0,
            minZ: 37.00752639770508,
            maxZ: 40.00752639770508,
        }),
        parkingPlaces: [
            new BoxZone([1135.32, 2647.61, 38.0], 6, 4, {
                heading: 0,
                minZ: 37.0,
                maxZ: 41.0,
            }),
            new BoxZone([1127.67, 2647.67, 38.0], 6, 4, {
                heading: 0,
                minZ: 37.0,
                maxZ: 41.0,
            }),
            new BoxZone([1120.49, 2647.63, 38.0], 6, 4, {
                heading: 0,
                minZ: 37.0,
                maxZ: 41.0,
            }),
            new BoxZone([1112.09, 2654.12, 38.0], 6, 4, {
                heading: 90,
                minZ: 37.0,
                maxZ: 41.0,
            }),
            new BoxZone([1105.58, 2663.18, 38.17], 6, 4, {
                heading: 0,
                minZ: 37.0,
                maxZ: 41.0,
            }),
            new BoxZone([1098.11, 2663.28, 38.06], 6, 4, {
                heading: 0,
                minZ: 37.0,
                maxZ: 41.0,
            }),
        ],
    },
    marina_drive: {
        name: 'Marina Drive Parking',
        legacyId: 'marinadrive',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([953.9990234375, 3608.52490234375, 32.83208465576172], 1, 0.8, {
            heading: 0,
            minZ: 31.83208465576172,
            maxZ: 34.83208465576172,
        }),
        parkingPlaces: [
            new BoxZone([951.33, 3622.81, 32.44], 6, 4, {
                heading: 90,
                minZ: 31.44,
                maxZ: 35.44,
            }),
            new BoxZone([951.31, 3619.1, 32.54], 6, 4, {
                heading: 90,
                minZ: 31.5,
                maxZ: 35.5,
            }),
            new BoxZone([951.56, 3615.45, 32.6], 6, 4, {
                heading: 90,
                minZ: 31.6,
                maxZ: 35.6,
            }),
        ],
    },
    shambles: {
        name: 'Shambles Parking',
        legacyId: 'shambles',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([999.439270019531, -2362.814453125, 30.509550094604492], 1, 1, {
            heading: 355,
            minZ: 29.509550094604492,
            maxZ: 32.50955009460449,
        }),
        parkingPlaces: [
            new BoxZone([1002.62, -2319.83, 30.51], 6, 3, {
                heading: 265,
                minZ: 29.51,
                maxZ: 33.51,
            }),
            new BoxZone([1000.92, -2332.31, 30.51], 6, 3, {
                heading: 265,
                minZ: 29.51,
                maxZ: 33.51,
            }),
            new BoxZone([1000.07, -2350.93, 30.51], 5.8, 3, {
                heading: 85,
                minZ: 29.51,
                maxZ: 33.51,
            }),
            new BoxZone([1027.69, -2322.57, 30.51], 6, 3, {
                heading: 265,
                minZ: 29.51,
                maxZ: 33.51,
            }),
            new BoxZone([1025.61, -2347.78, 30.51], 6, 3, {
                heading: 85,
                minZ: 29.51,
                maxZ: 33.51,
            }),
            new BoxZone([1026.17, -2336.52, 30.51], 6, 3, {
                heading: 85,
                minZ: 29.51,
                maxZ: 33.51,
            }),
            new BoxZone([1003.86, -2305.89, 30.51], 6, 3, {
                heading: 265,
                minZ: 29.51,
                maxZ: 33.51,
            }),
            new BoxZone([1028.36, -2312.23, 30.51], 6, 3, {
                heading: 265,
                minZ: 29.51,
                maxZ: 33.51,
            }),
        ],
    },
    pillbox: {
        name: 'Pillbox Garage Parking',
        legacyId: 'pillboxgarage',
        type: GarageType.Private,
        category: GarageCategory.Car,
        zone: new BoxZone([214.87327575683594, -806.9600830078125, 30.8114013671875], 0.8, 1, {
            heading: 340,
            minZ: 29.8114013671875,
            maxZ: 32.8114013671875,
        }),
        parkingPlaces: [
            new BoxZone([209.89, -791.11, 30.88], 6, 3, {
                heading: 250,
                minZ: 29.0,
                maxZ: 33.0,
            }),
            new BoxZone([215.52, -776.01, 30.8], 6, 3, {
                heading: 250,
                minZ: 29.0,
                maxZ: 33.0,
            }),
            new BoxZone([222.04, -786.87, 30.81], 6, 3, {
                heading: 250,
                minZ: 29.0,
                maxZ: 33.0,
            }),
            new BoxZone([217.25, -799.32, 30.84], 6, 3, {
                heading: 70,
                minZ: 29.0,
                maxZ: 33.0,
            }),
            new BoxZone([232.82, -773.78, 30.67], 6, 3, {
                heading: 70,
                minZ: 29.0,
                maxZ: 33.0,
            }),
            new BoxZone([241.46, -782.54, 30.68], 6, 3, {
                heading: 70,
                minZ: 29.0,
                maxZ: 33.0,
            }),
            new BoxZone([241.46, -782.54, 30.68], 6, 3, {
                heading: 70,
                minZ: 29.0,
                maxZ: 33.0,
            }),
            new BoxZone([234.97, -800.2, 30.61], 6, 3, {
                heading: 250,
                minZ: 29.0,
                maxZ: 33.0,
            }),
        ],
    },
    airport_public: {
        name: 'Airport Public Parking',
        legacyId: 'airportpublic',
        type: GarageType.Public,
        category: GarageCategory.Car,
        zone: new BoxZone([-612.579833984375, -2235.7978515625, 6.004300594329834], 0.8, 1, {
            heading: 50,
            minZ: 5.004300594329834,
            maxZ: 8.004300594329834,
        }),
        parkingPlaces: [
            new BoxZone([-604.14, -2220.94, 6.0], 8, 4, {
                heading: 5,
                minZ: 5.0,
                maxZ: 9.0,
            }),
            new BoxZone([-623.71, -2204.67, 6.0], 8, 4, {
                heading: 5,
                minZ: 5.0,
                maxZ: 9.0,
            }),
            new BoxZone([-643.02, -2188.49, 5.99], 8, 4, {
                heading: 5,
                minZ: 4.99,
                maxZ: 8.99,
            }),
            new BoxZone([-649.01, -2173.48, 5.99], 8, 4, {
                heading: 5,
                minZ: 4.99,
                maxZ: 8.99,
            }),
            new BoxZone([-595.38, -2201.37, 5.99], 8, 4, {
                heading: 5,
                minZ: 4.99,
                maxZ: 8.99,
            }),
            new BoxZone([-635.07, -2157.95, 5.99], 8, 4, {
                heading: 5,
                minZ: 4.99,
                maxZ: 8.99,
            }),
            new BoxZone([-593.41, -2167.22, 5.99], 8, 4, {
                heading: 5,
                minZ: 4.99,
                maxZ: 8.99,
            }),
            new BoxZone([-577.67, -2190.13, 5.99], 8, 4, {
                heading: 5,
                minZ: 4.99,
                maxZ: 8.99,
            }),
            new BoxZone([-606.81, -2165.66, 5.99], 8, 4, {
                heading: 5,
                minZ: 4.99,
                maxZ: 8.99,
            }),
            new BoxZone([-619.56, -2180.8, 5.99], 8, 4, {
                heading: 5,
                minZ: 4.99,
                maxZ: 8.99,
            }),
        ],
    },
    bell_farms: {
        name: 'Bell Farms Parking',
        legacyId: 'haanparking',
        type: GarageType.Public,
        category: GarageCategory.Car,
        zone: new BoxZone([88.14032745361328, 6390.654296875, 31.225772857666016], 1, 0.8, {
            heading: 314,
            minZ: 30.225772857666016,
            maxZ: 33.225772857666016,
        }),
        parkingPlaces: [
            new BoxZone([78.24, 6398.73, 31.23], 6, 4, {
                heading: 315,
                minZ: 30.23,
                maxZ: 34.23,
            }),
            new BoxZone([72.49, 6404.33, 31.23], 6, 4, {
                heading: 315,
                minZ: 30.23,
                maxZ: 34.23,
            }),
            new BoxZone([59.16, 6400.94, 31.23], 6, 4, {
                heading: 35,
                minZ: 30.23,
                maxZ: 34.23,
            }),
            new BoxZone([59.16, 6400.94, 31.23], 6, 4, {
                heading: 35,
                minZ: 30.23,
                maxZ: 34.23,
            }),
            new BoxZone([94.84, 6372.93, 31.23], 6, 4, {
                heading: 15,
                minZ: 30.23,
                maxZ: 34.23,
            }),
            new BoxZone([48.64, 6362.48, 31.24], 6, 4, {
                heading: 35,
                minZ: 30.24,
                maxZ: 34.24,
            }),
            new BoxZone([24.84, 6367.01, 31.23], 6, 4, {
                heading: 35,
                minZ: 30.23,
                maxZ: 34.23,
            }),
            new BoxZone([27.97, 6331.08, 31.23], 6, 4, {
                heading: 20,
                minZ: 30.23,
                maxZ: 34.23,
            }),
            new BoxZone([73.78, 6362.8, 31.23], 8, 4, {
                heading: 35,
                minZ: 30.23,
                maxZ: 34.23,
            }),
            new BoxZone([42.51, 6385.19, 31.23], 6, 4, {
                heading: 35,
                minZ: 30.23,
                maxZ: 34.23,
            }),
        ],
    },
    marina_drive_air: {
        name: 'Marina Drive Air Parking',
        legacyId: 'marina_air',
        type: GarageType.Public,
        category: GarageCategory.Air,
        zone: new BoxZone([-727.0758666992188, -1493.579345703125, 5.000543117523193], 1, 0.8, {
            heading: 336,
            minZ: 4.000543117523193,
            maxZ: 7.000543117523193,
        }),
        parkingPlaces: [
            new BoxZone([-724.67, -1444.06, 5.0], 15.2, 15.2, {
                heading: 140,
                minZ: 4.0,
                maxZ: 15.0,
            }),
            new BoxZone([-745.47, -1468.82, 5.0], 15.2, 15.2, {
                heading: 320,
                minZ: 4.0,
                maxZ: 15.0,
            }),
            new BoxZone([-746.75, -1432.73, 5.0], 19.2, 17.6, {
                heading: 230,
                minZ: 4.0,
                maxZ: 15.0,
            }),
            new BoxZone([-763.48, -1453.35, 5.0], 19.2, 17.6, {
                heading: 230,
                minZ: 4.0,
                maxZ: 15.0,
            }),
            new BoxZone([-721.41, -1473.46, 5.0], 19.2, 17.6, {
                heading: 50,
                minZ: 4.0,
                maxZ: 15.0,
            }),
            new BoxZone([-699.93, -1447.88, 5.0], 19.2, 17.6, {
                heading: 50,
                minZ: 4.0,
                maxZ: 15.0,
            }),
        ],
    },
    sandy_shores_air: {
        name: 'Sandy Shores Air Parking',
        legacyId: 'sandy_air',
        type: GarageType.Public,
        category: GarageCategory.Air,
        zone: new BoxZone([1758.961181640625, 3230.338134765625, 42.231048583984375], 0.8, 1, {
            heading: 339,
            minZ: 41.231048583984375,
            maxZ: 44.231048583984375,
        }),
        parkingPlaces: [
            new BoxZone([1770.23, 3239.53, 42.06], 11.6, 12.0, {
                heading: 15,
                minZ: 41.06,
                maxZ: 52.06,
            }),
        ],
    },
    pound: {
        name: 'Fourrière',
        legacyId: 'fourriere',
        type: GarageType.Depot,
        category: GarageCategory.Car,
        zone: new BoxZone([487.822998046875, -1319.3245849609375, 29.242542266845703], 0.6000000000000001, 0.8, {
            heading: 16,
            minZ: 28.242542266845703,
            maxZ: 31.242542266845703,
        }),
        parkingPlaces: [
            new BoxZone([502.05, -1336.41, 29.33], 6, 4, {
                heading: 0,
                minZ: 28.33,
                maxZ: 32.33,
            }),
            new BoxZone([497.44, -1336.5, 29.34], 6, 4, {
                heading: 0,
                minZ: 28.34,
                maxZ: 32.34,
            }),
            new BoxZone([481.31, -1334.2, 29.33], 6, 4, {
                heading: 230,
                minZ: 28.33,
                maxZ: 32.33,
            }),
            new BoxZone([488.13, -1366.4, 29.25], 6, 4, {
                heading: 180,
                minZ: 28.25,
                maxZ: 32.25,
            }),
        ],
    },
    lspd: {
        name: 'LSPD Parking',
        type: GarageType.Job,
        job: JobType.LSPD,
        category: GarageCategory.Car,
        zone: new BoxZone([598.88, 5.57, 69.61], 1.0, 1.0, {
            heading: 341.51,
            minZ: 68.61,
            maxZ: 72.61,
        }),
        parkingPlaces: [
            new BoxZone([594.66, 3.26, 70.63], 6.8, 4.0, {
                heading: 350,
                minZ: 69.63,
                maxZ: 73.2,
            }),
            new BoxZone([590.52, 3.89, 70.63], 6.8, 4.0, {
                heading: 350,
                minZ: 69.63,
                maxZ: 73.2,
            }),
            new BoxZone([592.1, -11.17, 70.63], 6.2, 4.0, {
                heading: 350,
                minZ: 69.63,
                maxZ: 73.2,
            }),
            new BoxZone([588.03, -10.44, 70.63], 6.2, 4.0, {
                heading: 350,
                minZ: 69.63,
                maxZ: 73.2,
            }),
            new BoxZone([590.84, -18.21, 70.63], 6.2, 4.0, {
                heading: 350,
                minZ: 69.63,
                maxZ: 73.2,
            }),
            new BoxZone([586.73, -17.49, 70.63], 6.2, 4.0, {
                heading: 350,
                minZ: 69.63,
                maxZ: 73.2,
            }),
            new BoxZone([588.97, -31.28, 70.63], 6.2, 4.0, {
                heading: 350,
                minZ: 69.63,
                maxZ: 73.2,
            }),
            new BoxZone([584.88, -30.67, 70.63], 6.2, 4.0, {
                heading: 350,
                minZ: 69.63,
                maxZ: 73.2,
            }),
        ],
    },
    lspd_air: {
        name: 'LSPD Air Parking',
        type: GarageType.Job,
        job: JobType.LSPD,
        category: GarageCategory.Air,
        zone: new BoxZone([585.1, 2.81, 102.23], 1.0, 1.0, {
            heading: 211.84,
            minZ: 101.23,
            maxZ: 104.23,
        }),
        parkingPlaces: [
            new BoxZone([579.96, 12.19, 103.23], 11.0, 10.6, {
                heading: 0,
                minZ: 102.23,
                maxZ: 106.23,
            }),
        ],
    },
    lsmc: {
        name: 'LSMC Parking',
        type: GarageType.Job,
        job: JobType.LSMC,
        category: GarageCategory.Car,
        zone: new BoxZone([412.22, -1416.05, 28.38], 1.0, 1.0, {
            heading: 323.72,
            minZ: 27.38,
            maxZ: 30.38,
        }),
        parkingPlaces: [
            new BoxZone([404.68, -1438.12, 29.43], 9.2, 3.4, { heading: 30, minZ: 28.33, maxZ: 32.53 }),
            new BoxZone([408.44, -1435.93, 29.44], 9.2, 3.4, { heading: 30, minZ: 28.21, maxZ: 32.53 }),
            new BoxZone([412.23, -1433.73, 29.44], 9.2, 3.4, { heading: 30, minZ: 28.21, maxZ: 32.53 }),
            new BoxZone([415.73, -1431.74, 29.44], 9.2, 3.4, { heading: 30, minZ: 28.21, maxZ: 32.53 }),
            new BoxZone([399.06, -1429.48, 29.44], 9.2, 3.4, { heading: 50, minZ: 28.21, maxZ: 32.53 }),
            new BoxZone([401.59, -1426.42, 29.44], 9.2, 3.4, { heading: 50, minZ: 28.21, maxZ: 32.53 }),
            new BoxZone([404.3, -1423.21, 29.44], 9.2, 3.4, { heading: 50, minZ: 28.21, maxZ: 32.53 }),
        ],
    },
    lsmc_air: {
        name: 'LSMC Air Parking',
        type: GarageType.Job,
        job: JobType.LSMC,
        category: GarageCategory.Air,
        zone: new BoxZone([311.98, -1451.68, 45.51], 1.0, 1.0, {
            heading: 319.69,
            minZ: 44.51,
            maxZ: 48.51,
        }),
        parkingPlaces: [
            new BoxZone([313.29, -1464.94, 46.51], 10.8, 10.8, {
                heading: 320,
                minZ: 45.51,
                maxZ: 49.51,
            }),
            new BoxZone([299.61, -1453.48, 46.51], 10.8, 10.4, {
                heading: 50,
                minZ: 45.51,
                maxZ: 49.51,
            }),
        ],
    },
    bcso: {
        name: 'BCSO Parking',
        type: GarageType.Job,
        job: JobType.BCSO,
        category: GarageCategory.Car,
        zone: new BoxZone([1861.0, 3683.01, 32.83], 1.0, 1.0, {
            heading: 30.94,
            minZ: 31.83,
            maxZ: 34.83,
        }),
        parkingPlaces: [
            new BoxZone([1866.81, 3681.9, 33.7], 6.0, 2.4, {
                heading: 300,
                minZ: 32.23,
                maxZ: 36.23,
            }),
        ],
    },
    bcso_air: {
        name: 'BCSO Air Parking',
        type: GarageType.Job,
        job: JobType.BCSO,
        category: GarageCategory.Air,
        zone: new BoxZone([1814.08, 3724.05, 32.67], 1.0, 1.0, {
            heading: 26.91,
            minZ: 31.67,
            maxZ: 34.67,
        }),
        parkingPlaces: [
            new BoxZone([1802.57, 3719.3, 35.65], 10.6, 10.6, {
                heading: 0,
                minZ: 34.65,
                maxZ: 38.65,
            }),
        ],
    },
    bennys: {
        name: 'Bennys Parking',
        type: GarageType.Job,
        job: JobType.Bennys,
        category: GarageCategory.Car,
        zone: new BoxZone([-172.5, -1295.65, 30.13], 1.0, 1.0, {
            heading: 0.0,
            minZ: 29.13,
            maxZ: 32.13,
        }),
        parkingPlaces: [
            new BoxZone([-163.52, -1299.59, 31.22], 12, 4, {
                heading: 90,
                minZ: 30.22,
                maxZ: 34.22,
            }),
            new BoxZone([-163.44, -1305.2, 31.3], 12, 4, {
                heading: 90,
                minZ: 30.3,
                maxZ: 34.3,
            }),
        ],
    },
    bennys_luxury: {
        name: 'Bennys - Concessionnaire',
        type: GarageType.JobLuxury,
        job: JobType.Bennys,
        category: GarageCategory.Car,
        zone: new BoxZone([-178.45, -1312.36, 30.3], 1.0, 1.0, {
            heading: 271.79,
            minZ: 29.3,
            maxZ: 32.3,
        }),
        parkingPlaces: [
            new BoxZone([-182.37, -1316.29, 31.3], 8.0, 3.8, {
                heading: 0,
                minZ: 30.3,
                maxZ: 33.3,
            }),
        ],
    },
    bennys_air: {
        name: 'Bennys Air Parking',
        type: GarageType.Job,
        job: JobType.Bennys,
        category: GarageCategory.Air,
        zone: new BoxZone([-147.64, -1282.43, 46.9], 1.0, 1.0, {
            heading: 356.22,
            minZ: 45.9,
            maxZ: 48.9,
        }),
        parkingPlaces: [
            new BoxZone([-145.89, -1272.41, 49.57], 14.8, 14.4, {
                heading: 0,
                minZ: 48.57,
                maxZ: 54.57,
            }),
        ],
    },
    stonk: {
        name: 'STONK Parking',
        type: GarageType.Job,
        job: JobType.CashTransfer,
        category: GarageCategory.Car,
        zone: new BoxZone([-6.51, -662.66, 32.48], 1.0, 1.0, {
            heading: 185,
            minZ: 31.48,
            maxZ: 34.48,
        }),
        parkingPlaces: [
            new BoxZone([-4.85, -670.38, 31.94], 12, 6, {
                heading: 186.13,
                minZ: 30.94,
                maxZ: 34.94,
            }),
            new BoxZone([3.07, -670.67, 31.94], 12, 6, {
                heading: 186.13,
                minZ: 30.94,
                maxZ: 34.94,
            }),
            new BoxZone([-19.4, -671.67, 31.94], 12, 6, {
                heading: 184.81,
                minZ: 30.94,
                maxZ: 34.94,
            }),
        ],
    },
    garbage: {
        name: 'Bluebird Parking',
        type: GarageType.Job,
        job: JobType.Garbage,
        category: GarageCategory.Car,
        zone: new BoxZone([-589.74, -1568.28, 25.75], 1.0, 1.0, {
            heading: 318.84,
            minZ: 24.75,
            maxZ: 27.75,
        }),
        parkingPlaces: [
            new BoxZone([-594.71, -1574.21, 26.75], 12.0, 5.0, {
                heading: 355,
                minZ: 25.75,
                maxZ: 29.75,
            }),
            new BoxZone([-600.98, -1574.03, 26.75], 12.0, 5.0, {
                heading: 355,
                minZ: 25.75,
                maxZ: 29.75,
            }),
        ],
    },
    food: {
        name: 'Chateau Marius Parking',
        type: GarageType.Job,
        job: JobType.Food,
        category: GarageCategory.Car,
        zone: new BoxZone([-1923.05, 2060.66, 139.83], 1.0, 1.0, {
            heading: 77,
            minZ: 138.83,
            maxZ: 142.83,
        }),
        parkingPlaces: [
            new BoxZone([-1920.27, 2048.6, 140.64], 8, 4, {
                heading: 257.89,
                minZ: 139.64,
                maxZ: 143.64,
            }),
            new BoxZone([-1919.23, 2052.68, 140.64], 8, 4, {
                heading: 257.89,
                minZ: 139.64,
                maxZ: 143.64,
            }),
            new BoxZone([-1923.05, 2036.34, 140.64], 8, 4, {
                heading: 257.89,
                minZ: 139.64,
                maxZ: 143.64,
            }),
        ],
    },
    news: {
        name: 'Twitch News Parking',
        type: GarageType.Job,
        job: JobType.News,
        category: GarageCategory.Car,
        zone: new BoxZone([-539.4, -877.38, 24.24], 1.0, 1.0, {
            heading: 353.76,
            minZ: 23.24,
            maxZ: 26.24,
        }),
        parkingPlaces: [
            new BoxZone([-532.88, -881.37, 25.31], 8.4, 4.2, { heading: 0, minZ: 24.29, maxZ: 27.29 }),
            new BoxZone([-543.81, -881.39, 25.24], 8.2, 4.0, { heading: 0, minZ: 24.29, maxZ: 27.29 }),
        ],
    },
    news_air: {
        name: 'Twitch News Air Parking',
        type: GarageType.Job,
        job: JobType.News,
        category: GarageCategory.Air,
        zone: new BoxZone([-592.72, -928.48, 35.83], 1.0, 1.0, {
            heading: 93.08,
            minZ: 34.83,
            maxZ: 38.83,
        }),
        parkingPlaces: [
            new BoxZone([-583.27, -930.71, 36.83], 10.2, 10, {
                heading: 0,
                minZ: 35.83,
                maxZ: 39.83,
            }),
        ],
    },
    mtp: {
        name: 'Michel Transport Petrol Parking',
        type: GarageType.Job,
        job: JobType.Oil,
        category: GarageCategory.Car,
        zone: new BoxZone([-276.89, 6017.69, 31.02], 1.0, 1.0, {
            heading: 226.23,
            minZ: 30.02,
            maxZ: 34.02,
        }),
        parkingPlaces: [
            new BoxZone([-285.17, 6018.65, 31.47], 18.0, 6.6, {
                heading: 315,
                minZ: 30.47,
                maxZ: 33.47,
            }),
            new BoxZone([-289.91, 6024.54, 31.47], 18.0, 6.6, {
                heading: 315,
                minZ: 30.47,
                maxZ: 33.47,
            }),
        ],
    },
    taxi: {
        name: 'Carl Jr Services Parking',
        type: GarageType.Job,
        job: JobType.Taxi,
        category: GarageCategory.Car,
        zone: new BoxZone([904.43, -168.09, 73.09], 1.0, 1.0, {
            heading: 61.18,
            minZ: 72.09,
            maxZ: 74.09,
        }),
        parkingPlaces: [
            new BoxZone([911.33, -162.69, 74.13], 6.2, 3.2, { heading: 15, minZ: 72.69, maxZ: 76.53 }),
            new BoxZone([913.54, -159.2, 74.69], 6.6, 3.2, { heading: 15, minZ: 73.69, maxZ: 77.69 }),
            new BoxZone([919.02, -167.06, 74.33], 3.0, 7.2, { heading: 10, minZ: 73.33, maxZ: 77.33 }),
            new BoxZone([916.75, -170.56, 74.23], 3.2, 7.0, { heading: 10, minZ: 73.03, maxZ: 77.03 }),
        ],
    },
    taxi_air: {
        name: 'Carl Jr Services Air Parking',
        type: GarageType.Job,
        job: JobType.Taxi,
        category: GarageCategory.Air,
        zone: new BoxZone([879.44, -151.68, 77.33], 1.0, 1.0, {
            heading: 90.27,
            minZ: 76.33,
            maxZ: 79.33,
        }),
        parkingPlaces: [
            new BoxZone([872.11, -144.57, 79.69], 13.6, 13.8, {
                heading: 329,
                minZ: 77.966094970704,
                maxZ: 89.69627380371,
            }),
        ],
    },
    pawl: {
        name: 'Pipe and Wooden Legs Parking',
        type: GarageType.Job,
        job: JobType.Pawl,
        category: GarageCategory.Car,
        zone: new BoxZone([-605.01, 5289.27, 69.46], 1.0, 1.0, {
            heading: 136.16,
            minZ: 68.46,
            maxZ: 72.46,
        }),
        parkingPlaces: [
            new BoxZone([-598.99, 5295.01, 70.21], 17.2, 5.0, {
                heading: 277,
                minZ: 69.19,
                maxZ: 72.19,
            }),
            new BoxZone([-599.52, 5300.08, 70.21], 17.2, 5.0, {
                heading: 276,
                minZ: 69.19,
                maxZ: 72.19,
            }),
            new BoxZone([-600.02, 5305.58, 70.21], 17.2, 5.0, {
                heading: 274,
                minZ: 69.19,
                maxZ: 72.19,
            }),
        ],
    },
    upw: {
        name: 'Unexpected Power and Water Parking',
        type: GarageType.Job,
        job: JobType.Upw,
        category: GarageCategory.Car,
        zone: new BoxZone([585.89, 2835.33, 41.16], 1.0, 1.0, {
            heading: 3.67,
            minZ: 40.16,
            maxZ: 44.16,
        }),
        parkingPlaces: [
            new BoxZone([580.15, 2827.72, 42.05], 12.2, 4, {
                heading: 274,
                minZ: 41.22,
                maxZ: 45.22,
            }),
            new BoxZone([566.95, 2827.27, 42.19], 12.2, 4, {
                heading: 274,
                minZ: 41.19,
                maxZ: 45.19,
            }),
            new BoxZone([552.81, 2825.97, 42.08], 12.2, 4, {
                heading: 274,
                minZ: 41,
                maxZ: 45,
            }),
            new BoxZone([581.35, 2818.73, 42.13], 12.2, 4, {
                heading: 274,
                minZ: 41,
                maxZ: 45,
            }),
            new BoxZone([567.37, 2817.81, 42.15], 12.2, 4, {
                heading: 274,
                minZ: 41,
                maxZ: 45,
            }),
            new BoxZone([553.78, 2816.89, 42.33], 12.2, 4, {
                heading: 274,
                minZ: 41,
                maxZ: 45,
            }),
            new BoxZone([581.66, 2812.22, 42.23], 12.2, 4, {
                heading: 274,
                minZ: 41,
                maxZ: 45,
            }),
            new BoxZone([568.21, 2811.46, 42.04], 12.2, 4, {
                heading: 274,
                minZ: 41,
                maxZ: 45,
            }),
            new BoxZone([554.1, 2810.54, 42.33], 12.2, 4, {
                heading: 274,
                minZ: 41,
                maxZ: 45,
            }),
            new BoxZone([581.39, 2802.48, 42.12], 12.2, 4, {
                heading: 274,
                minZ: 41,
                maxZ: 45,
            }),
            new BoxZone([567.78, 2801.79, 42.26], 12.2, 4, {
                heading: 274,
                minZ: 41,
                maxZ: 45,
            }),
            new BoxZone([553.79, 2800.9, 42.31], 12.2, 4, {
                heading: 274,
                minZ: 41,
                maxZ: 45,
            }),
        ],
    },
    baun_bahama: {
        name: 'Bahama Mamas Parking',
        type: GarageType.Job,
        job: JobType.Baun,
        category: GarageCategory.Car,
        zone: new BoxZone([-1391.21, -643.47, 27.67], 1.0, 1.0, {
            heading: 295.25,
            minZ: 26.67,
            maxZ: 29.67,
        }),
        parkingPlaces: [
            new BoxZone([-1395.8, -654.34, 28.67], 6.0, 3.2, {
                heading: 37,
                minZ: 27.67,
                maxZ: 31.67,
                data: {
                    capacity: [1, 2],
                },
            }),
            new BoxZone([-1392.93, -652.27, 28.67], 6.0, 3.2, {
                heading: 37,
                minZ: 27.67,
                maxZ: 31.67,
                data: {
                    capacity: [1, 2],
                },
            }),
            new BoxZone([-1400.93, -641.8, 28.67], 11.4, 5.2, {
                heading: 85,
                minZ: 27.67,
                maxZ: 31.67,
                data: {
                    capacity: [3],
                },
            }),
        ],
    },
    baun_unicorn: {
        name: 'Unicorn Parking',
        type: GarageType.Job,
        job: JobType.Baun,
        category: GarageCategory.Car,
        zone: new BoxZone([148.33, -1289.93, 28.18], 1.0, 1.0, {
            heading: 120,
            minZ: 27.18,
            maxZ: 31.18,
        }),
        parkingPlaces: [
            new BoxZone([145.19, -1287.47, 29.07], 5.0, 2.8, {
                heading: 299,
                minZ: 28.07,
                maxZ: 31.17,
                data: {
                    capacity: [1, 2],
                },
            }),
            new BoxZone([143.62, -1285.15, 29.13], 5, 2.8, {
                heading: 299,
                minZ: 28.07,
                maxZ: 31.17,
                data: {
                    capacity: [1, 2],
                },
            }),
            new BoxZone([142.29, -1282.61, 29.29], 5, 2.8, {
                heading: 300,
                minZ: 28.17,
                maxZ: 31.17,
                data: {
                    capacity: [1, 2],
                },
            }),
            new BoxZone([140.94, -1280.0, 29.33], 5, 2.8, {
                heading: 300,
                minZ: 28.17,
                maxZ: 31.17,
                data: {
                    capacity: [1, 2],
                },
            }),
            new BoxZone([138.2, -1275.29, 29.21], 5, 2.8, {
                heading: 302,
                minZ: 28.17,
                maxZ: 31.17,
                data: {
                    capacity: [1, 2],
                },
            }),
            new BoxZone([147.05, -1279.35, 29.15], 8.8, 4.4, {
                heading: 29,
                minZ: 28.15,
                maxZ: 31.15,
                data: {
                    capacity: [3],
                },
            }),
        ],
    },
    fbi: {
        name: 'FBI Parking',
        type: GarageType.Job,
        job: JobType.FBI,
        category: GarageCategory.Car,
        zone: new BoxZone([158.72, -706.1, 32.13], 1.0, 1.0, {
            heading: 160.37,
            minZ: 31.13,
            maxZ: 34.13,
        }),
        parkingPlaces: [
            new BoxZone([174.53, -709.93, 33.13], 5.8, 3.4, {
                heading: 70,
                minZ: 32.13,
                maxZ: 35.13,
                data: {
                    capacity: [2],
                },
            }),
            new BoxZone([175.7, -706.48, 33.13], 5.8, 3.4, {
                heading: 70,
                minZ: 32.13,
                maxZ: 35.13,
                data: {
                    capacity: [2],
                },
            }),
            new BoxZone([178.53, -698.87, 33.13], 5.8, 3.4, {
                heading: 70,
                minZ: 32.13,
                maxZ: 35.13,
                data: {
                    capacity: [2],
                },
            }),
            new BoxZone([179.84, -695.21, 33.13], 5.8, 3.4, {
                heading: 70,
                minZ: 32.13,
                maxZ: 35.13,
                data: {
                    capacity: [2],
                },
            }),
            new BoxZone([163.5, -683.73, 33.13], 5.8, 3.4, {
                heading: 340,
                minZ: 32.13,
                maxZ: 35.13,
                data: {
                    capacity: [2],
                },
            }),
            new BoxZone([148.28, -687.68, 33.13], 5.8, 3.4, {
                heading: 70,
                minZ: 32.13,
                maxZ: 35.13,
                data: {
                    capacity: [2],
                },
            }),
        ],
    },
    ffs: {
        name: 'Fight for Style Parking',
        type: GarageType.Job,
        job: JobType.Ffs,
        category: GarageCategory.Car,
        zone: new BoxZone([750.75, -974.89, 23.83], 1.0, 1.0, {
            heading: 90,
            minZ: 22.83,
            maxZ: 26.83,
        }),
        parkingPlaces: [
            new BoxZone([745.0, -966.3, 24.87], 10.0, 5.2, {
                heading: 270,
                minZ: 23.87,
                maxZ: 27.87,
            }),
            new BoxZone([744.95, -960.56, 24.86], 10.0, 5.2, {
                heading: 270,
                minZ: 23.86,
                maxZ: 27.86,
            }),
        ],
    },
    marina_boat: {
        name: 'Port de la Marina',
        type: GarageType.Public,
        category: GarageCategory.Sea,
        zone: new BoxZone([-916.48, -1386.73, 5.19], 4.0, 2.8, {
            heading: 340,
            minZ: 43.92008972167969,
            maxZ: 46.92008972167969,
        }),
        parkingPlaces: [
            new BoxZone([-921.16, -1373.03, 1.6], 15, 7.2, {
                heading: 20,
                minZ: 0.0,
                maxZ: 7.6,
            }),
            new BoxZone([-929.64, -1376.04, 1.6], 15, 7.2, {
                heading: 20,
                minZ: 0.0,
                maxZ: 7.6,
            }),
            new BoxZone([-929.64, -1376.04, 1.6], 15, 7.2, {
                heading: 20,
                minZ: 0.0,
                maxZ: 7.6,
            }),
        ],
    },
    paleto_boat: {
        name: 'Port de Paleto',
        type: GarageType.Public,
        category: GarageCategory.Sea,
        zone: new BoxZone([-277.46, 6637.2, 7.48], 4.0, 2.8, {
            heading: 340,
            minZ: 43.92008972167969,
            maxZ: 46.92008972167969,
        }),
        parkingPlaces: [],
    },
    millars_boat: {
        name: 'Port Millars',
        type: GarageType.Public,
        category: GarageCategory.Sea,
        zone: new BoxZone([1299.24, 4216.69, 33.9], 4.0, 2.8, {
            heading: 340,
            minZ: 43.92008972167969,
            maxZ: 46.92008972167969,
        }),
        parkingPlaces: [],
    },
    catfish_boat: {
        name: 'Port Catfish',
        type: GarageType.Public,
        category: GarageCategory.Sea,
        zone: new BoxZone([3865.66, 4463.73, 2.72], 4.0, 2.8, {
            heading: 340,
            minZ: 43.92008972167969,
            maxZ: 46.92008972167969,
        }),
        parkingPlaces: [],
    },
    sea_pound: {
        name: 'Fourrière Maritime',
        type: GarageType.Depot,
        category: GarageCategory.Sea,
        zone: new BoxZone([-772.98, -1430.76, 1.59], 4.0, 2.8, {
            heading: 340,
            minZ: 43.92008972167969,
            maxZ: 46.92008972167969,
        }),
        parkingPlaces: [],
    },
};
