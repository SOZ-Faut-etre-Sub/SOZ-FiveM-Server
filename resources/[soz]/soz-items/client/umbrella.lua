local umbrella = {enabled = false, object = nil}

RegisterNetEvent("items:umbrella:toggle", function()
    umbrella.enabled = not umbrella.enabled
    local ped = GetPlayerPed(-1)

    if umbrella.enabled then
        while not HasAnimDictLoaded("amb@world_human_drinking@coffee@male@base") do
            RequestAnimDict("amb@world_human_drinking@coffee@male@base")
            Wait(10)
        end
        TaskPlayAnim(ped, "amb@world_human_drinking@coffee@male@base", "base", 2.0, 2.0, -1, 51, 0, false, false, false)
        umbrella.object = CreateObject(GetHashKey("p_amb_brolly_01"), 0, 0, 0, true, true, true)
        AttachEntityToEntity(umbrella.object, ped, GetPedBoneIndex(ped, 57005), 0.12, 0.005, 0.0, 280.0, 10.0, 290.0, true, true, false, true, 5, true)
    else
        DetachEntity(umbrella.object, 0, 0)
        DeleteEntity(umbrella.object)
        RemoveAnimDict("amb@world_human_drinking@coffee@male@base")
        ClearPedTasksImmediately(ped)
    end
end)
