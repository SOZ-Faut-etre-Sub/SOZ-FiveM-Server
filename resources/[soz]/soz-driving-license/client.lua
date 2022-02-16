local QBCore = exports["qb-core"]:GetCoreObject()

Citizen.CreateThread(function()
    -- Blip
    if not QBCore.Functions.GetBlip("driving_school") then
        local blipCoords = Config.Peds.secretary
        QBCore.Functions.CreateBlip("driving_school", {
            name = Config.BlipName,
            coords = vector2(blipCoords.x, blipCoords.y),
            sprite = Config.BlipSprite,
            color = Config.BlipColor
        })
    end

    -- Format licenses target options
    local options = {}
    for _, data in pairs(Config.Licenses) do
        table.insert(options, {
            event = data.event,
            icon = data.icon,
            label = string.format(data.label, data.price)
        })
    end

    -- Secretary Ped
    local sData = Config.Peds.secretary
    exports["qb-target"]:SpawnPed({
        {
            spawnNow = true,
            model = sData.modelHash,
            coords = vector4(sData.x, sData.y, sData.z, sData.rotation),
            minusOne = true,
            freeze = true,
            invincible = true,
            blockevents = true,
            scenario = "WORLD_HUMAN_CLIPBOARD",
            target = {
                options = options,
                distance = 2.5,
            },
        },
    })
end)

-- TODO To be moved elsewhere
local function setupModel(model)
    RequestModel(model)
    while not HasModelLoaded(model) do
        RequestModel(model)
        Citizen.Wait(0)
    end
end

---Test wether or not spawn location is already occupied
---@param x number
---@param y number
---@param z number
local function IsSpawnPointFree(x, y, z)
    return not IsPositionOccupied(x, y, z, 0.25, false, true, true, false, false, 0, false)
end

AddEventHandler("soz-driving-license:client:start_car", function()
    Citizen.CreateThread(function ()
        -- Check if spawn location is free
        local vData = Config.Licenses["car"].vehicle
        if not vData then return end
        if not IsSpawnPointFree(vData.x, vData.y, vData.z) then
            TriggerEvent(
                "hud:client:DrawNotification",
                "~r~Parking encombré, l'instructeur ne peut pas garer le véhicule d'examen."
            )
            return
        end

        -- Make player pay
        TriggerServerEvent("soz-driving-license:server:pay", "car")
    end)
end)

RegisterNetEvent("soz-driving-license:client:spawn_car", function()
    Citizen.CreateThread(function ()
        -- Fade to black screen
        local fadeDelay = 500
        DoScreenFadeOut(fadeDelay)
        Citizen.Wait(fadeDelay)

        -- Instructor Ped
        local iData = Config.Peds.instructor
        setupModel(iData.modelHash)
        local instructor = CreatePed(
            4, iData.modelHash,
            iData.x, iData.y, iData.z - 1, iData.rotation,
            iData.networkSync, false
        )

        SetModelAsNoLongerNeeded(iData.modelHash)
        SetEntityAsNoLongerNeeded(instructor)

        SetBlockingOfNonTemporaryEvents(instructor, true)
        SetEntityInvincible(instructor, true)

        local playerPed = PlayerPedId()

        -- Spawn car
        local vData = Config.Licenses["car"].vehicle
        setupModel(vData.modelHash)
        local vehicle = CreateVehicle(
            vData.modelHash,
            vData.x, vData.y, vData.z, vData.rotation,
            true, false
        )

        SetModelAsNoLongerNeeded(vData.modelHash)
        SetEntityAsNoLongerNeeded(vehicle)

        SetPedIntoVehicle(playerPed, vehicle, -1)
        SetPedIntoVehicle(instructor, vehicle, 0)
        SetVehicleNumberPlateText(vehicle, "P3RM15")
        SetVehicleDoorsLockedForPlayer(vehicle, playerPed, false)
        SetVehRadioStation(vehicle, "OFF")

        -- Clear black screen
        DoScreenFadeIn(fadeDelay)
    end)
end)
