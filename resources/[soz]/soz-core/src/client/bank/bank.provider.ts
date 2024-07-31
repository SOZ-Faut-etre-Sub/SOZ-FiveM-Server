import { AtmConfig, BankPedLocations } from '../../config/bank';
import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { BankUiData } from '../../shared/bank';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { JobType } from '../../shared/job';
import { toVector4Object } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { BlipFactory } from '../blip';
import { ItemService } from '../item/item.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { PlayerService } from '../player/player.service';
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
                    this.nuiDispatch.dispatch('bank', 'UpdateAccountData', accountUiData);
                    this.nuiDispatch.dispatch('bank', 'ShowAccount', true);
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
}
