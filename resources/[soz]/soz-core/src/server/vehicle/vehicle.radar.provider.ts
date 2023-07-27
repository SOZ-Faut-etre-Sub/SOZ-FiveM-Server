import { RadarAllowedVehicle, RadarInformedVehicle, RadarList } from '../../config/radar';
import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { JobType } from '../../shared/job';
import { PlayerLicenceType } from '../../shared/player';
import { BankService } from '../bank/bank.service';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { VehicleRepository } from '../repository/vehicle.repository';
import { VehicleStateService } from './vehicle.state.service';

const RadarMessage = {
    Title: 'RADAR AUTOMATIQUE',
    FlashVehicle: 'Votre véhicule a été flashé !',
    FlashPolice: 'Un véhicule a été flashé !',
};

@Provider()
export class VehicleRadarProvider {
    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VehicleStateService)
    vehicleStateService: VehicleStateService;

    @OnEvent(ClientEvent.VEHICLE_RADAR_TRIGGER)
    public async radarTrigger(
        source: number,
        radarID: number,
        vehicleID: number,
        vehicleClass: number,
        streetName: string
    ) {
        const player = this.playerService.getPlayer(source);
        const radar = RadarList[radarID];
        const vehicle = NetworkGetEntityFromNetworkId(vehicleID);
        const vehicleSpeed = Math.round(GetEntitySpeed(vehicle) * 3.6);
        const state = this.vehicleStateService.getVehicleState(vehicleID);
        const vehiclePlate = state.volatile.plate || GetVehicleNumberPlateText(vehicle);
        const vehicleModel = GetEntityModel(vehicle);
        const fine = Math.round((vehicleSpeed - radar.speed) * 10);
        const vehicleType = GetVehicleType(vehicle);
        const vehiclePosition = GetEntityCoords(vehicle);

        if (vehicleSpeed - 5 > radar.speed) {
            TriggerClientEvent(ClientEvent.VEHICLE_RADAR_FLASHED, source);

            let radarMessage = `Plaque: ~b~${vehiclePlate}~s~~n~`;
            radarMessage += `Vitesse: ~r~${vehicleSpeed} km/h~s~ (~g~${radar.speed} km/h~s~)~n~`;

            if (RadarAllowedVehicle.includes(vehicleModel)) {
                this.notifier.advancedNotify(
                    source,
                    RadarMessage.Title,
                    RadarMessage.FlashVehicle,
                    radarMessage + '~g~Véhicule autorisé~s~',
                    'CHAR_BLOCKED',
                    'info'
                );
                return;
            }

            const dbInfo = await this.prismaService.radar.findUnique({
                where: {
                    id: radarID,
                },
            });

            let record = 0;
            if (dbInfo) {
                record = dbInfo.speed_record;
                radarMessage =
                    radarMessage +
                    `Record: ~b~${await this.playerService.getNameFromCitizenId(dbInfo.citizedid_record)}~s~ ~o~${
                        dbInfo.speed_record
                    }km/h~s~~n~`;
            } else {
                await this.prismaService.radar.create({
                    data: {
                        id: radarID,
                        citizedid_record: player.citizenid,
                        speed_record: vehicleSpeed,
                    },
                });
            }

            if (vehicleSpeed > record) {
                await this.prismaService.radar.update({
                    where: {
                        id: radarID,
                    },
                    data: {
                        citizedid_record: player.citizenid,
                        speed_record: vehicleSpeed,
                    },
                });
            }

            radarMessage = radarMessage + `Amende: ~r~${fine}$~s~~n~`;
            let licenceAction = 'no_action';

            if (vehicleSpeed - radar.speed >= 20) {
                const licences = player.metadata['licences'];
                const vehicleDB = await this.vehicleRepository.findByHash(vehicleModel);

                let licenceType = PlayerLicenceType.Car;
                if (vehicleDB) {
                    licenceType = vehicleDB.requiredLicence as PlayerLicenceType;
                } else if (vehicleType == 'bike' || vehicleClass == 8) {
                    licenceType = PlayerLicenceType.Moto;
                } else if (
                    vehicleType == 'automobile' &&
                    (vehicleClass == 10 || vehicleClass == 17 || vehicleClass == 20)
                ) {
                    licenceType = PlayerLicenceType.Truck;
                } else if (vehicleType == 'heli') {
                    licenceType = PlayerLicenceType.Heli;
                } else if (vehicleType == 'boat') {
                    licenceType = PlayerLicenceType.Boat;
                }

                if (licences[licenceType] >= 1) {
                    licences[licenceType] = licences[licenceType] - 1;

                    if (licences[licenceType] >= 1) {
                        licenceAction = 'remove_point';
                        radarMessage = radarMessage + 'Point: ~r~-1 Point(s)~s~~n~';
                    } else {
                        licenceAction = 'remove_licence';
                        radarMessage = radarMessage + '~r~Retrait du permis~s~~n~';
                    }
                } else {
                    licenceAction = 'no_licence';
                    radarMessage = radarMessage + '~r~Aucun permis~s~~n~';
                }

                this.playerService.setPlayerMetadata(source, 'licences', licences);
            }

            TriggerEvent(
                'monitor:server:event',
                'radar_flash',
                {
                    player_source: source,
                    radar_id: radarID,
                    vehicle_plate: vehiclePlate,
                },
                {
                    licence_action: licenceAction,
                    amount: fine,
                    vehicle_speed: vehicleSpeed,
                    vehicle_model: vehicleModel,
                    vehicle_type: vehicleType,
                    position: vehiclePosition,
                }
            );

            this.bankService.transferBankMoney(player.charinfo.account, JobType.LSPD, Math.round(fine / 2));
            this.bankService.transferBankMoney(player.charinfo.account, JobType.BCSO, fine - Math.round(fine / 2));

            this.notifier.advancedNotify(
                source,
                RadarMessage.Title,
                RadarMessage.FlashVehicle,
                radarMessage,
                'CHAR_BLOCKED',
                'info'
            );

            this.notifier.advancedNotifyOnDutyWorkers(
                RadarMessage.Title,
                RadarMessage.FlashPolice,
                `Plaque: ~b~${vehiclePlate}~s~ ~n~Rue: ~b~${streetName}~s~ ~n~Vitesse: ~r~${vehicleSpeed} km/h~s~`,
                'CHAR_BLOCKED',
                'info',
                [JobType.BCSO, JobType.LSPD],
                player => {
                    const currentVehicle = GetVehiclePedIsIn(GetPlayerPed(player.source), false);
                    if (currentVehicle && RadarInformedVehicle.includes(GetEntityModel(currentVehicle))) {
                        const ped = GetPlayerPed(player.source);
                        return (
                            GetPedInVehicleSeat(currentVehicle, -1) == ped ||
                            GetPedInVehicleSeat(currentVehicle, 0) == ped
                        );
                    }
                    return false;
                }
            );
        }
    }
}
