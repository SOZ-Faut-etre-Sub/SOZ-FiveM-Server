export type AlertCategory =
    | 'CONTACT_ADD_SUCCESS'
    | 'CONTACT_ADD_FAILED'
    | 'CONTACT_UPDATE_SUCCESS'
    | 'CONTACT_UPDATE_FAILED'
    | 'CONTACT_DELETE_SUCCESS'
    | 'CONTACT_DELETE_FAILED';

export interface PreDBContact {
    display: string;
    number: string;
    avatar?: string;
    favorite?: boolean;
}

export interface Contact extends PreDBContact {
    id: number;
}

export interface ContactDeleteDTO {
    id: number;
}

export interface ContactSetFavoriteDTO {
    id: number;
    favorite: boolean;
}

export enum ContactsDatabaseLimits {
    number = 20,
    display = 255,
}

export enum ContactEvents {
    GET_CONTACTS = 'phone:contact:get',
    ADD_CONTACT = 'phone:contact:add',
    ADD_CONTACT_SUCCESS = 'phone:contact:addSuccess',
    UPDATE_CONTACT = 'phone:contact:update',
    UPDATE_CONTACT_SUCCESS = 'phone:contact:updateSuccess',
    DELETE_CONTACT = 'phone:contact:delete',
    DELETE_CONTACT_SUCCESS = 'phone:contact:deleteSuccess',
    SET_FAVORITE_CONTACT = 'phone:contact:setFavorite',
    SET_FAVORITE_CONTACT_SUCCESS = 'phone:contact:setFavoriteSuccess',
}

export interface AddContactExportData {
    name?: string;
    number: string;
    avatar?: string;
}
