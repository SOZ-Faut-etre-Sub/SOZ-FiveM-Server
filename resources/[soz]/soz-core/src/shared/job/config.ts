import { Job, JobPermission, JobPermissionData, JobType } from '../job';

const BasePermissions: Partial<Record<JobPermission, JobPermissionData>> = {
    [JobPermission.Enrollment]: { label: 'Gestion des recrutements' },
    [JobPermission.ManageGrade]: { label: 'Gestion des grades' },
    [JobPermission.SocietyBankAccount]: { label: 'Accès au compte société' },
    [JobPermission.SocietyBankInvoices]: { label: 'Accès aux outils de facturation société' },
    [JobPermission.SocietyPrivateStorage]: { label: 'Accès aux stockages société privés' },
    [JobPermission.SocietyMoneyStorage]: { label: 'Accès au coffre-fort de société' },
    [JobPermission.SocietyDealershipVehicle]: { label: 'Accès aux concessionnaires de véhicules' },
    [JobPermission.SocietyTakeOutPound]: { label: 'Sortir les véhicules de la fourrière' },
    [JobPermission.SocietyPublicGarage]: {
        label: 'Ranger/sortir les véhicules des garages publics',
    },
    [JobPermission.SocietyPrivateGarage]: {
        label: 'Ranger/sortir les véhicules des garages privés',
    },
    [JobPermission.SocietyPublicPort]: { label: 'Ranger/sortir les véhicules des ports publics' },
    [JobPermission.SocietyPrivatePort]: { label: 'Ranger/sortir les véhicules des ports privés' },
    [JobPermission.SocietyViewCompanyPanel]: { label: 'Accès au panel entreprise' },
    [JobPermission.SocietyShop]: { label: 'Accès aux magasins de société' },
    [JobPermission.OnDutyView]: { label: 'Voir les employé(e)s en service' },
};

