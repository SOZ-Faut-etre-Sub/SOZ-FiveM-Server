import { Feature } from '@public/shared/features';
import { JobPermission, JobType } from '@public/shared/job';

import { SocietySafeStorage, SocietySafeStorageWhatIf } from '../../config/bank';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { AtmType, BankAccount, BankAccountType, BankActionType, BankMoneyType, BankUiData } from '../../shared/bank';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { RpcServerEvent } from '../../shared/rpc';
import { FeatureProvider } from '../feature/feature.provider';
import { JobService } from '../job/job.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { TargetFactory } from '../target/target.factory';
import { BankWithdrawManager } from './bank.withdraw.manager';

@Provider()
export class BankSafeProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BankWithdrawManager)
    private bankWithdrawManager: BankWithdrawManager;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Once(OnceStep.PlayerLoaded)
    public async init() {
        SocietySafeStorage.forEach((zone, index) => {
            if (this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode)) {
                const override = SocietySafeStorageWhatIf[zone.data];
                if (override) {
                    zone = override;
                }
            }

            this.targetFactory.createForBoxZone(
                `bank:safe:${zone.data}_${index}`,
                BoxZone.fromZone(zone),
                [
                    {
                        label: 'Ouvrir',
                        icon: 'bank/compte_safe',
                        category: 'citizen',
                        action: async entity => {
                            TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500);
                            await wait(500);

                            const safe = await emitRpc<BankAccount>(
                                RpcServerEvent.BANK_GET_ACCOUNT,
                                `safe_${zone.data}`,
                                'safestorages'
                            );

                            if (!safe) return;

                            this.nuiDispatch.dispatch('bank_safe', 'UpdateAccountData', safe);
                            this.nuiDispatch.dispatch('bank_safe', 'ShowSafe', true);
                        },
                        canInteract: () => {
                            const playerJobId = this.playerService.getPlayer().job.id;
                            const hasPermission =
                                playerJobId === JobType.CashTransfer &&
                                playerJobId !== zone.data &&
                                this.jobService.hasPermission(
                                    JobType.CashTransfer,
                                    JobPermission.CashTransfer_AccountAccess
                                );
                            const isSameJob =
                                playerJobId === zone.data &&
                                this.jobService.hasPermission(playerJobId, JobPermission.SocietyMoneyStorage);
                            return hasPermission || isSameJob;
                        },
                        job: { [zone.data]: 0, [JobType.CashTransfer]: 0 },
                    },
                ],
                2.5
            );
        });
    }

    @OnNuiEvent(NuiEvent.BankSafeTransferAction)
    public async onTransferAction({
        type,
        accountId,
        moneyType,
        amount = 0,
        bankType,
        refreshNui,
    }: {
        type: BankActionType;
        accountId: string;
        moneyType: BankMoneyType;
        amount: number;
        bankType: string;
        refreshNui: 'bank' | BankAccountType;
    }) {
        if (bankType && type === 'withdraw') {
            const canConsume = await this.bankWithdrawManager.withdraw(
                bankType,
                `bank_${bankType}`,
                bankType.replace(/[0-9]+/, '') as AtmType,
                amount
            );
            if (!canConsume) return;
        }

        const result = await emitRpc<boolean>(
            RpcServerEvent.BANK_CASH_TRANSFER_ACTION,
            type,
            accountId,
            moneyType,
            amount
        );
        if (bankType && type === 'withdraw' && !result) {
            this.bankWithdrawManager.releaseWithdrawLimit(bankType, amount);
        }
        if (!result) return;

        if (refreshNui === 'bank') {
            const account = await emitRpc<BankUiData>(RpcServerEvent.BANK_GET_ACCOUNT_UI);
            if (!account) return;

            this.nuiDispatch.dispatch('bank', 'UpdateAccountData', {
                ...account,
                bankType: bankType,
            });
        } else {
            const account = await emitRpc<BankAccount>(RpcServerEvent.BANK_GET_ACCOUNT, accountId, refreshNui);
            if (!account) return;

            this.nuiDispatch.dispatch('bank_safe', 'UpdateAccountData', account);
        }

        return true;
    }

    @OnEvent(ClientEvent.BANK_SAFE_HOUSE_OPEN_UI)
    public async onHouseOpenUI(identifier: string) {
        const safe = await emitRpc<BankAccount>(RpcServerEvent.BANK_GET_ACCOUNT, identifier, 'housestorages');
        if (!safe) return;

        this.nuiDispatch.dispatch('bank_safe', 'UpdateAccountData', safe);
        this.nuiDispatch.dispatch('bank_safe', 'ShowSafe', true);
    }

    public async onGangOpenUI(identifier: string) {
        const safe = await emitRpc<BankAccount>(RpcServerEvent.BANK_GET_ACCOUNT, identifier, 'gang');
        if (!safe) return;

        this.nuiDispatch.dispatch('bank_safe', 'UpdateAccountData', safe);
        this.nuiDispatch.dispatch('bank_safe', 'ShowSafe', true);
    }
}
