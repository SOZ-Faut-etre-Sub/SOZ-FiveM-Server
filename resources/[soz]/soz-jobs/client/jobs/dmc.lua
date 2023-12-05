-- Resell Port of Los Santos
Citizen.CreateThread(function()
    local resellOpt = SozJobCore.Jobs[SozJobCore.JobType.DMC].resell.primary
    local coords = resellOpt.coords

    exports["qb-target"]:SpawnPed({
        {
            spawnNow = true,
            model = "s_m_y_dockwork_01",
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
        if isInside then
            TriggerEvent("player/setCurrentResellZone", resellOpt)
        else
            TriggerEvent("player/setCurrentResellZone", nil)
        end
    end)
end)
