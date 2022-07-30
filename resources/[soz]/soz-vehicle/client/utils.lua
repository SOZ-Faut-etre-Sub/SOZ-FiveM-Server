---Load Vehicle model
---@param modelName string
---@return boolean
function RequestVehicleModel(modelName)
    local model = GetHashKey(modelName)
    if not IsModelInCdimage(model) then
        return
    end
    RequestModel(model)
    local retry = 0
    while not HasModelLoaded(model) or retry < 20 do
        retry = retry + 1
        Citizen.Wait(10)
    end
    return HasModelLoaded(model)
end
exports("RequestVehicleModel", RequestVehicleModel)

---Set vehicle health and modifications
---@param veh number Entity ID
---@param mods table
function SetVehicleProperties(veh, mods, condition, fuel)
    SetVehicleNumberPlateText(veh, mods.plate)

    if mods.properties ~= nil then
        if type(mods.properties) == "string" then
            QBCore.Functions.SetVehicleProperties(veh, json.decode(mods.properties))
        else
            QBCore.Functions.SetVehicleProperties(veh, mods.properties)
        end

    else
        if type(mods) == "string" then
            QBCore.Functions.SetVehicleProperties(veh, json.decode(mods))
        else
            QBCore.Functions.SetVehicleProperties(veh, mods)
        end
    end

    if condition ~= nil then
        QBCore.Functions.SetVehicleProperties(veh, json.decode(condition))
    end
    exports["soz-vehicle"]:SetFuel(veh, fuel)
    SetEntityAsMissionEntity(veh, true, true)
end
exports("SetVehicleProperties", SetVehicleProperties)

function showNonLoopParticle(dict, particleName, coords, scale)
    -- Request the particle dictionary.
    RequestNamedPtfxAsset(dict)
    -- Wait for the particle dictionary to load.
    while not HasNamedPtfxAssetLoaded(dict) do
        Citizen.Wait(0)
    end
    -- Tell the game that we want to use a specific dictionary for the next particle native.
    UseParticleFxAssetNextCall(dict)
    -- Create a new non-looped particle effect, we don't need to store the particle handle because it will
    -- automatically get destroyed once the particle has finished it's animation (it's non-looped).
    SetParticleFxNonLoopedColour(particleHandle, 0, 255, 0, 0)
    return StartParticleFxNonLoopedAtCoord(particleName, coords, 0.0, 0.0, 0.0, scale, false, false, false)
end
exports("showNonLoopParticle", showNonLoopParticle)

function showLoopParticle(dict, particleName, coords, scale, time)
    -- Request the particle dictionary.
    RequestNamedPtfxAsset(dict)
    -- Wait for the particle dictionary to load.
    while not HasNamedPtfxAssetLoaded(dict) do
        Citizen.Wait(0)
    end
    -- Tell the game that we want to use a specific dictionary for the next particle native.
    UseParticleFxAssetNextCall(dict)
    -- Create a new non-looped particle effect, we don't need to store the particle handle because it will
    -- automatically get destroyed once the particle has finished it's animation (it's non-looped).
    local particleHandle = StartParticleFxLoopedAtCoord(particleName, coords, 0.0, 0.0, 0.0, scale, false, false, false)
    SetParticleFxLoopedColour(particleHandle, 0, 255, 0, 0)
    Citizen.Wait(time)
    StopParticleFxLooped(particleHandle, false)
    return particleHandle
end
exports("showLoopParticle", showLoopParticle)

function showLoopParticleAtBone(dict, particleName, entity, bone, scale, time)
    -- Request the particle dictionary.
    RequestNamedPtfxAsset(dict)
    -- Wait for the particle dictionary to load.
    while not HasNamedPtfxAssetLoaded(dict) do
        Citizen.Wait(0)
    end
    -- Tell the game that we want to use a specific dictionary for the next particle native.
    UseParticleFxAssetNextCall(dict)
    -- Create a new non-looped particle effect, we don't need to store the particle handle because it will
    -- automatically get destroyed once the particle has finished it's animation (it's non-looped).
    local particleHandle = StartParticleFxLoopedOnEntityBone(particleName, entity, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, bone, scale, false, false, false)
    SetParticleFxLoopedColour(particleHandle, 0, 255, 0, 0)
    Citizen.Wait(time)
    StopParticleFxLooped(particleHandle, false)
    return particleHandle
end
exports("showLoopParticleAtBone", showLoopParticleAtBone)
