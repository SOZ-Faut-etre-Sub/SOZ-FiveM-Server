CreateThread(function()
    while true do
        Wait(0)
        if LocalPlayer.state.isLoggedIn then
            Wait((1000 * 60) * QBCore.Config.UpdateInterval)
            TriggerServerEvent('QBCore:UpdatePlayer')
        end
    end
end)

CreateThread(function()
    local lib, anim = "move_m@_idles@out_of_breath", "idle_c"

    while true do
        Wait(QBCore.Config.StatusInterval)
        if LocalPlayer.state.isLoggedIn then
            if QBCore.Functions.GetPlayerData().metadata['hunger'] <= 0 or
                    QBCore.Functions.GetPlayerData().metadata['thirst'] <= 0 then
                local ped = PlayerPedId()

                if GetEntityHealth(ped) > 0 then
                    QBCore.Functions.RequestAnimDict(lib)
                    ClearPedTasksImmediately(ped)
                    TaskPlayAnim(ped, lib, anim, 8.0, -8.0, 8000, 0, 0, 0, 0, 0)
                    Wait(8000)

                    SetEntityHealth(ped, 0)
                end
            end
        end
    end
end)
