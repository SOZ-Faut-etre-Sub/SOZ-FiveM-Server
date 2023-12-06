export const isLSPDMessage = messageType => {
    return /^(lspd)(:end)?$/.test(messageType);
};

export const isBCSOMessage = messageType => {
    return /^(bcso)(:end)?$/.test(messageType);
};

export const isSASPMessage = messageType => {
    return /^(sasp)(:end)?$/.test(messageType);
};

export const isActivePoliceMessage = messageType => {
    return /^(lspd|bcso|sasp)$/.test(messageType);
};

export const isPoliceMessage = messageType => {
    return isLSPDMessage(messageType) || isBCSOMessage(messageType) || isSASPMessage(messageType);
};

export const convertTypeToName = function (type) {
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
