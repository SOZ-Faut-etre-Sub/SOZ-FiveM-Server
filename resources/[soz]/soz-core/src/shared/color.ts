export type RGBColor = [number, number, number];
export type RGBAColor = [number, number, number, number];

export type HSLColor = [number, number, number];

export const rgbToHsl = (rgb: RGBColor): HSLColor => {
    const [r, g, b] = rgb.map(x => x / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const l = (max + min) / 2;
    let h: number, s: number;

    if (delta === 0) {
        h = s = 0; // achromatic
    } else {
        s = l < 0.5 ? delta / (max + min) : delta / (2 - max - min);
        switch (max) {
            case r:
                h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
                break;
            case g:
                h = ((b - r) / delta + 2) * 60;
                break;
            case b:
                h = ((r - g) / delta + 4) * 60;
                break;
        }
    }

    return [h, s * 100, l * 100];
};

export const hslToRgb = (hsl: HSLColor): RGBColor => {
    const [h, s, l] = hsl.map(x => x / 100);
    let r: number, g: number, b: number;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const hueToRgb = (t: number): number => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        r = hueToRgb(h + 1 / 3);
        g = hueToRgb(h);
        b = hueToRgb(h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
