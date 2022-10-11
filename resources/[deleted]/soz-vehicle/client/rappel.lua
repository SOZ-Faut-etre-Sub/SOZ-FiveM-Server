RegisterKeyMapping("rappel", "Descendre en Rappel", "keyboard", "e")
RegisterCommand("rappel", function()
    local ped = PlayerPedId()
    local vehicle = GetVehiclePedIsIn(ped, false)
    if DoesVehicleAllowRappel(vehicle) and ped ~= GetPedInVehicleSeat(vehicle, -1) and ped ~= GetPedInVehicleSeat(vehicle, 0) then
        TaskRappelFromHeli(ped, 0x41200000)
    end
end, false)
