import { PlayerData, PlayerHealthBook } from './player';

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
        return 'Bon';
    }

    if (level <= 60) {
        return 'Moyen';
    }

    if (level <= 80) {
        return 'Élevé';
    }

    return 'Très élevé';
};

export const healthLevelToLabel = (
    level: number | null,
    min: number,
    max: number,
    strategy = LabelStrategy.MinMax
): string => {
    if (!level && level !== 0) {
        return 'Inconnu';
    }

    const base0Level = level - min;

    let percentLevel = (base0Level * 100) / (max - min);

    if (strategy === LabelStrategy.MinMaxInverted) {
        percentLevel = 100 - percentLevel;
    }

    if (strategy === LabelStrategy.MinMaxAverage) {
        if (percentLevel < 0 || percentLevel > 100) {
            return 'Exécrable';
        }

        if (percentLevel < 15 || percentLevel > 85) {
            return 'Mauvais';
        }

        if (percentLevel < 30 || percentLevel > 70) {
            return 'Moyen';
        }

        if (percentLevel < 45 || percentLevel > 55) {
            return 'Bon';
        }

        return 'Excellent';
    }

    if (percentLevel < 20) {
        return 'Exécrable';
    }

    if (percentLevel < 40) {
        return 'Mauvais';
    }

    if (percentLevel < 60) {
        return 'Moyen';
    }

    if (percentLevel < 80) {
        return 'Bon';
    }

    return 'Excellent';
};

export const injuriesLevelToLabel = (targetPlayer: PlayerData): string => {
    let state = 'aucunes';
    if (targetPlayer.metadata.injuries_count >= 7) {
        state = 'graves';
    } else if (targetPlayer.metadata.injuries_count >= 4) {
        state = 'moyennes';
    } else if (targetPlayer.metadata.injuries_count >= 1) {
        state = 'légères';
    } else {
        state = 'aucunes';
    }
    return state;
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

export enum StressLooseType {
    VehicleAbove160,
    VehicleAbove180,
    VehicleYellowEngine,
    SeenDead,
    ShootingNearby,
    HittingNearby,
    Dead,
    Handcuffed,
    DrinkCoffee,
    DrinkAlcohol,
    Smoke,
}

export const PointsByStressLooseType: Record<StressLooseType, number> = {
    [StressLooseType.VehicleAbove160]: 1,
    [StressLooseType.VehicleAbove180]: 2,
    [StressLooseType.VehicleYellowEngine]: 3,
    [StressLooseType.ShootingNearby]: 3,
    [StressLooseType.HittingNearby]: 2,
    [StressLooseType.SeenDead]: 2,
    [StressLooseType.Dead]: 10,
    [StressLooseType.Handcuffed]: 1,
    [StressLooseType.DrinkCoffee]: -2,
    [StressLooseType.DrinkAlcohol]: -6,
    [StressLooseType.Smoke]: -1,
};

export const IntervalByStressLooseType: Record<StressLooseType, number> = {
    [StressLooseType.VehicleAbove160]: 30,
    [StressLooseType.VehicleAbove180]: 30,
    [StressLooseType.VehicleYellowEngine]: 30,
    [StressLooseType.ShootingNearby]: 30,
    [StressLooseType.HittingNearby]: 30,
    [StressLooseType.SeenDead]: 30,
    [StressLooseType.Dead]: 0,
    [StressLooseType.Handcuffed]: 0,
    [StressLooseType.DrinkCoffee]: 30,
    [StressLooseType.DrinkAlcohol]: 30,
    [StressLooseType.Smoke]: 30,
};
