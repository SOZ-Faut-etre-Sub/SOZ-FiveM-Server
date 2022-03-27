local passingExam = false -- Is a driving exam running ?
local instructorEntity
local vehicleEntity

---Test wether or not spawn location is already occupied
---@param x number
---@param y number
---@param z number
function IsSpawnPointFree(x, y, z)
    return not IsPositionOccupied(x, y, z, 0.25, false, true, true, false, false, 0, false)
end

---Pick first available spawn point
---@param points table Spawn points declared in config
function GetSpawnPoint(points)
    for _, point in ipairs(points) do
        if IsSpawnPointFree(point.x, point.y, point.z) then
            return point
        end
    end
    return nil
end

---Draw random checkpoints from a list of checkpoints
---@param allCheckpoints table
---@param count number Number of checkpoints that are to be drawn
local function GetRandomCheckpoints(allCheckpoints, count)
    if count > #allCheckpoints then
        count = #allCheckpoints
    end

    local allCpCopy = {table.unpack(allCheckpoints)}
    local checkpoints = {}
    repeat
        local idx = math.random(1, #allCpCopy)
        local cp = allCpCopy[idx]
        table.insert(checkpoints, cp)
        table.remove(allCpCopy, idx)
    until #checkpoints == count - 1 -- Remove final checkpoints
    return checkpoints
end

---Get next checkpoint in table
---@param tbl table Checkpoints table
---@param pop boolean Should table item be poped
---@return table
local function getNextCheckpoint(tbl, pop)
    if not next(tbl) then
        return nil
    end

    local cp = tbl[1]
    if pop then
        table.remove(tbl, 1)
    end

    return cp
end

---Display checkpoint, waypoint and message to player
---@param checkpoint table Checkpoint to be displayed
---@param nextCheckpoint table Following checkpoint
---@return number
local function DisplayCheckpoint(checkpoint, nextCheckpoint)
    local cpType = Config.CheckpointType
    if not nextCheckpoint then -- Last check point
        nextCheckpoint = {}
        cpType = 4 -- Chequered flag
    end

    local cpColor = Config.CheckpointColor
    local cpSize = Config.CheckpointSize

    -- Draw Checkpoint
    local cpId = CreateCheckpoint(cpType, checkpoint.x, checkpoint.y, checkpoint.z, nextCheckpoint.x or 0.0, nextCheckpoint.y or 0.0, nextCheckpoint.z or 0.0,
                                  cpSize, cpColor.r, cpColor.g, cpColor.b, cpColor.a, 0)
    SetCheckpointCylinderHeight(cpId, cpSize, cpSize, cpSize)

    -- Add GPS waypoint
    SetNewWaypoint(checkpoint.x, checkpoint.y)

    return cpId
end

---Force waypoint to be displayed on minimap.
---Prevent the game from removing waypoint when player is nearby.
local function ForceWaypointDisplay(x, y)
    if not IsWaypointActive() then
        SetNewWaypoint(x, y)
        SetMinimapBlockWaypoint(true)
    end
end

---Run thread responsible for driving exam
---@param licenseType string key referencing license type on Config.Licenses
---@param context table Contextual data that is to be used during penalty checking loop
local function startExamLoop(licenseType, context)
    Citizen.CreateThread(function()
        local pid = PlayerPedId()

        -- Populate context
        context.player = pid
        context.licenseType = licenseType

        -- Diplay Instructor start speech
        for i = 1, #Config.InstructorStartSpeech, 1 do
            local msg
            local el = Config.InstructorStartSpeech[i]
            if type(el) == "string" then
                msg = el
            elseif type(el) == "table" then
                msg = Config.InstructorStartSpeech[i][licenseType]
            end
            if msg then
                DiplayInstructorNotification("INFO", msg)
            end
        end

        -- Checkpoints
        local checkpoints = GetRandomCheckpoints(Config.Checkpoints, Config.CheckpointCount)
        if not checkpoints then
            return
        end
        checkpoints = {table.unpack(checkpoints)}
        --- Add final checkpoint
        local finalCheckpoint = Config.FinalCheckpoints[licenseType]
        if not checkpoints then
            return
        end
        table.insert(checkpoints, finalCheckpoint)

        local totalCp = #checkpoints

        -- Setup first checkpoint
        local prevCheckpoint = nil
        local checkpoint = getNextCheckpoint(checkpoints, true)
        local nextCheckpoint = getNextCheckpoint(checkpoints, false)
        local cpId = DisplayCheckpoint(checkpoint, nextCheckpoint)

        -- Checkpoint loop
        while passingExam do -- Exam loop
            local playerCoords = GetEntityCoords(pid)

            -- Start penalty check loop
            StartPenaltyLoop(playerCoords, context)

            -- Player distance to current checkpoint
            local dist = #(vector3(checkpoint.x, checkpoint.y, checkpoint.z) - playerCoords)

            -- Force Waypoint display
            ForceWaypointDisplay(checkpoint.x, checkpoint.y)
            DisplayRadar(true)

            -- On checkpoint entered
            if dist < Config.CheckpointSize then
                DeleteCheckpoint(cpId)

                -- Display message if set (stored on previous checkpoint)
                prevCheckpoint = checkpoint
                if prevCheckpoint and prevCheckpoint.message then
                    local msg = prevCheckpoint.message
                    if type(msg) == "string" then
                        msg = {msg}
                    end

                    for i = 1, #msg, 1 do
                        DiplayInstructorNotification("INFO", msg[i])
                    end
                end

                -- Display checkpoint count
                if #checkpoints > 0 then
                    exports["soz-hud"]:DrawNotification(string.format("Checkpoint %s/%s", totalCp - #checkpoints, totalCp))
                end

                -- Draw next checkpoint
                checkpoint = getNextCheckpoint(checkpoints, true)
                nextCheckpoint = getNextCheckpoint(checkpoints, false)
                if checkpoint then
                    cpId = DisplayCheckpoint(checkpoint, nextCheckpoint)
                else
                    TerminateExam(true, licenseType)
                end
            end

            Citizen.Wait(0)
        end

        -- Cleanup checkpoints
        DeleteCheckpoint(cpId)
    end)
end

function SetupDrivingSchoolExam(licenseType, spawnPoint)
    Citizen.CreateThread(function()
        local license = Config.Licenses[licenseType]
        if not license then
            return
        end

        -- Fade to black screen
        ScreenFadeOut()

        -- Instructor Ped
        local iData = Config.Peds.instructor
        setupModel(iData.modelHash)
        local instructor = CreatePed(4, iData.modelHash, iData.x, iData.y, iData.z - 1, iData.rotation, iData.networkSync, false)

        SetBlockingOfNonTemporaryEvents(instructor, true)
        SetEntityInvincible(instructor, true)

        local playerPed = PlayerPedId()

        -- Spawn car
        local vData = license.vehicle
        setupModel(vData.modelHash)
        local vehicle = CreateVehicle(vData.modelHash, spawnPoint.x, spawnPoint.y, spawnPoint.z, spawnPoint.w, true, false)

        SetPedIntoVehicle(playerPed, vehicle, -1)
        SetPedIntoVehicle(instructor, vehicle, 0)
        SetVehicleNumberPlateText(vehicle, Config.VehiclePlateText)
        TriggerServerEvent("vehiclekeys:server:SetVehicleOwner", Config.VehiclePlateText)
        SetVehicleDoorsLockedForPlayer(vehicle, playerPed, false)
        SetVehRadioStation(vehicle, "OFF")
        exports["soz-vehicle"]:SetFuel(vehicle, 100.0)

        -- Unload models
        SetModelAsNoLongerNeeded(iData.modelHash)
        SetModelAsNoLongerNeeded(vData.modelHash)

        -- Store instructor & vehicle entity globally for future clean up
        instructorEntity = instructor
        vehicleEntity = vehicle

        -- Clear black screen
        ScreenFadeIn()

        -- Start exam
        passingExam = true
        startExamLoop(licenseType, {["vehicle"] = vehicle, ["license"] = license, ["spawnPoint"] = spawnPoint})
    end)
end

local function RunExitSequence()
    -- Player
    local pid = PlayerPedId()
    TaskLeaveVehicle(pid, vehicleEntity, 0)
    -- Instructor
    TaskLeaveVehicle(instructorEntity, vehicleEntity, 0)
end

local function HandleVehicleAndPed(isSuccess, instructor, vehicle)
    if isSuccess then
        Citizen.CreateThread(function()
            -- Fade to black screen
            ScreenFadeOut()

            -- Delete ped and vehicle
            DeletePed(instructor)
            DeleteVehicle(vehicle)

            -- Spawn user to driving school
            local ped = PlayerPedId()
            SetEntityCoords(ped, Config.PlayerDefaultLocation)
            SetEntityRotation(ped, 0.0, 0.0, Config.PlayerDefaultLocation.w, 0, false)

            ScreenFadeIn()
        end)
    else
        SetEntityAsNoLongerNeeded(instructor)
        SetEntityAsNoLongerNeeded(vehicle)
    end
end

function TerminateExam(isSuccess, licenseType)
    RunExitSequence()

    HandleVehicleAndPed(isSuccess, instructorEntity, vehicleEntity)
    CleanUpPenaltySystem()
    DeleteWaypoint()
    SetMinimapBlockWaypoint(false)
    passingExam = false
    DisplayRadar(false)

    if isSuccess then
        TriggerServerEvent("soz-driving-license:server:update_license", licenseType)
        exports["soz-hud"]:DrawAdvancedNotification(Config.BlipName, "Réussite", "Félicitations ! Vous venez d'obtenir votre permis", "CHAR_BLANK_ENTRY",
                                                    false, Config.NotificationDelay)
    end
end

---EXPORTS Is this player currently passing a driving school exam ?
---@return boolean
exports("IsPassingExam", function()
    return passingExam
end)
