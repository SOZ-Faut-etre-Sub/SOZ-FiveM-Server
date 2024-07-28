import { AtmConfig, AtmModels, BankPedLocations } from '../../config/bank';
import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { AtmType, BankAccount, BankUiData } from '../../shared/bank';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { JobType } from '../../shared/job';
import { toVector2Object, toVector4Object, Vector2 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { BlipFactory } from '../blip';
import { ItemService } from '../item/item.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
import { BankAtmRepository } from '../repository/bank.atm.repository';
import { TargetFactory, TargetOptions } from '../target/target.factory';

@Provider()
export class BankProvider {
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

    @Inject(BankAtmRepository)
    private bankAtmRepository: BankAtmRepository;

    protected currentBank: { bank: string; type: string } = null;

    @OnEvent(ClientEvent.LOCATION_ENTER)
    public onLocationEnter(type: string, name: string) {
        if (!BankPedLocations[name]) return;

        const bankType = name.match('[a-z]+')?.[0];
        if (!bankType) return;

        this.currentBank = { bank: name, type: bankType };
    }

    @OnEvent(ClientEvent.LOCATION_EXIT)
    public onLocationExit(type: string, name: string) {
        if (!BankPedLocations[name]) return;

        this.currentBank = null;
    }

    @Once(OnceStep.PlayerLoaded)
    public async loadBankPedModels() {
        const bankActions: TargetOptions[] = [
            {
                label: 'Accéder aux comptes',
                icon: 'c:bank/compte_personal.png',
                action: async () => {
                    const accountUiData = await emitRpc<BankUiData>(RpcServerEvent.BANK_GET_ACCOUNT_UI);
                    this.nuiDispatch.dispatch('bank', 'ShowAccount', accountUiData);
                },
                blackoutGlobal: true,
            },
        ];

        ['small_moneybag', 'medium_moneybag', 'big_moneybag'].forEach(item => {
            bankActions.push({
                label: `Remplir avec ${this.itemService.getItem(item).label}`,
                icon: 'c:stonk/remplir.png',
                canInteract: async () => {
                    if (!this.currentBank) return;

                    const currentMoney = await emitRpc<number>(
                        RpcServerEvent.BANK_GET_ACCOUNT_MONEY,
                        `bank_${this.currentBank.bank}`
                    );
                    if (currentMoney < AtmConfig[this.currentBank.type].maxMoney) {
                        return this.playerService.isOnDuty();
                    }

                    return false;
                },
                action: () => {
                    if (!this.currentBank) return;

                    const maxMoney = AtmConfig[this.currentBank.type].maxMoney;
                    TriggerServerEvent(ServerEvent.STONK_FILL_IN, `bank_${this.currentBank.bank}`, item, maxMoney);
                },
                blackoutGlobal: true,
                blackoutJob: JobType.CashTransfer,
                job: JobType.CashTransfer,
                item,
            });
        });

        Object.entries(BankPedLocations).forEach(([bank, coords]) => {
            if (!this.blipFactory.exist(`bank_${bank}`)) {
                if (bank === 'pacific1') {
                    this.blipFactory.create(`bank_${bank}`, {
                        name: 'Pacific Bank',
                        coords: toVector4Object(coords),
                        sprite: 108,
                        color: 28,
                        scale: 1.0,
                    });
                } else if (bank.startsWith('fleeca')) {
                    this.blipFactory.create(`bank_${bank}`, {
                        name: 'Banque',
                        coords: toVector4Object(coords),
                        sprite: 108,
                        color: 2,
                    });
                }
            }

            this.targetFactory.createForPed({
                model: 'ig_bankman',
                coords: toVector4Object(coords),
                freeze: true,
                invincible: true,
                blockevents: true,
                scenario: 'WORLD_HUMAN_CLIPBOARD',
                target: {
                    options: bankActions,
                    distance: 3.0,
                },
            });
        });
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
                        action: async () => {
                            const accountUiData = await emitRpc<BankUiData>(RpcServerEvent.BANK_GET_ACCOUNT_UI);
                            this.nuiDispatch.dispatch('bank', 'ShowAccount', accountUiData);
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
