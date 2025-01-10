export const isLSPDMessage = (messageType: string) => {
    return /^(lspd)(:end)?$/.test(messageType);
};

export const isBCSOMessage = (messageType: string) => {
    return /^(bcso)(:end)?$/.test(messageType);
};

export const isSASPMessage = (messageType: string) => {
    return /^(sasp)(:end)?$/.test(messageType);
};

export const isActivePoliceMessage = (messageType: string) => {
    return /^(lspd|bcso|sasp)$/.test(messageType);
};

export const isPoliceMessage = (messageType: string) => {
    return isLSPDMessage(messageType) || isBCSOMessage(messageType) || isSASPMessage(messageType);
};

export const convertTypeToName = (type: string) => {
    switch (type) {
        case 'annonce':
            return 'Annonce';
        case 'breaking-news':
            return 'Breaking News';
        case 'publicité':
            return 'Publicité';
        case 'fait-divers':
            return 'Fait Divers';
        case 'info-trafic':
            return 'Info Trafic';
    }
};
