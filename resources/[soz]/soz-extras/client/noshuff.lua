local disableShuffle = true
function disableSeatShuffle(flag)
	disableShuffle = flag
end

CreateThread(function()
    while true do
        local ped = PlayerPedId()
        local veh = GetVehiclePedIsIn(ped)
            if IsPedInAnyVehicle(ped, false) and disableShuffle then
                if GetPedInVehicleSeat(veh, false, 0) == ped then
                    if GetIsTaskActive(ped, 165) then
                        SetPedIntoVehicle(ped, veh, 0)
                        SetPedConfigFlag(ped, 184, true)
                    end
                end
            end
        Wait(5)
    end
end)

RegisterNetEvent('SeatShuffle', function()
	if IsPedInAnyVehicle(PlayerPedId(), false) then
		disableSeatShuffle(false)
		Wait(5000)
		disableSeatShuffle(true)
	else
		CancelEvent()
	end
end)

RegisterCommand("shuff", function(source, args, raw)
    TriggerEvent("SeatShuffle")
end, false)
