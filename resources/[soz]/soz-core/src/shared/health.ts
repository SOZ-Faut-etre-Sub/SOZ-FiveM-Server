import { PlayerHealthBook } from './player';

export const healthLevelToLabel = (level: number | null, min: number, max: number): string => {
    if (null === level) {
        return 'inconnu';
    }

    const base0Level = level - min;
    const percentLevel = (base0Level * 100) / (max - min);

    if (percentLevel < 20) {
        return 'exécrable';
    } else if (percentLevel < 40) {
        return 'mauvais';
    } else if (percentLevel < 60) {
        return 'moyen';
    } else if (percentLevel < 80) {
        return 'bon';
    } else {
        return 'excellent';
    }
};

export const HealthBookMinMax: Record<keyof PlayerHealthBook, { min: number; max: number }> = {
    health_book_health_level: { min: 0, max: 100 },
    health_book_fiber: { min: 0, max: 100 },
    health_book_lipid: { min: 0, max: 100 },
    health_book_max_stamina: { min: 50, max: 120 },
    health_book_protein: { min: 0, max: 100 },
    health_book_strength: { min: 50, max: 120 },
    health_book_stress_level: { min: 0, max: 100 },
    health_book_sugar: { min: 0, max: 100 },
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

export const healthBookFieldToLabel = (field: keyof PlayerHealthBook, value: number): string => {
    const minMax = HealthBookMinMax[field];

    return healthLevelToLabel(value, minMax.min, minMax.max);
};
