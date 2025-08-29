import { Zone } from '@public/shared/polyzone/box.zone';

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
    YouNews = 'you-news',
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
    Gouv = 'gouv',
    FDF = 'fdf',
    SASP = 'sasp',
    DMC = 'dmc',
    LSCS = 'lscs',
    Casino = 'casino',
}

export const BASE_FDO = [JobType.LSPD, JobType.BCSO];
export const FDO = [JobType.FBI, JobType.LSPD, JobType.BCSO, JobType.SASP, JobType.LSCS];
export const PUBLIC_SERVICES = [
    JobType.FBI,
    JobType.LSPD,
    JobType.BCSO,
    JobType.SASP,
    JobType.LSCS,
    JobType.LSMC,
    JobType.MDR,
    JobType.CashTransfer,
    JobType.Gouv,
];
export const FDO_NO_FBI = [JobType.LSPD, JobType.BCSO, JobType.SASP];
export const FDO_LSMC = [JobType.FBI, JobType.LSPD, JobType.BCSO, JobType.SASP, JobType.LSCS, JobType.LSMC];

export enum JobPermission {
    Enrollment = 'enrollment',
    ManageGrade = 'manage-grade',
    SocietyDealershipVehicle = 'society-dealership-vehicle',
    SocietyPrivateStorage = 'society-private-storage',
    SocietyGeneralStorage = 'society-general-storage',
    SocietyMoneyStorage = 'society-money-storage',
    SocietyShop = 'society-shop',
    SocietyBankAccount = 'society-bank-account',
    SocietyBankInvoices = 'society-bank-invoices',
    SocietyTakeOutPound = 'society-take-out-pound',
    SocietyPublicGarage = 'society-public-garage',
    SocietyPrivateGarage = 'society-private-garage',
    SocietyPublicPort = 'society-public-port',
    SocietyPrivatePort = 'society-private-port',
    SocietyViewCompanyPanel = 'society-view-company-panel',
    NewCompanyPanelAccess = 'new-company-panel-read',
    EmployeesListRead = 'employees-list-read',
    EmployeesListWrite = 'employees-list-write',
    PricingRead = 'pricing-read',
    PricingManage = 'pricing-manage',
    NewsManageArticle = 'manage-article',
    NewsManageBillboards = 'manage-billboards',
    NewsCreateBillboard = 'create-billboard',
    NewsUpdateBillboard = 'update-billboard',
    CashTransfer_CollectBags = 'collect-bags',
    CashTransfer_CollectSecure = 'collect-secure',
    CashTransfer_ResaleBags = 'resale-bags',
    CashTransfer_AccountAccess = 'account-access',
    CashTransfer_FillIn = 'fill-in',
    FuelerChangePrice = 'fueler-change-price',
    CriminalRecord = 'criminal-record',
    VehicleRegistrar = 'vehicle-registrar',
    VehicleTransfert = 'vehicle-transfert',
    Investigation = 'investigation',
    ManageInvestigation = 'investigation-manage',
    InvestigationLawyer = 'investigation-lawyer',
    InvestigationProsecutor = 'investigation-prosecutor',
    ManageCertification = 'certification-manage',
    AssignCertification = 'certification-agent',
    ManageRoster = 'roster-manage',
    ReadDocumentation = 'documentation-read',
    WriteDocumentation = 'documentation-write',
    ManageDocumentation = 'documentation-manage',
    MedicalPatientAccess = 'medical-patient-access',
    MedicalPatientEdit = 'medical-patient-edit',
    MedicalPatientDelete = 'medical-patient-delete',
    MedicalPatientHistoryEdit = 'medical-patient-history-edit',
    MedicalPatientHistoryDelete = 'medical-patient-history-delete',
    MedicalPatientHistoryAccess = 'medical-patient-history-access',
    MedicalPsyConsultAccess = 'medical-patient-psy-access',
    Harvest = 'harvest',
    Restock = 'restock',
    Craft = 'craft',
    BennysEstimate = 'estimate',
    BennysResell = 'resell',
    Order = 'order',
    MdrViewOtherJobs = 'view-other-jobs',
    MdrViewCitizenData = 'view-citizen-data',
    MdrEditCitizenData = 'edit-citizen-data',
    MdrMarkedMoneyCleaning = 'marked-money-cleaning',
    UpwChangePrice = 'upw-change-price',
    FDOFedPound = 'fdo-fed-pound',
    OnDutyView = 'view-employe-on-duty',
    BennysPitStopPrice = 'pitstop-price',
    GouvUpdateTax = 'update-tax',
    GouvManageRadar = 'manage-radar',
    GouvManageFine = 'manage-fine',
    GouvSenatSalary = 'update-senat-salary',
}

