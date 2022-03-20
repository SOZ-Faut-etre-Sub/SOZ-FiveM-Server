local radar_props = GetHashKey("soz_prop_radar")

local RadarMessage = {
    Title = "RADAR AUTOMATIQUE",
    FlashVehicle = "Votre véhicule a été flashé !",
    FlashPolice = "Un véhicule a été flashé !",
}

CreateThread(function()
    for _, radar in pairs(Config.Radars) do
        local prop = CreateObjectNoOffset(radar_props, radar.props.x, radar.props.y, radar.props.z, true, true, false)
        SetEntityHeading(prop, radar.props.w)
        FreezeEntityPosition(prop, true)
    end
end)

--- Event
RegisterNetEvent("police:client:radar:trigger", function(radarID, vehicleID, streetName)
    local Player = QBCore.Functions.GetPlayer(source)
    local radar = Config.Radars[radarID]
    local vehicle = NetworkGetEntityFromNetworkId(vehicleID)
    local vehicleModel = GetEntityModel(vehicle)
    local vehicleType = GetVehicleType(vehicle)
    local vehiclePlate = GetVehicleNumberPlateText(vehicle)
    local vehicleSpeed = GetEntitySpeed(vehicle) * 3.6
    local fine = QBCore.Shared.Round((vehicleSpeed - radar.speed) * 1.5)

    if vehicleSpeed - 5 > radar.speed then
        TriggerClientEvent("police:client:radar:flashed", Player.PlayerData.source)

        if GetPedInVehicleSeat(vehicle, -1) ~= GetPlayerPed(Player.PlayerData.source) then
            return
        end

        local radarMessage = ("Plaque: ~b~%s~s~~n~"):format(vehiclePlate)
        radarMessage = radarMessage .. ("Vitesse: ~r~%s km/h~s~ (~g~%s km/h~s~)~n~"):format(QBCore.Shared.Round(vehicleSpeed, 1), radar.speed)

        if Config.RadarAllowedVehicle[vehicleModel] then
            TriggerClientEvent("hud:client:DrawAdvancedNotification", Player.PlayerData.source, RadarMessage.Title, RadarMessage.FlashVehicle,
                               radarMessage .. "~g~Véhicule autorisé~s~", "CHAR_BLOCKED")

            return
        end

        MySQL.Async.fetchSingle("SELECT * FROM player_vehicles WHERE plate = ?", {vehiclePlate}, function(playerVehicle)
            radarMessage = radarMessage .. ("Amende: ~r~%s$~s~~n~"):format(fine)

            if playerVehicle then
                TriggerEvent("banking:server:TransfertMoney", Player.PlayerData.charinfo.account, radar.station, fine)

                if vehicleSpeed - radar.speed >= 40 then
                    local licences = Player.PlayerData.metadata["licences"]
                    local licenceType = "car"

                    if vehicleType == "bike" then
                        licenceType = "motorcycle"
                    elseif vehicleType == "truck" then
                        licenceType = "trailer"
                    end

                    if licences[licenceType] >= 1 then
                        licences[licenceType] = licences[licenceType] - 1

                        if licences[licenceType] >= 1 then
                            radarMessage = radarMessage .. "Point: ~r~-1 Point(s)~s~~n~"
                        else
                            radarMessage = radarMessage .. "~r~Retrait du permis~s~~n~"
                        end
                    else
                        radarMessage = radarMessage .. "~r~Aucun permis~s~~n~"
                    end

                    Player.Functions.SetMetaData("licences", licences)
                end
                TriggerClientEvent("hud:client:DrawAdvancedNotification", Player.PlayerData.source, RadarMessage.Title, RadarMessage.FlashVehicle, radarMessage,
                                   "CHAR_BLOCKED")
            else
                TriggerEvent("banking:server:TransfertMoney", Player.PlayerData.charinfo.account, radar.station, fine)
                TriggerClientEvent("hud:client:DrawAdvancedNotification", Player.PlayerData.source, RadarMessage.Title, RadarMessage.FlashVehicle,
                                   radarMessage .. "~r~Véhicule volé~s~", "CHAR_BLOCKED")
            end

            for _, Police in pairs(QBCore.Functions.GetQBPlayers()) do
                if Police.PlayerData.job.id == radar.station then
                    TriggerClientEvent("hud:client:DrawAdvancedNotification", Police.PlayerData.source, RadarMessage.Title, RadarMessage.FlashPolice,
                                       string.format("Plaque: ~b~%s~s~ ~n~Rue: ~b~%s~s~ ~n~Vitesse: ~r~%s km/h~s~", vehiclePlate, streetName,
                                                     QBCore.Shared.Round(vehicleSpeed, 1)), "CHAR_BLOCKED")
                end
            end
        end)
    end
end)
