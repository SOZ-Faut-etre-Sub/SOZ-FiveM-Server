local animDict = "missminuteman_1ig_2"
local anim = "handsup_base"
local handsup = false

RegisterKeyMapping('hu', 'Put your hands up', 'KEYBOARD', 'X')

RegisterCommand('hu', function()
    local ped = PlayerPedId()
	RequestAnimDict(animDict)
	while not HasAnimDictLoaded(animDict) do
		Wait(100)
	end
    handsup = not handsup
    if exports['qb-policejob']:IsHandcuffed() then return end
    if handsup then
        TaskPlayAnim(ped, animDict, anim, 8.0, 8.0, -1, 50, 0, false, false, false)
        if IsPedInAnyVehicle(ped, false) then
            local vehicle = GetVehiclePedIsIn(ped, false)
            if GetPedInVehicleSeat(vehicle, -1) == ped then
                CreateThread(function()
                    while handsup do
                        Wait(1)
                        DisableControlAction(0, 59, true) -- Disable steering in vehicle
			DisableControlAction(0,21,true) -- disable sprint
                        DisableControlAction(0,24,true) -- disable attack
                        DisableControlAction(0,25,true) -- disable aim
                        DisableControlAction(0,47,true) -- disable weapon
                        DisableControlAction(0,58,true) -- disable weapon
                        DisableControlAction(0,71,true) -- veh forward
                        DisableControlAction(0,72,true) -- veh backwards
                        DisableControlAction(0,63,true) -- veh turn left
                        DisableControlAction(0,64,true) -- veh turn right
                        DisableControlAction(0,263,true) -- disable melee
                        DisableControlAction(0,264,true) -- disable melee
                        DisableControlAction(0,257,true) -- disable melee
                        DisableControlAction(0,140,true) -- disable melee
                        DisableControlAction(0,141,true) -- disable melee
                        DisableControlAction(0,142,true) -- disable melee
                        DisableControlAction(0,143,true) -- disable melee
                        DisableControlAction(0,75,true) -- disable exit vehicle
                        DisableControlAction(27,75,true) -- disable exit vehicle
                    end
                end)
            end
        end
    else
        ClearPedTasks(ped)
    end
end, false)
