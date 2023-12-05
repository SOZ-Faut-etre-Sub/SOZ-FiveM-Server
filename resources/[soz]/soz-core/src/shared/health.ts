import { PlayerHealthBook } from './player';

export enum LabelStrategy {
    MinMax,
    MinMaxInverted,
    MinMaxAverage,
}

export const stressLevelToLabel = (level: number | null): string => {
    if (level === null) {
        return 'N/A';
    }

    if (level < 40) {
        return 'bon';
    }

    if (level <= 60) {
        return 'moyen';
    }

    if (level <= 80) {
        return 'élevé';
    }

    return 'très élevé';
};

export const healthLevelToLabel = (
    level: number | null,
    min: number,
    max: number,
    strategy = LabelStrategy.MinMax
): string => {
    if (!level && level !== 0) {
        return 'inconnu';
    }

    const base0Level = level - min;

    let percentLevel = (base0Level * 100) / (max - min);

    if (strategy === LabelStrategy.MinMaxInverted) {
        percentLevel = 100 - percentLevel;
    }

    if (strategy === LabelStrategy.MinMaxAverage) {
        if (percentLevel < 0 || percentLevel > 100) {
            return 'exécrable';
        }

        if (percentLevel < 15 || percentLevel > 85) {
            return 'mauvais';
        }

        if (percentLevel < 30 || percentLevel > 70) {
            return 'moyen';
        }

        if (percentLevel < 45 || percentLevel > 55) {
            return 'bon';
        }

        return 'excellent';
    }

    if (percentLevel < 20) {
        return 'exécrable';
    }

    if (percentLevel < 40) {
        return 'mauvais';
    }

    if (percentLevel < 60) {
        return 'moyen';
    }

    if (percentLevel < 80) {
        return 'bon';
    }

    return 'excellent';
};

export const HealthBookMinMax: Record<keyof PlayerHealthBook, { min: number; max?: number }> = {
    health_book_health_level: { min: 0, max: 100 },
    health_book_fiber: { min: 0, max: 25 },
    health_book_lipid: { min: 0, max: 25 },
    health_book_max_stamina: { min: 50, max: 160 },
    health_book_protein: { min: 0, max: 25 },
    health_book_strength: { min: 50, max: 160 },
    health_book_stress_level: { min: 0, max: 100 },
    health_book_sugar: { min: 0, max: 25 },
};

export const HealthBookLabel: Record<keyof PlayerHealthBook, string> = {
    health_book_health_level: 'Etat de santé',
    health_book_lipid: 'Lipides',
    health_book_max_stamina: 'Endurance',
    health_book_protein: 'Protéines',
    health_book_strength: 'Force',
    health_book_stress_level: 'Niveau de stress',
    health_book_sugar: 'Glucides',
    health_book_fiber: 'Fibres',
};
