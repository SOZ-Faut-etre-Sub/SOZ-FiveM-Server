-- Resell Port of Los Santos
Citizen.CreateThread(function()
    local resellOpt = SozJobCore.Jobs[SozJobCore.JobType.Pawl].resell.primary
    local coords = resellOpt.coords

    exports["qb-target"]:SpawnPed({
        {
            model = "s_m_y_construct_01",
            coords = coords,
            minusOne = true,
            freeze = true,
            invincible = true,
            blockevents = true,
            scenario = "WORLD_HUMAN_CLIPBOARD",
            target = {options = {}},
        },
    })

    local zone = BoxZone:Create(coords, 3.0, 3.0, {
        name = resellOpt.ZoneName,
        heading = coords.w,
        minZ = coords.z - 2.0,
        maxZ = coords.z + 2.0,
    })
    zone:onPlayerInOut(function(isInside)
        if isInside and PlayerData.job.onduty then
            TriggerEvent("player/setCurrentResellZone", resellOpt)
        else
            TriggerEvent("player/setCurrentResellZone", nil)
        end
    end)
end)

RegisterNetEvent("locations:zone:enter", function(group, name)
    if group == "zkea" and PlayerData.job and PlayerData.job.onduty then
        TriggerEvent("player/setCurrentResellZone", SozJobCore.Jobs[SozJobCore.JobType.Pawl].resell.secondary)
    end
end)

RegisterNetEvent("locations:zone:exit", function(group, name)
    if group == "zkea" and PlayerData.job and PlayerData.job.onduty then
        TriggerEvent("player/setCurrentResellZone", nil)
    end
end)