export const JobLabel: Record<JobType, string> = {
    [JobType.Unemployed]: 'Sans emploi',
    [JobType.Adsl]: 'ADSL',
    [JobType.Delivery]: 'Fougère Prime',
    [JobType.Religious]: 'InfoChat',
    [JobType.Scrapper]: 'OldMetal',
    [JobType.LSPD]: 'Los Santos Police Department',
    [JobType.BCSO]: 'Blaine County Sheriff Office',
    [JobType.LSMC]: 'Los Santos Medical Center',
    [JobType.Taxi]: 'Carl Jr Services',
    [JobType.Food]: 'Château Marius',
    [JobType.News]: 'Twitch News',
    [JobType.YouNews]: 'You News',
    [JobType.Garbage]: 'BlueBird',
    [JobType.Oil]: 'Michel Transport Petrol',
    [JobType.CashTransfer]: 'STONK Security',
    [JobType.Bennys]: 'New Gahray',
    [JobType.Upw]: 'Unexpected Power & Water',
    [JobType.Pawl]: 'Pipe And Wooden Leg',
    [JobType.Ffs]: 'Fight For Style',
    [JobType.Baun]: 'Bahama Unicorn',
    [JobType.FBI]: 'Federal Bureau of Investigation',
    [JobType.MDR]: 'Mandatory',
    [JobType.Gouv]: 'Gouvernement',
    [JobType.FDF]: 'Ferme de Fou',
    [JobType.SASP]: 'San Andreas State Police',
    [JobType.DMC]: 'DeMetal Company',
    [JobType.LSCS]: 'Los Santos County Sheriff',
    [JobType.Casino]: 'Diamond Casino',
};

export type JobPermissionData = {
    label: string;
};

export type Job = {
    // Must use the getJobs method to generate the id from the object.
    id: JobType;
    label: string;
    permissions: Partial<Record<JobPermission, JobPermissionData>>;
    platePrefix?: string;
    bossZones?: Zone[];
    canInvoice?: boolean;
    menuCallback?: ClientEvent | string;
    resell?: any;
    phone?: string;
    canReceiveSocietyInvoice: boolean;
    taxCollectAccounts?: string[];
};

export type JobGrade = {
    id: number;
    jobId: string;
    name: string;
    weight: number;
    salary: number;
    owner: boolean;
    is_default: boolean;
    permissions: JobPermission[];
};

export type ResellZone = {
    source_account: string;
    target_account: string;
    inventory_id?: string;
};

export const JobResellZones: Record<string, ResellZone> = {
    'Resell:LSPort:Dmc': {
        source_account: 'farm_dmc',
        target_account: 'safe_dmc',
    },
    'Resell:LSPort:Pawl': {
        source_account: 'farm_pawl',
        target_account: 'safe_pawl',
    },
    'Resell:LSPort:Food': {
        source_account: 'farm_food',
        target_account: 'safe_food',
    },
    'Resell:FDF:Silo': {
        source_account: 'farm_fdf',
        target_account: 'safe_fdf',
    },
    'Resell:FDF:Bell-Farm': {
        source_account: 'farm_fdf',
        target_account: 'safe_fdf',
    },
    'Resell:Zkea': {
        source_account: 'farm_pawl',
        target_account: 'safe_pawl',
        inventory_id: 'cabinet_storage',
    },
};

export const ALL_FDO_JOB_TARGETS = {
    [JobType.BCSO]: 0,
    [JobType.FBI]: 0,
    [JobType.SASP]: 0,
    [JobType.LSPD]: 0,
    [JobType.LSCS]: 0,
};

export const LOW_RANGE_JOBS_ITEMS = {
    prop_roadcone02a: {
        interactionDistance: 0.8,
        drawDistance: 1.2,
        jobs: {
            [JobType.LSMC]: 0,
            [JobType.Bennys]: 0,
            [JobType.CashTransfer]: 0,
            ...ALL_FDO_JOB_TARGETS,
        },
    },
};
