import { AtmLocations } from '../../config/atm';
import { AtmConfig, AtmModels } from '../../config/bank';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { AtmType, AtmUiData, BankAccount, BankActionType } from '../../shared/bank';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { JobType } from '../../shared/job';
import { toVector2Object, Vector2, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { BlipFactory } from '../blip';
import { ItemService } from '../item/item.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { TargetFactory, TargetOptions } from '../target/target.factory';
import { BankService } from './bank.service';
import { BankWithdrawManager } from './bank.withdraw.manager';

@Provider()
export class BankAtmProvider {
    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(BankWithdrawManager)
    private bankWithdrawManager: BankWithdrawManager;

    @OnNuiEvent(NuiEvent.BankAtmAction)
    public async depositAtmMoney({
        atmIdentifier,
        bankAccount,
        type,
        amount = 0,
        atmType,
        atmCoords,
    }: {
        atmIdentifier: string;
        bankAccount: string;
        type: BankActionType;
        amount: number;
        atmType: AtmType;
        atmCoords: Vector3;
    }) {
        const player = this.playerService.getPlayer();

        if (type === 'withdraw') {
            const canWithdraw = await this.bankWithdrawManager.withdraw(atmIdentifier, bankAccount, atmType, amount);
            if (!canWithdraw) return;
        }

        const response = await emitRpc<boolean>(
            RpcServerEvent.BANK_CASH_TRANSFER_ACTION,
            type,
            player.charinfo.account,
            'money',
            amount
        );

        if (type === 'withdraw' && !response) {
            this.bankWithdrawManager.releaseWithdrawLimit(atmIdentifier, amount);
        }

        const accountUiData = await emitRpc<AtmUiData>(RpcServerEvent.BANK_ATM_GET_ACCOUNT_UI, atmType, atmCoords);
        this.nuiDispatch.dispatch('bank_atm', 'ShowAtm', { ...accountUiData, atmCoords });

        return response;
    }

    @Once(OnceStep.PlayerLoaded)
    public async loadBankAtmBlips() {
        Object.entries(AtmLocations).forEach(([atm, { coords, hideBlip }]) => {
            if (hideBlip) return;

            this.createAtmBlip(atm, coords);
        });
    }

    @Once(OnceStep.PlayerLoaded)
    public async loadBankAtmModels() {
        Object.entries(AtmModels).forEach(([model, type]) => {
            this.targetFactory.createForModel(
                model,
                [
                    {
                        label: 'Accéder aux comptes',
                        icon: 'c:bank/compte_personal.png',
                        action: async entity => {
                            TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500);
                            await wait(500);

                            await this.bankService.triggerAtmAnimation('enter');

                            const atmCoords = GetEntityCoords(entity) as Vector3;
                            const accountUiData = await emitRpc<AtmUiData>(
                                RpcServerEvent.BANK_ATM_GET_ACCOUNT_UI,
                                type,
                                atmCoords
                            );

                            this.nuiDispatch.dispatch('bank_atm', 'ShowAtm', { ...accountUiData, atmCoords });
                        },
                        blackoutGlobal: true,
                    },
                    this.createAtmRefillAction(type, 'small_moneybag'),
                    this.createAtmRefillAction(type, 'medium_moneybag'),
                    this.createAtmRefillAction(type, 'big_moneybag'),
                ],
                1.0
            );
        });
    }

    public createAtmRefillAction(type: AtmType, item: string): TargetOptions {
        return {
            label: `Remplir avec ${this.itemService.getItem(item).label}`,
            icon: 'c:stonk/remplir.png',
            canInteract: async entity => {
                if (type !== AtmType.ENTERPRISE) return false;

                const account = await emitRpc<BankAccount>(
                    RpcServerEvent.BANK_ATM_GET_ACCOUNT,
                    type,
                    GetEntityCoords(entity)
                );
                if (account.money < AtmConfig[account.config.type].maxMoney) {
                    return this.playerService.isOnDuty();
                }

                return false;
            },
            action: async entity => {
                const account = await emitRpc<BankAccount>(
                    RpcServerEvent.BANK_ATM_GET_ACCOUNT,
                    type,
                    GetEntityCoords(entity)
                );
                if (!account) return;

                const maxMoney = AtmConfig[type].maxMoney;

                TriggerServerEvent(ServerEvent.STONK_FILL_IN, account.id, item, maxMoney);
            },
            blackoutGlobal: true,
            blackoutJob: JobType.CashTransfer,
            job: JobType.CashTransfer,
            item,
        };
    }

    @OnEvent(ClientEvent.BANK_ATM_CREATED)
    public createAtmBlip(atm: string, coords: Vector2) {
        if (this.blipFactory.exist(atm)) {
            this.blipFactory.remove(atm);
        }

        this.blipFactory.create(atm, {
            name: 'ATM',
            coords: toVector2Object(coords),
            sprite: 278,
            color: 60,
            alpha: 100,
        });
    }
}
