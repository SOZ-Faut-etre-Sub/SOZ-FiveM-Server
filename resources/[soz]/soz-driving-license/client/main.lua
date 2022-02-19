local QBCore = exports["qb-core"]:GetCoreObject()

local playerInsideZone = false -- Is player inside for for NPC interaction ?
local passingExam = false -- Is a driving exam running ?

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
            label = string.format(data.label, data.price),
            canInteract = function()
                return playerInsideZone
            end,
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
                distance = 1.5,
            },
        },
    })

    -- BoxZone
    local zone = BoxZone:Create(vector3(sData.x, sData.y, sData.z), 3.0, 3.0, {
        name = "drivingschool",
        heading = sData.rotation,
    })
    zone:onPlayerInOut(function (isInside)
        playerInsideZone = isInside
    end)

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

---Get next checkpoint in table
---@param tbl table Checkpoints table
---@param pop boolean Should table item be poped
---@return table
local function getNextCheckpoint(tbl, pop)
    if not next(tbl) then return {x = 0.0, y = 0.0, z = 0.0} end

    local cp = tbl[1]
    if pop then table.remove(tbl, 1) end

    return cp
end

---Display checkpoint, waypoint and message to player
---@param checkpoint table Checkpoint to be displayed
---@param nextCheckpoint table Following checkpoint
---@return number
local function DisplayCheckpoint(checkpoint, nextCheckpoint)
    -- Draw Checkpoint
    local cpColor = Config.CheckpointColor
    local cpSize = Config.CheckpointSize
    local cpId = CreateCheckpoint(
        Config.CheckpointType,
        checkpoint.x, checkpoint.y, checkpoint.z,
        nextCheckpoint.x or 0.0, nextCheckpoint.y or 0.0, nextCheckpoint.z or 0.0,
        cpSize,
        cpColor.r, cpColor.g, cpColor.b, cpColor.a, 0
    )
    SetCheckpointCylinderHeight(cpId, cpSize, cpSize, cpSize)

    -- Add GPS waypoint
    SetNewWaypoint(checkpoint.x, checkpoint.y)

    -- Display message if available
    if checkpoint.message then
        local msg = checkpoint.message
        if type(msg) == "string" then msg = {msg} end

        for i = 1, #msg, 1 do
            exports["soz-hud"]:DrawAdvancedNotification(
                "Instructeur auto-école", "Information", msg[i],
                "CHAR_BLANK_ENTRY", 1, false, false, 170
            )
        end
    end

    return cpId
end

---Run thread responsible for driving exam
---@param licenseType any
local function startExamLoop(licenseType, context)
    Citizen.CreateThread(function ()
        local checkpoints = Config.Checkpoints[licenseType]
        if not checkpoints then return end
        checkpoints = {table.unpack(checkpoints)}

        -- Draw first checkpoint
        local checkpoint = getNextCheckpoint(checkpoints, true)
        local nextCheckpoint = getNextCheckpoint(checkpoints, false)
        local cpId = DisplayCheckpoint(checkpoint, nextCheckpoint)

        local pid = PlayerPedId()
        context.player = pid -- Add this player to context

        -- Start penalty check loop
        PenaltyCheckingLoop(context)

        -- Checkpoint loop
        while passingExam do -- Exam loop
            local playerCoords = GetEntityCoords(pid)
            local dist = #(vector3(checkpoint.x, checkpoint.y, checkpoint.z) - playerCoords)

            if dist < Config.CheckpointSize then
                DeleteCheckpoint(cpId)
                checkpoint = getNextCheckpoint(checkpoints, true)
                nextCheckpoint = getNextCheckpoint(checkpoints, false)
                if checkpoint then
                    -- Draw next one
                    cpId = DisplayCheckpoint(checkpoint, nextCheckpoint)
                else
                    TerminateExam(true)
                end
            end
            
            Citizen.Wait(0)
        end

        -- Cleanup checkpoints
        DeleteCheckpoint(cpId)
    end)
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
        SetVehicleNumberPlateText(vehicle, Config.VehiclePlateText)
        SetVehicleDoorsLockedForPlayer(vehicle, playerPed, false)
        SetVehRadioStation(vehicle, "OFF")

        -- Clear black screen
        DoScreenFadeIn(fadeDelay)

        -- Start exam
        passingExam = true
        startExamLoop("car", { ["vehicle"] = vehicle })
    end)
end)

function TerminateExam(isSuccess)
    CleanUpPenaltySystem()

    print("TERMINATE EXAM ", isSuccess)
    passingExam = false
    -- TODO
    -- Manage isSuccess
end
