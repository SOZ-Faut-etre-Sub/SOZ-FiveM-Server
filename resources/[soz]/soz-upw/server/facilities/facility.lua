Facility = InheritsFrom(nil)

function Facility:new(identifier, data)
    local self = setmetatable({}, {__index = Facility})

    self.identifier = identifier
    if type(identifier) ~= "string" and #identifier == 0 then
        error("'identifier' should be a string")
    end

    self:init(identifier, data)

    if not self.type then
        error("Type of Facility (self.type) is required")
    end

    return self
end

function Facility:init(identifier, data)
    local res = self:select(identifier)
    if res then
        self:load(res.type, res.data)
    else
        self:insert(data)
    end
end

function Facility:load(type_, data)
    if type(data) == "string" then
        data = json.decode(data)
    end

    self.type = type_

    for key, value in pairs(data) do
        self[key] = value
    end
end

function Facility:select(identifier)
    return MySQL.Sync.fetchSingle("SELECT * FROM upw_facility WHERE identifier = @identifier", {
        ["@identifier"] = identifier,
    })
end

function Facility:insert(data)
    local res = MySQL.Sync.execute("INSERT INTO upw_facility (type, identifier, data) VALUES(@type, @identifier, @data)",
                                   {
        ["@type"] = data.type,
        ["@identifier"] = self.identifier,
        ["@data"] = json.encode(data),
    })

    if res then
        local facility = self:select(self.identifier)
        self:load(facility.type, facility.data)
    end
end

function Facility:get_data()
    if not self.fields_to_save then
        error("self.fields_to_save is not defined")
    end

    local data = {}

    for _, field in ipairs(self.fields_to_save) do
        data[field] = self[field]
    end

    return data
end

function Facility:save(isAsync)
    local data = self:get_data()

    local query = "UPDATE upw_facility SET `data` = @data WHERE identifier = @identifier"
    local args = {["@identifier"] = self.identifier, ["@data"] = json.encode(data)}

    local res
    if isAsync then
        MySQL.Async.execute(query, args)
        return
    else
        res = MySQL.Sync.execute(query, args)
    end

    if res == 1 then
        self:load(self.type, data)
    end
end

--
-- ENERGY HARVEST
--
function Facility:CanEnergyBeHarvested(item)
    return self.capacity >= Config.Production.EnergyPerCell[item]
end

function Facility:HarvestEnergy(item)
    self.capacity = self.capacity - Config.Production.EnergyPerCell[item]

    return self.capacity
end

--
-- ENERGY STORAGE
--
function Facility:CanStoreEnergy()
    return self.capacity < self.maxCapacity
end

function Facility:StoreEnergy(item)
    self.capacity = self.capacity + Config.Production.EnergyPerCell[item]

    if self.capacity > self.maxCapacity then
        self.capacity = self.maxCapacity
    end

    return self.capacity
end
