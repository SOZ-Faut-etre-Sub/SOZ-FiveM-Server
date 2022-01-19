local bankman = GetHashKey('ig_bankman')

CreateThread(function()
    for _,bank in pairs(Config.BankPedLocations) do
        local ped = CreatePed(4, bankman, bank.x, bank.y, bank.z, bank.w, true, false)
        FreezeEntityPosition(ped, true)
    end
end)
