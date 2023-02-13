local protestsign = {enabled = false, object = nil}

RegisterNetEvent("items:protestsign:toggle", function()
    protestsign.enabled = not protestsign.enabled
    local ped = GetPlayerPed(-1)

    if protestsign.enabled then
        while not HasAnimDictLoaded("amb@world_human_drinking@coffee@male@base") do
            RequestAnimDict("amb@world_human_drinking@coffee@male@base")
            Wait(10)
        end
        TaskPlayAnim(ped, "amb@world_human_drinking@coffee@male@base", "base", 2.0, 2.0, -1, 51, 0, false, false, false)
        protestsign.object = CreateObject(GetHashKey("prop_cs_protest_sign_nothappy"), 0, 0, 0, true, true, true)
        AttachEntityToEntity(protestsign.object, ped, GetPedBoneIndex(ped, 57005), 0.2, 0.3, 0.03, 280.0, 10.0, 40.0, true, true, false, true, 5, true)
    else
        DetachEntity(protestsign.object, 0, 0)
        DeleteEntity(protestsign.object)
        RemoveAnimDict("amb@world_human_drinking@coffee@male@base")
        ClearPedTasksImmediately(ped)
    end
end)
