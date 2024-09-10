export const borderColor = (policeStyle: string): string => {
    switch (policeStyle) {
        case 'red-alert':
            return 'border-red-500/70';
        case 'robbery':
            return 'border-lime-500/70';
        case 'vandalism':
            return 'border-yellow-400/70';
        case 'racket':
            return 'border-orange-500/70';
        case 'shooting':
            return 'border-indigo-500/70';
        case 'auto-theft':
            return 'border-cyan-500/70';
        case 'drug':
            return 'border-teal-300/70';
        case 'explosion':
            return 'border-pink-500/70';
        case 'default':
        default:
            return 'border-green-500/70';
    }
};

export const textColor = (policeStyle: string): string => {
    switch (policeStyle) {
        case 'red-alert':
            return 'text-red-500';
        case 'robbery':
            return 'text-lime-500';
        case 'vandalism':
            return 'text-yellow-400';
        case 'racket':
            return 'text-orange-500';
        case 'shooting':
            return 'text-indigo-500';
        case 'auto-theft':
            return 'text-cyan-500';
        case 'drug':
            return 'text-teal-300';
        case 'explosion':
            return 'text-pink-500';
        case 'default':
        default:
            return 'text-green-500';
    }
};
