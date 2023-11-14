import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { JobPermission, JobType } from '../../shared/job';
import { Err, Ok } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import { InputService } from '../nui/input.service';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';
import { JobService } from './job.service';

@Provider()
export class JobInvoiceProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InputService)
    private inputService: InputService;

    @Once(OnceStep.PlayerLoaded)
    public loadJobInvoiceProvider() {
        for (const job of this.jobService.getJobs()) {
            if (!job.canInvoice) {
                continue;
            }

            this.targetFactory.createForAllPlayer([
                {
                    label: `Facturer`,
                    icon: 'c:jobs/facture.png',
                    blackoutGlobal: true,
                    blackoutJob: job.id,
                    job: job.id,
                    color: job.id,
                    canInteract: () => {
                        const player = this.playerService.getPlayer();

                        if (!player) {
                            return false;
                        }

                        return player.job.onduty;
                    },
                    action: this.invoicePlayer.bind(this),
                },
                {
                    label: 'Facture la société',
                    icon: 'c:jobs/facture.png',
                    blackoutGlobal: true,
                    blackoutJob: job.id,
                    job: job.id,
                    color: job.id,
                    canInteract: async entity => {
                        const player = this.playerService.getPlayer();

                        if (!player || !player.job.onduty) {
                            return false;
                        }

                        if (!this.jobService.hasPermission(player.job.id, JobPermission.SocietyBankInvoices)) {
                            return false;
                        }
                        const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                        const targetJobType = await emitRpc<JobType>(RpcServerEvent.PLAYER_GET_JOB, targetSource);

                        const targetJob = this.jobService.getJob(targetJobType);

                        if (!targetJob) {
                            return false;
                        }

                        return targetJob.canReceiveSocietyInvoice;
                    },
                    action: this.invoicePlayerSociety.bind(this),
                },
            ]);
        }
    }

    public async invoicePlayer(entity: number) {
        const [title, amount] = await this.getTitleAndAmount();

        if (!title || !amount) {
            return;
        }

        const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
        TriggerServerEvent('banking:server:sendInvoice', targetSource, title, amount);
    }

    public async invoicePlayerSociety(entity: number) {
        const [title, amount] = await this.getTitleAndAmount();

        if (!title || !amount) {
            return;
        }

        const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
        TriggerServerEvent('banking:server:sendSocietyInvoice', targetSource, title, amount);
    }

    public async getTitleAndAmount(): Promise<[string, number]> {
        const title = await this.inputService.askInput(
            {
                title: 'Titre de la facture',
                maxCharacters: 200,
            },
            input => {
                if (input === null) {
                    return Ok(input);
                }

                if (input.length < 5) {
                    return Err('Le titre doit faire au moins 5 caractères');
                }

                return Ok(input);
            }
        );

        await wait(100);

        const amountString = await this.inputService.askInput(
            {
                title: 'Montant de la facture',
                maxCharacters: 10,
            },
            input => {
                if (input === null) {
                    return Ok(input);
                }

                const amount = parseInt(input);

                if (isNaN(amount) || amount <= 0) {
                    return Err('Le montant doit être un nombre positif');
                }

                return Ok(input);
            }
        );

        return [title, parseInt(amountString)];
    }
}
