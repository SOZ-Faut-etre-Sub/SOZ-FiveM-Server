import { Inject, Injectable } from '@core/decorators/injectable';

import {
    TCG_DAILY_FREE_CARDS,
    TcgDailyStatus,
    TcgClaimResult,
    TcgCollectionCard,
} from '../../shared/tcg/tcg.types';
import { TcgRepository } from './tcg.repository';

function getTodayDate(): string {
    return new Date().toISOString().slice(0, 10);
}

@Injectable()
export class TcgService {
    @Inject(TcgRepository)
    private repository: TcgRepository;

    async getDailyStatus(citizenid: string): Promise<TcgDailyStatus> {
        const claim = await this.repository.getDailyClaim(citizenid, getTodayDate());
        const claimedToday = claim?.claimed_count ?? 0;

        return {
            dailyLimit: TCG_DAILY_FREE_CARDS,
            claimedToday,
            remainingToday: Math.max(0, TCG_DAILY_FREE_CARDS - claimedToday),
        };
    }

    async claimDailyCards(citizenid: string): Promise<TcgClaimResult> {
        const today = getTodayDate();
        const claim = await this.repository.getDailyClaim(citizenid, today);
        const claimedToday = claim?.claimed_count ?? 0;

        if (claimedToday >= TCG_DAILY_FREE_CARDS) {
            return {
                success: false,
                cards: [],
                remainingToday: 0,
                message: 'Tu as déjà récupéré tes cartes du jour !',
            };
        }

        const cardsToGive = TCG_DAILY_FREE_CARDS - claimedToday;
        const activeCards = await this.repository.getActiveCards();

        if (activeCards.length === 0) {
            return {
                success: false,
                cards: [],
                remainingToday: cardsToGive,
                message: 'Aucune carte disponible pour le moment.',
            };
        }

        const drawnCardIds: number[] = [];
        for (let i = 0; i < cardsToGive; i++) {
            const idx = Math.floor(Math.random() * activeCards.length);
            drawnCardIds.push(activeCards[idx].id);
        }

        const userCards = await this.repository.insertUserCards(citizenid, drawnCardIds);
        const newCount = claimedToday + cardsToGive;
        await this.repository.upsertDailyClaim(citizenid, today, newCount);

        return {
            success: true,
            cards: userCards.map(uc => ({
                id: uc.tcg_card.id,
                name: uc.tcg_card.name,
                image: uc.tcg_card.image,
            })),
            remainingToday: Math.max(0, TCG_DAILY_FREE_CARDS - newCount),
        };
    }

    async getCollection(citizenid: string): Promise<TcgCollectionCard[]> {
        const userCards = await this.repository.getCollection(citizenid);
        return userCards.map(uc => ({
            userCardId: uc.id,
            cardId: uc.tcg_card.id,
            name: uc.tcg_card.name,
            image: uc.tcg_card.image,
            obtainedAt: uc.obtained_at.toISOString(),
        }));
    }
}
