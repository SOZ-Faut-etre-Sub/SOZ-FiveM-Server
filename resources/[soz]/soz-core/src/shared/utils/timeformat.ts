export function formatDuration(ms: number) {
    if (ms < 0) ms = -ms;
    const time = {
        jour: Math.floor(ms / 86400000),
        heure: Math.floor(ms / 3600000) % 24,
        minute: Math.floor(ms / 60000) % 60,
    };
    const ret = Object.entries(time)
        .filter(val => val[1] !== 0)
        .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
        .join(', ');

    return ret.length > 0 ? ret : "Moins d'une minute";
}
