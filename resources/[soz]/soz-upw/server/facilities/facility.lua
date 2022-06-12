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
        self:load(res.data)
    else
        self:insert(data)
    end
end

function Facility:load(data)
    if type(data) == "string" then
        data = json.decode(data)
    end

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
        self:load(facility.data)
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

function Facility:save()
    local data = self:get_data()

    local res = MySQL.Sync.execute("UPDATE upw_facility SET `data` = @data WHERE identifier = @identifier",
                                   {["@identifier"] = self.identifier, ["@data"] = json.encode(data)})

    if res == 1 then
        self:load(data)
    end
end

--
-- ENERGY HARVEST
--
function Facility:CanEnergyBeHarvested()
    return self.capacity >= Config.Production.EnergyPerCell
end

function Facility:HarvestEnergy()
    self.capacity = self.capacity - Config.Production.EnergyPerCell

    return self.capacity
end
