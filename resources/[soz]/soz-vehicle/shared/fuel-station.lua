--- @class FuelStation
FuelStation = {}

function FuelStation:new(id, station, fuel, type, owner, stock, price, position, model, zone)
    self.__index = self

    return setmetatable({
        id = id,
        station = station,
        fuel = fuel,
        type = type,
        owner = owner,
        stock = stock,
        price = price,
        refueling = {},
        position = decode_json(position),
        model = model,
        zone = decode_json(zone),
    }, self)
end

---
--- Getters
---
function FuelStation:IsPublic()
    return self.type == "public"
end

function FuelStation:IsPrivate()
    return self.type == "private"
end

function FuelStation:IsKerosene()
    return self.fuel == "kerosene"
end

function FuelStation:IsEssence()
    return self.fuel == "essence"
end

function FuelStation:CitizenIsOwner(citizenJobId)
    return self.owner == citizenJobId
end

function FuelStation:CitizenHasAccess(citizenJobId)
    if self:IsPublic() then
        return true
    elseif self:IsPrivate() then
        return self:CitizenIsOwner(citizenJobId)
    end
end

function FuelStation:SetPrice(price)
    if self:IsPrivate() then
        return
    end
    self.price = price
end

function FuelStation:GetPrice()
    if self:IsPublic() then
        return self.price
    elseif self:IsPrivate() then
        return 0
    end
end

---
--- Stock management
---
function FuelStation:GetRefuelingAmount()
    local amount = 0
    for _, refueling in pairs(self.refueling) do
        amount = amount + refueling
    end
    return amount
end

function FuelStation:GetAvailableStock()
    return self.stock - self:GetRefuelingAmount()
end

function FuelStation:HasSufficientStock()
    return self:GetAvailableStock() >= 100
end

function FuelStation:RequestRefueling(citizen, amount)
    self.refueling[citizen] = tonumber(amount)
end

function FuelStation:GetRefueling(citizen)
    return self.refueling[citizen]
end

function FuelStation:FinishedRefueling(citizen, amount)
    self.refueling[citizen] = nil
    self.stock = self.stock - tonumber(amount)
end

function FuelStation:GetIdentifier()
    return self.id
end

function FuelStation:GetModel()
    return self.model
end

function FuelStation:VehicleAccessFuel(vehicle)
    if self.fuel == "electric" then
        return Config.FuelStations.Vehicle.ElectricModel[GetEntityModel(vehicle)] or false
    elseif self.fuel == "essence" then
        if IsDuplicityVersion() then
            local vehicleType = GetVehicleType(vehicle)
            return vehicleType == "automobile" or vehicleType == "bike" or vehicleType == "boat" or vehicleType == "submarine"
        else
            local vehicleClass = GetVehicleClass(vehicle)
            return vehicleClass ~= 13 and vehicleClass ~= 15 and vehicleClass ~= 16 and vehicleClass ~= 21
        end
    elseif self.fuel == "kerosene" then
        if IsDuplicityVersion() then
            local vehicleType = GetVehicleType(vehicle)
            return vehicleType == "heli" or vehicleType == "plane"
        else
            local vehicleClass = GetVehicleClass(vehicle)
            return vehicleClass == 15 or vehicleClass == 16
        end
    end
    return false
end

function FuelStation:GetRefuelCapacity()
    if self.stock <= 0 then
        return 0
    elseif self.stock >= 100 then
        return 100
    else
        return self.stock
    end
end

function FuelStation:GetCoordinates()
    return vector3(self.position.x, self.position.y, self.position.z)
end

function FuelStation:GetPolyZoneConfiguration()
    return vector3(self.zone.position.x, self.zone.position.y, self.zone.position.z), self.zone.length, self.zone.width, self.zone.options
end

---
--- Utils
---
function FuelStation:SpawnStation()
    if self:IsPrivate() or (self:IsPublic() and self.fuel == "kerosene") then
        exports["soz-utils"]:CreateObject(self.model, self.position.x, self.position.y, self.position.z, self.position.w, 8000.0, true)
    end
end
