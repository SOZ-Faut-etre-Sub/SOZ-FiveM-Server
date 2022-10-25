

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
    return StartNetworkedParticleFxNonLoopedAtCoord(particleName, coords, 0.0, 0.0, 0.0, scale, false, false, false)
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
    local particleHandle = StartNetworkedParticleFxLoopedOnEntityBone(particleName, entity, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, bone, scale, false, false, false)
    SetParticleFxLoopedColour(particleHandle, 0, 255, 0, 0)
    Citizen.Wait(time)
    StopParticleFxLooped(particleHandle, false)
    return particleHandle
end
exports("showLoopParticleAtBone", showLoopParticleAtBone)

