local isInVehicle = false
local isEnteringVehicle = false
local currentVehicle = 0
local currentVehicleNetId = 0
local currentSeat = 0

Citizen.CreateThread(function()
	while true do
		Citizen.Wait(0)

		local ped = PlayerPedId()

		if not isInVehicle and not IsPlayerDead(PlayerId()) then
			if DoesEntityExist(GetVehiclePedIsTryingToEnter(ped)) and not isEnteringVehicle then
				-- trying to enter a vehicle!
				local vehicle = GetVehiclePedIsTryingToEnter(ped)
				local seat = GetSeatPedIsTryingToEnter(ped)
				local netId = NetworkGetEntityIsNetworked(vehicle) and VehToNet(vehicle) or 0
				isEnteringVehicle = true
				TriggerEvent('baseevents:enteringVehicle', vehicle, seat, GetDisplayNameFromVehicleModel(GetEntityModel(vehicle)), netId)
				TriggerServerEvent('baseevents:enteringVehicle', vehicle, seat, GetDisplayNameFromVehicleModel(GetEntityModel(vehicle)), netId)
			elseif not DoesEntityExist(GetVehiclePedIsTryingToEnter(ped)) and not IsPedInAnyVehicle(ped, true) and isEnteringVehicle then
				-- vehicle entering aborted
				TriggerServerEvent('baseevents:enteringAborted')
				isEnteringVehicle = false
			elseif IsPedInAnyVehicle(ped, false) then
				-- suddenly appeared in a vehicle, possible teleport
				isEnteringVehicle = false
				isInVehicle = true
				currentVehicle = GetVehiclePedIsUsing(ped)
				currentSeat = GetPedVehicleSeat(ped)
                currentVehicleNetId = NetworkGetEntityIsNetworked(currentVehicle) and VehToNet(currentVehicle) or 0
				TriggerEvent('baseevents:enteredVehicle', currentVehicle, currentSeat)
				TriggerServerEvent('baseevents:enteredVehicle', currentVehicleNetId, currentSeat)
			end
		elseif isInVehicle then
            local pedInSeat = GetPedInVehicleSeat(currentVehicle, currentSeat)

			if not IsPedInAnyVehicle(ped, false) or IsPlayerDead(PlayerId()) then
				TriggerEvent('baseevents:leftVehicle', currentVehicle, currentSeat)
				TriggerServerEvent('baseevents:leftVehicle', currentVehicleNetId, currentSeat)
				isInVehicle = false
				currentVehicle = 0
				currentSeat = 0
            elseif pedInSeat ~= ped then
                currentSeat = GetPedVehicleSeat(ped)
                local netId = NetworkGetEntityIsNetworked(currentVehicle) and VehToNet(currentVehicle) or 0
                TriggerEvent('baseevents:changedVehicleSeat', currentVehicle, currentSeat)
                TriggerServerEvent('baseevents:changedVehicleSeat', netId, currentSeat)
            end
		end
		Citizen.Wait(50)
	end
end)

function GetPedVehicleSeat(ped)
    local vehicle = GetVehiclePedIsIn(ped, false)
    for i=-2,GetVehicleMaxNumberOfPassengers(vehicle) do
        if(GetPedInVehicleSeat(vehicle, i) == ped) then return i end
    end
    return -2
end
