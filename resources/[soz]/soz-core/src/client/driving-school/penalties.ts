import { DrivingSchoolConfig, DrivingSchoolLicenseType, PenaltyContext } from '../../shared/driving-school';
import { Err, Ok, Result } from '../../shared/result';

export abstract class Penalty {
    public context: PenaltyContext;

    public exclude: DrivingSchoolLicenseType[] = [];

    protected playerWarned = false;
    protected gracePeriod = 0;
    private maxGracePeriod = DrivingSchoolConfig.maxGracePeriod;
    protected ignoreGracePeriod = false;

    protected warningMsg: string;
    protected failMsg: string;

    constructor(context: PenaltyContext) {
        this.context = context;
    }

    public performCheck(): Result<boolean, boolean> {
        if (this.isValid()) {
            this.gracePeriod =
                this.gracePeriod > DrivingSchoolConfig.gracePeriodIncrement
                    ? this.gracePeriod - DrivingSchoolConfig.gracePeriodIncrement
                    : 0;

            this.playerWarned = this.gracePeriod !== 0;

            return Ok(true);
        }

        if (this.ignoreGracePeriod || this.isGracePeriodExceeded()) {
            this.displayFailMsg();
            return Err(true);
        }

        if (!this.playerWarned) {
            this.playerWarned = true;
            this.displayWarningMsg();
        }

        this.gracePeriod += DrivingSchoolConfig.gracePeriodIncrement;

        return Ok(true);
    }

    protected displayWarningMsg(): void {
        if (!this.warningMsg) {
            return;
        }

        this.context.notifier.notify(`AVERTISSEMENT: ${this.warningMsg}`, 'warning');
    }

    protected displayFailMsg(): void {
        if (!this.failMsg) {
            return;
        }

        this.context.notifier.notify(`ÉCHEC: ${this.failMsg}`, 'error');
    }

    private isGracePeriodExceeded(): boolean {
        return this.gracePeriod >= this.maxGracePeriod;
    }

    public abstract isValid(): boolean;
}

class DamagePenalty extends Penalty {
    private WARNING_THRESHOLD = 995;
    private FAIL_THRESHOLD = 950;

    protected warningMsg = 'Ne casse pas tout ! Attention aux dégâts.';
    protected failMsg = "C'est trop de dégâts ! On arrête les frais.";

    public isValid(): boolean {
        /**
         * `this.gracePeriod` is not relevant for this penalty.
         * Value is set every tick so that it does not trigger exam failure.
         */

        const health = GetEntityHealth(this.context.vehicle);

        if (health > this.WARNING_THRESHOLD) {
            this.gracePeriod = 1;

            return true;
        } else if (health > this.FAIL_THRESHOLD) {
            this.gracePeriod = DrivingSchoolConfig.gracePeriodIncrement + 1;

            if (!this.playerWarned) {
                this.playerWarned = true;
                this.displayWarningMsg();
            }

            return true;
        }

        this.gracePeriod = DrivingSchoolConfig.maxGracePeriod;

        return false;
    }
}

class DeadPenalty extends Penalty {
    protected ignoreGracePeriod = true;

    protected failMsg = 'Pas de permis pour les morts...';

    public isValid(): boolean {
        const player = this.context.playerService.getPlayer();

        return !player.metadata.isdead;
    }
}

class OutOfVehiclePenalty extends Penalty {
    protected warningMsg = 'Remonte dans le vehicule !';
    protected failMsg = 'Pour passer le permis, il faut être DANS le véhicule !';

    public isValid(): boolean {
        const playerPed = GetPlayerPed(-1);

        return IsPedInAnyVehicle(playerPed, true) ? GetVehiclePedIsIn(playerPed, false) == this.context.vehicle : false;
    }
}

class OverspeedPenalty extends Penalty {
    public exclude = [DrivingSchoolLicenseType.Heli];

    private MAX_SPEED = 90.5;

    protected warningMsg = 'Attention à ta vitesse ! Ne dépasse pas les 90 km/h.';
    protected failMsg = "Tu n'as pas su maîtriser ta vitesse. On arrête là...";

    public isValid(): boolean {
        const speed = Math.ceil(GetEntitySpeed(this.context.vehicle) * 3.6);

        return speed < this.MAX_SPEED;
    }
}

class PhonePenalty extends Penalty {
    protected warningMsg = 'Range ce téléphone ! Regarde la route !';
    protected failMsg = 'Le téléphone est interdit au volant !';

    public isValid(): boolean {
        return !this.context.phoneService.isPhoneVisible();
    }
}

class SeatbeltPenalty extends Penalty {
    public exclude = [DrivingSchoolLicenseType.Moto];

    protected warningMsg = 'Boucle ta ceinture ! La sécurité avant tout.';
    protected failMsg = "La ceinture ce n'est pas pour les ienchs ! C'est terminé.";

    public isValid(): boolean {
        return this.context.seatbeltProvider.isSeatbeltOnForPlayer();
    }
}

class UndrivablePenalty extends Penalty {
    protected ignoreGracePeriod = true;

    protected failMsg = "C'est perdu ! Ce véhicule n'ira plus très loin...";

    public isValid(): boolean {
        return !this.context.undrivableVehicles.includes(this.context.vehicle);
    }
}

export const Penalties = [
    DamagePenalty,
    DeadPenalty,
    OutOfVehiclePenalty,
    OverspeedPenalty,
    PhonePenalty,
    SeatbeltPenalty,
    UndrivablePenalty,
];
