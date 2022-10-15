import { ClientEvent } from './event';

export enum JobType {
    Unemployed = 'unemployed',
    Adsl = 'adsl',
    Delivery = 'delivery',
    Religious = 'religious',
    Scrapper = 'scrapper',
    LSPD = 'lspd',
    BCSO = 'bcso',
    LSMC = 'lsmc',
    Taxi = 'taxi',
    Food = 'food',
    News = 'news',
    Garbage = 'garbage',
    Oil = 'oil',
    CashTransfer = 'cash-transfer',
    Bennys = 'bennys',
    Pawl = 'pawl',
    Upw = 'upw',
    Ffs = 'ffs',
}

export enum JobPermission {
    Enrollment = 'enrollment',
    ManageGrade = 'manage-grade',
    SocietyDealershipVehicle = 'society-dealership-vehicle',
    SocietyPrivateStorage = 'society-private-storage',
    SocietyShop = 'society-shop',
    SocietyBankAccount = 'society-bank-account',
    SocietyBankInvoices = 'society-bank-invoices',
    SocietyTakeOutPound = 'society-take-out-pound',
    NewsManageArticle = 'manage-article',
    CashTransfer_CollectBags = 'collect-bags',
    CashTransfer_ResaleBags = 'resale-bags',
    CashTransfer_FillIn = 'fill-in',
    Food_Harvest = 'harvest',
    Food_Craft = 'craft',
    Fueler_ChangePrice = 'fueler-change-price',
    CriminalRecord = 'criminal-record',
    VehicleRegistrar = 'vehicle-registrar',
    Investigation = 'investigation',
    ManageInvestigation = 'investigation-manage',
    Baun_Harvest = 'harvest',
    Baun_Restock = 'restock',
    Baun_Craft = 'craft',
    Ffs_Harvest = 'harvest',
    Ffs_Restock = 'restock',
    Ffs_Craft = 'craft',
    Bennys_Estimate = 'estimate',
    Bennys_Resell = 'resell',
    Bennys_Order = 'order',
}

export type Job = {
    // Must use the getJobs method to generate the id from the object.
    id: JobType;
    grades: JobGrade[];
    label: string;
    permissions: {
        [key: string]: {
            label: string;
        };
    };
    platePrefix?: string;
    // TODO: Complete when necessary
    temporary?: any;
    bossZones?: any;
    canInvoice?: boolean;
    menuCallback?: ClientEvent;
    resell?: any;
};

export type JobGrade = {
    id: number;
    jobId: string;
    name: string;
    weight: number;
    salary: number;
    owner: number;
    is_default: boolean;
    permissions: string[];
};
