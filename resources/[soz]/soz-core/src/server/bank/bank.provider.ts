import { Rpc } from '@public/core/decorators/rpc';
import { RpcServerEvent } from '@public/shared/rpc';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { JobType } from '../../shared/job';
import { isOk } from '../../shared/result';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { JobGradeRepository } from '../repository/job.grade.repository';
import { ServerStateService } from '../server.state.service';
import { BankService } from './bank.service';

const SENATOR_SALARY = 400;

@Provider()
export class BankProvider {
    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    @Inject(JobGradeRepository)
    private jobGradeRepository: JobGradeRepository;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(Notifier)
    private notifier: Notifier;

    @Rpc(RpcServerEvent.BANK_GET_ACCOUNT)
    public async getBankAccount(source: number, citizenId): Promise<string> {
        return await this.bankService.getAccountid(citizenId);
    }

    @Tick(20 * 60 * 1000)
    public async paycheckLoop() {
        const players = this.serverStateService.getPlayers();

        for (const player of players) {
            if (player.metadata.injail) {
                continue;
            }

            if (!player.job) {
                continue;
            }

            const grade = await this.jobGradeRepository.find(Number(player.job.grade));

            if (!grade) {
                continue;
            }

            let payment = grade.salary;

            if (payment <= 0) {
                continue;
            }

            if (player.job.id === JobType.Unemployed) {
                this.bankService.addAccountMoney(player.charinfo.account, payment, 'money', true);

                this.notifier.advancedNotify(
                    player.source,
                    'Maze Banque',
                    'Mouvement bancaire',
                    `Votre salaire de Votre salaire ~g~${payment}$~s~ a été versé sur votre compte bancaire.`,
                    'CHAR_BANK_MAZE'
                );

                this.monitor.publish(
                    'paycheck',
                    {
                        player_source: player.source,
                    },
                    {
                        amount: payment,
                    }
                );
            } else {
                if (!player.job.onduty) {
                    payment = Math.ceil(payment * 0.3);
                }

                const result = await this.bankService.transferBankMoney(
                    player.job.id,
                    player.charinfo.account,
                    payment
                );

                if (isOk(result)) {
                    this.notifier.advancedNotify(
                        player.source,
                        'Maze Banque',
                        'Mouvement bancaire',
                        `Votre salaire  ~g~${
                            player.job.onduty ? 'en service' : 'hors-service'
                        }~s~ de ~g~${payment}$~s~ a été versé sur votre compte bancaire.`,
                        'CHAR_BANK_MAZE'
                    );

                    this.monitor.publish(
                        'paycheck',
                        {
                            player_source: player.source,
                        },
                        {
                            amount: payment,
                        }
                    );
                }
            }

            if (player.metadata.is_senator) {
                const result = await this.bankService.transferBankMoney(
                    'gouv',
                    player.charinfo.account,
                    SENATOR_SALARY
                );
                if (isOk(result)) {
                    this.notifier.advancedNotify(
                        player.source,
                        'Maze Banque',
                        'Mouvement bancaire',
                        `Votre indemnité de ~g~sénateur~s~ de ~g~${SENATOR_SALARY}$~s~ a été versé sur votre compte bancaire.`,
                        'CHAR_BANK_MAZE'
                    );

                    this.monitor.publish(
                        'senator_paycheck',
                        {
                            player_source: player.source,
                        },
                        {
                            amount: SENATOR_SALARY,
                        }
                    );
                }
            }
        }
    }
}
