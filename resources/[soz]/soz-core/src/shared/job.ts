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
    MDR = 'mdr',
}

export enum JobPermission {
    Enrollment = 'enrollment',
    ManageGrade = 'manage-grade',
    SocietyDealershipVehicle = 'society-dealership-vehicle',
    SocietyPrivateStorage = 'society-private-storage',
    SocietyMoneyStorage = 'society-money-storage',
    SocietyShop = 'society-shop',
    SocietyBankAccount = 'society-bank-account',
    SocietyBankInvoices = 'society-bank-invoices',
    SocietyTakeOutPound = 'society-take-out-pound',
    SocietyViewCompanyPanel = 'society-view-company-panel',
    NewsManageArticle = 'manage-article',
    CashTransfer_CollectBags = 'collect-bags',
    CashTransfer_CollectSecure = 'collect-secure',
    CashTransfer_ResaleBags = 'resale-bags',
    CashTransfer_FillIn = 'fill-in',
    Food_Harvest = 'harvest',
    Food_Craft = 'craft',
    FuelerChangePrice = 'fueler-change-price',
    CriminalRecord = 'criminal-record',
    VehicleRegistrar = 'vehicle-registrar',
    Investigation = 'investigation',
    ManageInvestigation = 'investigation-manage',
    InvestigationLawyer = 'investigation-lawyer',
    BaunHarvest = 'harvest',
    BaunRestock = 'restock',
    BaunCraft = 'craft',
    FfsHarvest = 'harvest',
    FfsRestock = 'restock',
    FfsCraft = 'craft',
    BennysEstimate = 'estimate',
    BennysResell = 'resell',
    BennysOrder = 'order',
    MdrViewOtherJobs = 'view-other-jobs',
    MdrViewCitizenData = 'view-citizen-data',
    MdrMarkedMoneyCleaning = 'marked-money-cleaning',
    UpwOrder = 'order',
    UpwChangePrice = 'upw-change-price',
    FDOFedPound = 'fdo-fed-pound',
}

export const JobLabel: Record<JobType, string> = {
    [JobType.Unemployed]: 'Sans emploi',
    [JobType.Adsl]: 'ADSL',
    [JobType.Delivery]: 'Fougère Prime',
    [JobType.Religious]: 'InfoChat',
    [JobType.Scrapper]: 'DeMetal Company',
    [JobType.LSPD]: 'Los Santos Police Department',
    [JobType.BCSO]: 'Blaine County Sheriff Office',
    [JobType.LSMC]: 'Los Santos Medical Center',
    [JobType.Taxi]: 'Carl Jr Services',
    [JobType.Food]: 'Château Marius',
    [JobType.News]: 'Twitch News',
    [JobType.Garbage]: 'BlueBird',
    [JobType.Oil]: 'Michel Transport Petrol',
    [JobType.CashTransfer]: 'STONK Depository',
    [JobType.Bennys]: 'New Gahray',
    [JobType.Upw]: 'Unexpected Power & Water',
    [JobType.Pawl]: 'Pipe And Wooden Leg',
    [JobType.Ffs]: 'Fight For Style',
    [JobType.Baun]: 'Bahama Unicorn',
    [JobType.FBI]: 'Federal Bureau of Investigation',
    [JobType.MDR]: 'Mandatory',
};

export type JobPermissionData = {
    label: string;
};

export type Job = {
    // Must use the getJobs method to generate the id from the object.
    id: JobType;
    grades: JobGrade[];
    label: string;
    permissions: Partial<Record<JobPermission, JobPermissionData>>;
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
    permissions: JobPermission[];
};

export type JobCloakroomZoneData = {
    id: string;
    event: string;
    job: JobType;
    storage: string;
};
