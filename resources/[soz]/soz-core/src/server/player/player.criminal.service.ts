import { Injectable } from '../../core/decorators/injectable';

@Injectable()
export class PlayerCriminalService {
    private playerCriminal = new Map<string, NodeJS.Timeout>();

    public setCriminal(citizenId: string, timeoutInMs: number): void {
        if (this.playerCriminal.has(citizenId)) {
            clearTimeout(this.playerCriminal.get(citizenId));
        }

        this.playerCriminal.set(
            citizenId,
            setTimeout(() => {
                this.playerCriminal.delete(citizenId);
            }, timeoutInMs)
        );
    }

    public isCriminal(citizenId: string): boolean {
        return this.playerCriminal.has(citizenId);
    }
}
