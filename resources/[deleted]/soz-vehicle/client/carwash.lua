GlobalVehicle = nil

RegisterNetEvent("qb-carwash:client:washCar", function()
    local ped = PlayerPedId()
    QBCore.Functions.Progressbar("cleaning_vehicle", "Lavage du véhicule...", 10000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {task = "WORLD_HUMAN_MAID_CLEAN"}, {}, {}, function() -- Done
        exports["soz-hud"]:DrawNotification("Vehicule lavé!")
        SetVehicleDirtLevel(GlobalVehicle)
        SetVehicleUndriveable(GlobalVehicle, false)
        WashDecalsFromVehicle(GlobalVehicle, 1.0)
        local newcondition = exports["soz-vehicle"]:PropertiesToCondition(QBCore.Functions.GetVehicleProperties(GlobalVehicle))
        Entity(GlobalVehicle).state:set("condition", json.encode(newcondition), true)
    end, function() -- Cancel
        exports["soz-hud"]:DrawNotification("Lavage échoué")
    end)
end)

ZonesCarwash = {
    ["carwash1"] = BoxZone:Create(vector3(-699.68, -933.16, 19.01), 12, 6, {
        name = "carwash1",
        heading = 0,
        minZ = 18.01,
        maxZ = 22.01,
    }),
    ["carwash2"] = BoxZone:Create(vector3(24.63, -1391.91, 29.35), 12, 7, {
        name = "carwash2",
        heading = 270,
        minZ = 28.35,
        maxZ = 32.35,
    }),
    ["carwash3"] = BoxZone:Create(vector3(175.31, -1736.71, 29.29), 10, 10, {
        name = "carwash3",
        heading = 0,
        minZ = 28.29,
        maxZ = 32.29,
    }),
    ["carwash4"] = BoxZone:Create(vector3(-75.24, 6429.37, 31.5), 12, 12, {
        name = "carwash4",
        heading = 45,
        minZ = 30.5,
        maxZ = 34.5,
    }),
    ["carwash5"] = BoxZone:Create(vector3(1361.11, 3594.16, 34.89), 10, 14, {
        name = "carwash5",
        heading = 290,
        minZ = 33.89,
        maxZ = 37.89,
    }),
}

InsideCarwash = false

for indexcarwash, carwash in pairs(ZonesCarwash) do
    carwash:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
        if isPointInside then
            InsideCarwash = true
        else
            InsideCarwash = false
        end
    end)
end

CreateThread(function()
    for k, v in pairs(Config.CarWash) do
        local carWash = AddBlipForCoord(Config.CarWash[k]["coords"]["x"], Config.CarWash[k]["coords"]["y"], Config.CarWash[k]["coords"]["z"])
        SetBlipSprite(carWash, 100)
        SetBlipDisplay(carWash, 4)
        SetBlipScale(carWash, 0.8)
        SetBlipAsShortRange(carWash, true)
        SetBlipColour(carWash, 37)
        SetBlipAlpha(carWash, 100)
        BeginTextCommandSetBlipName("STRING")
        AddTextComponentSubstringPlayerName(Config.CarWash[k]["label"])
        EndTextCommandSetBlipName(carWash)
    end
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                type = "client",
                icon = "c:mechanic/Car_wash.png",
                label = "Carwash",
                action = function(entity)
                    GlobalVehicle = entity
                    TriggerServerEvent("qb-carwash:server:washCar")
                end,
                canInteract = function(entity, distance, data)
                    return InsideCarwash
                end,
                blackoutGlobal = true,
            },
        },
        distance = 3.0,
    })
end)
