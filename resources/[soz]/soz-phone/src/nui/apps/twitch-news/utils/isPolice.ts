export const isLSPDMessage = messageType => {
    return /^(lspd)(:end)?$/.test(messageType);
};

export const isBCSOMessage = messageType => {
    return /^(bcso)(:end)?$/.test(messageType);
};

export const isActivePoliceMessage = messageType => {
    return /^(lspd|bcso)$/.test(messageType);
};

export const isPoliceMessage = messageType => {
    return isLSPDMessage(messageType) || isBCSOMessage(messageType);
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
        case 'info-traffic':
            return 'Info Traffic';
    }
};