export const JobRegistry: Record<JobType, Omit<Job, 'id'>> = {
    [JobType.Unemployed]: {
        label: 'Sans emploi',
        permissions: {},
        canReceiveSocietyInvoice: false,
    },
    [JobType.Adsl]: {
        label: 'ADSL',
        platePrefix: 'ADSL',
        permissions: {},
        canReceiveSocietyInvoice: false,
    },
    [JobType.Delivery]: {
        label: 'Fougère Prime',
        platePrefix: 'FOUG',
        permissions: {},
        canReceiveSocietyInvoice: false,
    },
    [JobType.Religious]: {
        label: 'InfoChat',
        platePrefix: 'INFO',
        permissions: {},
        canReceiveSocietyInvoice: false,
    },
    [JobType.Scrapper]: {
        label: 'OldMetal',
        platePrefix: 'OMC',
        permissions: {},
        canReceiveSocietyInvoice: false,
    },
    [JobType.FBI]: {
        label: 'Federal Bureau of Investigation',
        platePrefix: 'FBI ',
        menuCallback: 'soz-jobs:client:police:OpenSocietyMenu',
        permissions: {
            [JobPermission.SocietyDealershipVehicle]: { label: 'Accès aux concessionnaires de véhicules' },
        },
        phone: '555-FBI',
        canReceiveSocietyInvoice: true,
    },
    [JobType.LSPD]: {
        label: 'Los Santos Police Department',
        platePrefix: 'LSPD',
        menuCallback: 'soz-jobs:client:police:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
            [JobPermission.CriminalRecord]: { label: 'Accès aux casiers judiciaires' },
            [JobPermission.VehicleRegistrar]: { label: 'Accès au registre des véhicules' },
            [JobPermission.Investigation]: { label: 'Accès aux enquêtes' },
            [JobPermission.ManageInvestigation]: { label: 'Gérer les enquêtes' },
            [JobPermission.AssignCertification]: { label: 'Assigner des certifications aux agents' },
            [JobPermission.ManageCertification]: { label: 'Gérer les certifications' },
            [JobPermission.ManageRoster]: { label: 'Gérer les photos/matricules dans les effectifs panel' },
            [JobPermission.FDOFedPound]: { label: 'Mise en fourrière fédérale' },
        },
        bossZones: [
            {
                center: [626.23, -24.0, 90.51],
                length: 16.2,
                width: 16.4,
                heading: 340,
                minZ: 89.51,
                maxZ: 92.51,
            },
        ],
        phone: '555-LSPD',
        canReceiveSocietyInvoice: true,
    },
    [JobType.BCSO]: {
        label: 'Blaine County Sheriff Office',
        platePrefix: 'BCSO',
        menuCallback: 'soz-jobs:client:police:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
            [JobPermission.CriminalRecord]: { label: 'Accès aux casiers judiciaires' },
            [JobPermission.VehicleRegistrar]: { label: 'Accès au registre des véhicules' },
            [JobPermission.Investigation]: { label: 'Accès aux enquêtes' },
            [JobPermission.ManageInvestigation]: { label: 'Gérer les enquêtes' },
            [JobPermission.AssignCertification]: { label: 'Assigner des certifications aux agents' },
            [JobPermission.ManageCertification]: { label: 'Gérer les certifications' },
            [JobPermission.ManageRoster]: { label: 'Gérer les photos/matricules dans les effectifs panel' },
            [JobPermission.FDOFedPound]: { label: 'Mise en fourrière fédérale' },
        },
        bossZones: [
            {
                center: [1855.38, 3689.22, 38.07],
                length: 3.8,
                width: 6.8,
                heading: 30,
                minZ: 37.07,
                maxZ: 41.01,
            },
        ],
        phone: '555-BCSO',
        canReceiveSocietyInvoice: true,
    },
    [JobType.LSMC]: {
        label: 'Los Santos Medical Center',
        platePrefix: 'LSMC',
        menuCallback: 'soz-jobs:client:lsmc:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
        },
        bossZones: [
            {
                center: [311.74, -1419.73, 32.51],
                length: 8.6,
                width: 6.6,
                heading: 320,
                minZ: 31.51,
                maxZ: 34.51,
            },
        ],
        phone: '555-LSMC',
        canReceiveSocietyInvoice: true,
    },
    [JobType.Taxi]: {
        label: 'Carl Jr Services',
        platePrefix: 'CARL',
        menuCallback: 'soz-jobs:client:taxi:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
        },
        bossZones: [
            {
                center: [907.35, -152.04, 74.17],
                length: 8.4,
                width: 4.2,
                heading: 58,
                minZ: 73.17,
                maxZ: 77.17,
            },
        ],
        phone: '555-CARLJR',
        canReceiveSocietyInvoice: true,
    },
    [JobType.Food]: {
        label: 'Château Marius',
        platePrefix: 'CHAT',
        menuCallback: 'jobs:client:food:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
            [JobPermission.Food_Harvest]: { label: 'Récolter des ingrédients' },
            [JobPermission.Food_Craft]: { label: 'Cuisiner' },
        },
        resell: {
            coords: [-57.01, -2448.4, 7.24, 145.77],
            ZoneName: 'Resell:LSPort:Food',
            SourceAccount: 'farm_food',
            TargetAccount: 'safe_food',
        },
        bossZones: [
            {
                center: [-1872.41, 2060.3, 141.0],
                length: 5.0,
                width: 15.2,
                heading: 340,
                minZ: 140.0,
                maxZ: 144.0,
                debugPoly: false,
            },
        ],
        phone: '555-MARIUS',
        canReceiveSocietyInvoice: true,
    },
    [JobType.News]: {
        label: 'Twitch News',
        platePrefix: 'NEWS',
        menuCallback: 'soz-jobs:client:twitch-news:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
            [JobPermission.NewsManageArticle]: { label: 'Gérer les articles sur le panel' },
            [JobPermission.NewsManageBillboards]: { label: 'Gérer les panneaux sur le panel' },
        },
        bossZones: [
            {
                center: [-576.17, -937.34, 28.82],
                length: 5.8,
                width: 10.8,
                heading: 0,
                minZ: 27.82,
                maxZ: 31.82,
            },
        ],
        phone: '555-NEWS',
        canReceiveSocietyInvoice: true,
    },
    [JobType.YouNews]: {
        label: 'You News',
        platePrefix: 'YOUN',
        menuCallback: 'soz-jobs:client:you-news:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
            [JobPermission.NewsManageArticle]: { label: 'Gérer les articles sur le panel' },
            [JobPermission.NewsManageBillboards]: { label: 'Gérer les panneaux sur le panel' },
        },
        bossZones: [
            { center: [-1054.43, -232.09, 44.02], length: 6.2, width: 5.8, heading: 116.65, minZ: 43.02, maxZ: 45.02 },
        ],
        phone: '555-YOUN',
        canReceiveSocietyInvoice: true,
    },
    [JobType.Garbage]: {
        label: 'BlueBird',
        platePrefix: 'BLUE',
        menuCallback: 'jobs:client:garbage:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
        },
        bossZones: [
            {
                center: [-620.23, -1620.86, 33.01],
                length: 8.0,
                width: 11.8,
                heading: 355,
                minZ: 32.01,
                maxZ: 36.01,
                debugPoly: false,
            },
        ],
        phone: '555-BLUEBIRD',
        canReceiveSocietyInvoice: true,
    },
    [JobType.Oil]: {
        label: 'Michel Transport Petrol',
        platePrefix: 'MITP',
        menuCallback: 'jobs:client:fueler:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
            [JobPermission.FuelerChangePrice]: { label: 'Changer le prix des stations publiques' },
        },
        bossZones: [
            {
                center: [-242.74, 6070.52, 40.61],
                length: 13.4,
                width: 4.6,
                heading: 315,
                minZ: 39.61,
                maxZ: 42.61,
                debugPoly: false,
            },
        ],
        phone: '555-MTP',
        canReceiveSocietyInvoice: true,
    },
    [JobType.CashTransfer]: {
        label: 'STONK Security',
        platePrefix: 'STNK',
        menuCallback: 'stonk:client:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
            [JobPermission.CashTransfer_CollectSecure]: { label: 'Collecte des containers sécurisés' },
            [JobPermission.CashTransfer_CollectBags]: { label: "Collecte sacs d'argent" },
            [JobPermission.CashTransfer_ResaleBags]: { label: "Déposer sacs d'argent" },
            [JobPermission.CashTransfer_FillIn]: { label: 'Remplir banque / ATM' },
        },
        bossZones: [
            {
                center: [-17.97, -705.88, 46.02],
                length: 7.8,
                width: 4.4,
                heading: 25,
                minZ: 45.02,
                maxZ: 49.02,
                debugPoly: false,
            },
        ],
        phone: '555-STONK',
        canReceiveSocietyInvoice: true,
    },
    [JobType.Bennys]: {
        label: 'New Gahray',
        platePrefix: 'NEWG',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
            [JobPermission.BennysEstimate]: { label: 'Estimer les véhicules' },
            [JobPermission.BennysOrder]: { label: "Commander un véhicule d'essai" },
            [JobPermission.BennysResell]: { label: 'Revendre un véhicule' },
            [JobPermission.BennysPitStopPrice]: { label: 'Changer le prix du Pit Stop' },
        },
        bossZones: [
            {
                center: [-204.51, -1336.96, 34.89],
                length: 15.8,
                width: 3.4,
                heading: 0,
                minZ: 33.89,
                maxZ: 37.89,
                debugPoly: false,
            },
        ],
        phone: '555-NEWGAHRAY',
        canReceiveSocietyInvoice: true,
    },
    [JobType.Upw]: {
        label: 'Unexpected Power & Water',
        platePrefix: 'UPW',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
            [JobPermission.UpwOrder]: { label: 'Commander des véhicules éléctriques' },
        },
        bossZones: [
            {
                center: [604.3, 2765.85, 47.76],
                length: 11.2,
                width: 11.8,
                heading: 4,
                minZ: 46.76,
                maxZ: 50.76,
                debugPoly: false,
            },
        ],
        phone: '555-UPW',
        canReceiveSocietyInvoice: true,
    },
    [JobType.Pawl]: {
        label: 'Pipe And Wooden Leg',
        platePrefix: 'PAWL',
        menuCallback: 'pawl:client:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
        },
        resell: {
            primary: {
                coords: [-272.22, -2496.57, 7.3, 186.72],
                ZoneName: 'Resell:LSPort:Pawl',
                SourceAccount: 'farm_pawl',
                TargetAccount: 'safe_pawl',
            },
            secondary: { ZoneName: 'Resell:Zkea', SourceAccount: 'farm_pawl', TargetAccount: 'safe_pawl' },
        },
        bossZones: [
            {
                center: [-539.85, 5300.99, 76.37],
                length: 9.4,
                width: 10.8,
                heading: 341,
                minZ: 75.37,
                maxZ: 79.37,
                debugPoly: false,
            },
        ],
        phone: '555-PAWL',
        canReceiveSocietyInvoice: true,
    },
    [JobType.Baun]: {
        label: 'Bahama Unicorn',
        platePrefix: 'BAUN',
        menuCallback: 'soz-jobs:client:baun:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
            [JobPermission.BaunHarvest]: { label: 'Récolter des ingrédients' },
            [JobPermission.BaunRestock]: { label: 'Réapprovisionner le matériel' },
            [JobPermission.BaunCraft]: { label: 'Fabriquer un cocktail' },
        },
        bossZones: [
            {
                center: [96.11, -1292.08, 29.27],
                length: 7.2,
                width: 6.2,
                heading: 300,
                minZ: 28.27,
                maxZ: 32.27,
            },
            {
                center: [-1387.87, -631.19, 30.81],
                length: 5.4,
                width: 6.4,
                heading: 303,
                minZ: 29.81,
                maxZ: 33.81,
            },
        ],
        phone: '555-BAUN',
        canReceiveSocietyInvoice: true,
    },
    [JobType.Ffs]: {
        label: 'Fight For Style',
        platePrefix: 'FFS',
        menuCallback: 'soz-jobs:client:ffs:OpenSocietyMenu',
        canInvoice: true,
        permissions: {
            ...BasePermissions,
            [JobPermission.FfsHarvest]: { label: 'Récolter des matériaux' },
            [JobPermission.FfsRestock]: { label: "Réapprovisionner l'atelier" },
            [JobPermission.FfsCraft]: { label: 'Coudre un vêtement' },
        },
        bossZones: [
            {
                center: [706.83, -965.59, 30.41],
                length: 6.0,
                width: 6.0,
                heading: 0,
                minZ: 29.41,
                maxZ: 33.41,
            },
        ],
        phone: '555-FFS',
        canReceiveSocietyInvoice: true,
    },
    [JobType.MDR]: {
        label: 'Mandatory',
        platePrefix: 'MDR',
        permissions: {
            ...BasePermissions,
            [JobPermission.VehicleRegistrar]: { label: 'Accès aux registre des véhicules' },
            [JobPermission.Investigation]: { label: 'Accès aux enquêtes' },
            [JobPermission.ManageInvestigation]: { label: 'Gérer les enquêtes' },
            [JobPermission.MdrViewCitizenData]: { label: 'Accès aux casiers judiciaires' },
            [JobPermission.InvestigationLawyer]: { label: 'Avocat dans les enquêtes' },
            [JobPermission.MdrViewOtherJobs]: { label: 'Accès aux infos des entreprises' },
            [JobPermission.MdrMarkedMoneyCleaning]: { label: 'Accès à la réhabilitation des billets' },
        },
        bossZones: [
            {
                center: [-546.36, -201.78, 47.66],
                length: 8.0,
                width: 17.0,
                heading: 30.0,
                minZ: 46.66,
                maxZ: 49.66,
            },
        ],
        menuCallback: 'soz-jobs:client:mdr:OpenSocietyMenu',
        canInvoice: true,
        phone: '555-MDR',
        canReceiveSocietyInvoice: true,
    },
    [JobType.Gouv]: {
        label: 'Gouvernement',
        platePrefix: 'GOUV',
        permissions: {
            ...BasePermissions,
        },
        bossZones: [
            {
                center: [-526.8, -597.0, 34.68],
                length: 8.8,
                width: 17.6,
                heading: 90.0,
                minZ: 33.68,
                maxZ: 35.68,
            },
        ],
        menuCallback: 'soz-jobs:client:gouv:OpenSocietyMenu',
        canInvoice: true,
        phone: '555-GOUV',
        canReceiveSocietyInvoice: true,
    },
    [JobType.SASP]: {
        label: 'San Andreas State Police',
        platePrefix: 'SASP',
        permissions: {
            ...BasePermissions,
            [JobPermission.CriminalRecord]: { label: 'Accès aux casiers judiciaires' },
            [JobPermission.VehicleRegistrar]: { label: 'Accès au registre des véhicules' },
            [JobPermission.Investigation]: { label: 'Accès aux enquêtes' },
            [JobPermission.ManageInvestigation]: { label: 'Gérer les enquêtes' },
            [JobPermission.AssignCertification]: { label: 'Assigner des certifications aux agents' },
            [JobPermission.ManageCertification]: { label: 'Gérer les certifications' },
            [JobPermission.FDOFedPound]: { label: 'Mise en fourrière fédérale' },
        },
        bossZones: [
            {
                center: [-584.16, -593.97, 34.68],
                length: 8.4,
                width: 11.6,
                heading: 90.0,
                minZ: 33.68,
                maxZ: 35.68,
            },
        ],
        menuCallback: 'soz-jobs:client:police:OpenSocietyMenu',
        canInvoice: true,
        phone: '555-SASP',
        canReceiveSocietyInvoice: true,
    },
    [JobType.FDF]: {
        label: 'Ferme de Fou',
        platePrefix: 'FDF',
        permissions: {
            ...BasePermissions,
        },
        bossZones: [
            {
                center: [2443.96, 4974.61, 47.39],
                length: 23.2,
                width: 47.8,
                heading: 226.09,
                minZ: 44.39,
                maxZ: 55.39,
            },
        ],
        menuCallback: 'soz-jobs:client:fdf:OpenSocietyMenu',
        canInvoice: true,
        phone: '555-FDF',
        canReceiveSocietyInvoice: true,
    },
    [JobType.DMC]: {
        label: 'DeMetal Company',
        platePrefix: 'DMC',
        permissions: {
            ...BasePermissions,
        },
        bossZones: [
            {
                center: [1077.99, -1979.487, 31.37],
                length: 7.8,
                width: 4.2,
                heading: 235.7,
                minZ: 30.37,
                maxZ: 32.97,
            },
        ],
        menuCallback: 'soz-jobs:client:dmc:OpenSocietyMenu',
        canInvoice: true,
        phone: '555-DMC',
        canReceiveSocietyInvoice: true,
        resell: {
            primary: {
                coords: [-132.7, -2383.92, 6.0, 174.18],
                ZoneName: 'Resell:LSPort:Dmc',
                SourceAccount: 'farm_dmc',
                TargetAccount: 'safe_dmc',
            },
            secondary: { ZoneName: 'Resell:LSCustom', SourceAccount: 'farm_dmc', TargetAccount: 'safe_dmc' },
        },
    },
};
