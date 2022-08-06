import apps from './apps';

export function sendMessage(app: string, method: string, data: any): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return SendNUIMessage({
        app,
        method,
        data,
    });
}

export function sendMessageEvent(method: string, data: any = {}): void {
    return sendMessage(apps.MESSAGES, method, data);
}

export function sendNotesEvent(method: string, data: any = {}): void {
    return sendMessage(apps.NOTES, method, data);
}

export function sendContactsEvent(method: string, data: any = {}): void {
    sendMessage(apps.CONTACTS, method, data);
}

export function sendCameraEvent(method: string, data: any = {}): void {
    sendMessage(apps.CAMERA, method, data);
}

export function sendPhotoEvent(method: string, data: any = {}): void {
    sendMessage(apps.PHOTO, method, data);
}

export function sendSocietyEvent(method: string, data: any = {}): void {
    sendMessage(apps.SOCIETIES, method, data);
}
