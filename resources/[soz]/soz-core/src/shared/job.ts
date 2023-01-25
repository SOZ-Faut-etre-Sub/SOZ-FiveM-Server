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
    Upw = 'upw',
    Pawl = 'pawl',
    Ffs = 'ffs',
    Baun = 'baun',
    FBI = 'fbi',
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
    FuelerChangePrice = 'fueler-change-price',
    CriminalRecord = 'criminal-record',
    VehicleRegistrar = 'vehicle-registrar',
    Investigation = 'investigation',
    ManageInvestigation = 'investigation-manage',
    BaunHarvest = 'harvest',
    BaunRestock = 'restock',
    BaunCraft = 'craft',
    FfsHarvest = 'harvest',
    FfsRestock = 'restock',
    FfsCraft = 'craft',
    BennysEstimate = 'estimate',
    BennysResell = 'resell',
    BennysOrder = 'order',
    UpwOrder = 'order',
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
    phone?: string;
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

export type JobCloakroomZoneData = {
    id: string;
    event: string;
    job: JobType;
    storage: string;
};
