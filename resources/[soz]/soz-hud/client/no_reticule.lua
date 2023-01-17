Citizen.CreateThread(function()
    while true do
        local ped = PlayerPedId()

        if DoesEntityExist(ped) and not IsEntityDead(ped) then
            local _, hash = GetCurrentPedWeapon(ped, true)

            if not Config.AllowedReticuleWeapon[hash] then
                HideHudComponentThisFrame(14)
            end
        end

        Wait(0)
    end
end)
