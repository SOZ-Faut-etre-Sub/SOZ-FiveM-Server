import { AtmConfig, AtmModels } from '../../config/bank';
import { Once, OnceStep, OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { AtmType, AtmUiData, BankAccount, BankActionType } from '../../shared/bank';
import { ClientEvent } from '../../shared/event/client';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { JobType } from '../../shared/job';
import { toVector2Object, Vector2 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { AnimationService } from '../animation/animation.service';
import { BlipFactory } from '../blip';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { BankAtmRepository } from '../repository/bank.atm.repository';
import { TargetFactory, TargetOptions } from '../target/target.factory';

@Provider()
export class BankAtmProvider {
    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BankAtmRepository)
    private bankAtmRepository: BankAtmRepository;

    @Inject(AnimationService)
    private animationService: AnimationService;

    private lastUsedAtm: Record<string, { lastUsed: Date; withdrawLimit: number }> = {};

    @OnNuiEvent(NuiEvent.BankAtmAction)
    public async depositAtmMoney({
        atmIdentifier,
        bankAccount,
        type,
        amount = 0,
    }: {
        atmIdentifier: string;
        bankAccount: string;
        type: BankActionType;
        amount: number;
    }) {
        const player = this.playerService.getPlayer();

        if (type === 'withdraw') {
            const atmAccount = await emitRpc<BankAccount>(RpcServerEvent.BANK_GET_ACCOUNT, bankAccount, 'bank_atm');
            if (!atmAccount) return;

            if (atmAccount.config.maxWithdrawal) {
                if (amount > atmAccount.config.maxWithdrawal) {
                    this.notifier.notify(
                        `Vous ne pouvez pas retirer plus de ~b~$${atmAccount.config.maxWithdrawal}~s~ depuis ce terminal`,
                        'error'
                    );
                    return;
                }

                const lastUse = this.lastUsedAtm[atmIdentifier];
                if (lastUse) {
                    const amountAvailable = atmAccount.config.maxWithdrawal - lastUse.withdrawLimit;
                    const remainingTime = atmAccount.config.limit + lastUse.lastUsed.getTime() - Date.now();

                    if (remainingTime > 0) {
                        if (amountAvailable == 0) {
                            this.notifier.notify(
                                `Limite de retrait atteinte : max. ~b~$${atmAccount.config.maxWithdrawal}~s~ par tranche de ${atmAccount.config.limit / 60000} minutes. Revenez dans ~b~${Math.ceil(remainingTime / 60000)} minutes~s~.`,
                                'error'
                            );
                            return;
                        } else if (amount > amountAvailable) {
                            this.notifier.notify(
                                `Limite de retrait atteinte : max. ~b~$${atmAccount.config.maxWithdrawal}~s~ par tranche de ${atmAccount.config.limit / 60000} minutes. ~b~$${amountAvailable}~s~ retirables.`,
                                'error'
                            );
                            return;
                        }
                    }
                }
            }

            const hasEnoughLiquidity = await emitRpc<boolean>(
                RpcServerEvent.BANK_ATM_REMOVE_LIQUIDITY,
                atmIdentifier.includes('atm_ent_') ? atmIdentifier : bankAccount,
                amount
            );
            if (!hasEnoughLiquidity) {
                this.notifier.notify('Liquidité insuffisante à ce terminal', 'error');
                return;
            }
        }

        const response = await emitRpc<boolean>(
            RpcServerEvent.BANK_CASH_TRANSFER_ACTION,
            type,
            player.charinfo.account,
            'money',
            amount
        );

        if (type === 'withdraw') {
            if (this.lastUsedAtm[atmIdentifier]) {
                this.lastUsedAtm[atmIdentifier].lastUsed = new Date();
                this.lastUsedAtm[atmIdentifier].withdrawLimit += amount;
            } else {
                this.lastUsedAtm[atmIdentifier] = {
                    lastUsed: new Date(),
                    withdrawLimit: amount,
                };
            }
        }

        return response;
    }

    @Once(OnceStep.RepositoriesLoaded)
    public async loadBankAtmBlips() {
        Object.entries(this.bankAtmRepository.raw()).forEach(([atm, { coords, hideBlip }]) => {
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
                            await this.animationService.playAnimation({
                                base: {
                                    dictionary: 'anim@mp_atm@enter',
                                    name: 'enter',
                                    blendInSpeed: 8.0,
                                    blendOutSpeed: -8.0,
                                    duration: 3000,
                                    options: {
                                        onlyUpperBody: true,
                                    },
                                    playbackRate: 0,
                                    lockX: false,
                                    lockY: false,
                                    lockZ: false,
                                },
                            });

                            const accountUiData = await emitRpc<AtmUiData>(
                                RpcServerEvent.BANK_ATM_GET_ACCOUNT_UI,
                                type,
                                GetEntityCoords(entity)
                            );
                            this.nuiDispatch.dispatch('bank_atm', 'ShowAtm', accountUiData);
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
                if (type === AtmType.ENTERPRISE) return false;

                const currentMoney = await emitRpc<number>(
                    RpcServerEvent.BANK_ATM_GET_MONEY,
                    type,
                    GetEntityCoords(entity)
                );
                if (currentMoney < AtmConfig[type].maxMoney) {
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
