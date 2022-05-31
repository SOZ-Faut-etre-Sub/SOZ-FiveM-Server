ModuleCar = {}

function ModuleCar:new()
    self.__index = self
    return setmetatable({serverId = nil}, self)
end

function ModuleCar:init()
    self.serverId = GetPlayerServerId(PlayerId())
end

function ModuleCar:getSpeakers()
    local vehicle = GetVehiclePedIsIn(PlayerPedId())

    if vehicle == 0 then
        return {}
    end

    local speakers = {}
    local seatCount = GetVehicleNumberOfPassengers(vehicle)

    for seat = -1, seatCount + 1 do
        if not IsVehicleSeatFree(vehicle, seat) then
            local pedServerId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(GetPedInVehicleSeat(vehicle, seat)))

            if pedServerId ~= 0 and pedServerId ~= self.serverId then
                speakers[(("player_%d"):format(pedServerId))] = {serverId = pedServerId, transmitting = true}
            end
        end
    end

    return speakers
end
