local radar_props = GetHashKey("soz_prop_radar")

local RadarMessage = {
    Title = "RADAR AUTOMATIQUE",
    FlashVehicle = "Votre véhicule a été flashé !",
    FlashPolice = "Un véhicule a été flashé !",
}

CreateThread(function()
    for _, radar in pairs(Config.Radars) do
        exports["soz-utils"]:CreateObject(radar_props, radar.props.x, radar.props.y, radar.props.z, radar.props.w, 8000.0, true)
    end
end)

--- Event
RegisterNetEvent("police:client:radar:trigger", function(radarID, vehicleID, vehicleClass, streetName)
    local Player = QBCore.Functions.GetPlayer(source)
    local radar = Config.Radars[radarID]
    local vehicle = NetworkGetEntityFromNetworkId(vehicleID)
    local vehicleModel = GetEntityModel(vehicle)
    local vehicleType = GetVehicleType(vehicle)
    local vehiclePlate = GetVehicleNumberPlateText(vehicle)
    local vehicleSpeed = GetEntitySpeed(vehicle) * 3.6
    local vehiclePosition = GetEntityCoords(vehicle)
    local fine = QBCore.Shared.Round((vehicleSpeed - radar.speed) * 1.5)

    if not radar.isOnline then
        return
    end

    if vehicleSpeed - 5 > radar.speed then
        if GetPedInVehicleSeat(vehicle, -1) ~= GetPlayerPed(Player.PlayerData.source) then
            return
        end
        TriggerClientEvent("police:client:radar:flashed", Player.PlayerData.source)

        local radarMessage = ("Plaque: ~b~%s~s~~n~"):format(vehiclePlate)
        radarMessage = radarMessage .. ("Vitesse: ~r~%s km/h~s~ (~g~%s km/h~s~)~n~"):format(QBCore.Shared.Round(vehicleSpeed), radar.speed)

        if Config.RadarAllowedVehicle[vehicleModel] then
            TriggerClientEvent("hud:client:DrawAdvancedNotification", Player.PlayerData.source, RadarMessage.Title, RadarMessage.FlashVehicle,
                               radarMessage .. "~g~Véhicule autorisé~s~", "CHAR_BLOCKED", "info")
            return
        end

        radarMessage = radarMessage .. ("Amende: ~r~%s$~s~~n~"):format(fine)
        local licenceAction = "no_action"

        if vehicleSpeed - radar.speed >= 40 then
            local licences = Player.PlayerData.metadata["licences"]
            local licenceType = "car"

            if vehicleType == "bike" or vehicleClass == 8 then
                licenceType = "motorcycle"
            elseif vehicleType == "automobile" and (vehicleClass == 10 or vehicleClass == 17 or vehicleClass == 20) then
                licenceType = "truck"
            elseif vehicleType == "boat" or vehicleType == "heli" then
                licenceType = vehicleType
            end

            if licences[licenceType] >= 1 then
                licences[licenceType] = licences[licenceType] - 1

                if licences[licenceType] >= 1 then
                    licenceAction = "remove_point"
                    radarMessage = radarMessage .. "Point: ~r~-1 Point(s)~s~~n~"
                else
                    licenceAction = "remove_licence"
                    radarMessage = radarMessage .. "~r~Retrait du permis~s~~n~"
                end
            else
                licenceAction = "no_licence"
                radarMessage = radarMessage .. "~r~Aucun permis~s~~n~"
            end

            Player.Functions.SetMetaData("licences", licences)
        end

        TriggerEvent("monitor:server:event", "radar_flash", {
            player_source = Player.PlayerData.source,
            radar_id = radarID,
            vehicle_plate = vehiclePlate,
        }, {
            licence_action = licenceAction,
            amount = fine,
            vehicle_speed = vehicleSpeed,
            vehicle_model = vehicleModel,
            vehicle_type = vehicleType,
            position = vehiclePosition,
        })

        TriggerEvent("banking:server:TransferMoney", Player.PlayerData.charinfo.account, radar.station, fine)
        TriggerClientEvent("hud:client:DrawAdvancedNotification", Player.PlayerData.source, RadarMessage.Title, RadarMessage.FlashVehicle, radarMessage,
                           "CHAR_BLOCKED", "info")

        for _, Police in pairs(QBCore.Functions.GetQBPlayers()) do
            if Police.PlayerData.job.id == radar.station then
                local currentVehicle = GetVehiclePedIsIn(GetPlayerPed(Police.PlayerData.source), false)
                if currentVehicle ~= 0 and Config.RadarAllowedVehicle[GetEntityModel(currentVehicle)] then
                    TriggerClientEvent("hud:client:DrawAdvancedNotification", Police.PlayerData.source, RadarMessage.Title, RadarMessage.FlashPolice,
                                       string.format("Plaque: ~b~%s~s~ ~n~Rue: ~b~%s~s~ ~n~Vitesse: ~r~%s km/h~s~", vehiclePlate, streetName,
                                                     QBCore.Shared.Round(vehicleSpeed)), "CHAR_BLOCKED", "info")
                end
            end
        end
    end
end)
