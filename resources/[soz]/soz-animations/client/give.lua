RegisterNetEvent("animation:client:give", function()
    local ped = PlayerPedId()
    while not HasAnimDictLoaded("mp_common") do
        RequestAnimDict("mp_common")
        Wait(0)
    end

    FreezeEntityPosition(ped, true)
    TaskPlayAnim(ped, "mp_common", "givetake1_a", 8.0, -8.0, 2000, 49, 0, 0, 0, 0)
    Wait(2000)
    FreezeEntityPosition(ped, false)
end)
