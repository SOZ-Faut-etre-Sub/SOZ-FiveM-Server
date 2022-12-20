local persistent_props = {}

--- Functions
local function setPersistentProp(prop)
    persistent_props[prop.id] = {
        id = prop.id,
        model = prop.model,
        event = prop.event,
        position = json.decode(prop.position),
    }

    if prop.event == nil or prop.event == "xmas" then
        local objCoord = persistent_props[prop.id].position
        local obj = CreateObject(prop.model, objCoord.x, objCoord.y, objCoord.z, objCoord.w, 8000.0, true)

        persistent_props[prop.id].netId = NetworkGetNetworkIdFromEntity(obj)
    end
end

MySQL.ready(function()
    local data = MySQL.Sync.fetchAll("SELECT * FROM persistent_prop")

    for _, prop in pairs(data) do
        setPersistentProp(prop)
    end
end)

QBCore.Functions.CreateCallback("core:server:getProps", function(source, cb)
    cb(persistent_props)
end)

RegisterNetEvent("core:server:refreshPersistentProp", function()
    local data = MySQL.Sync.fetchAll("SELECT * FROM persistent_prop")

    for _, prop in pairs(data) do
        if persistent_props[prop.id] == nil then
            setPersistentProp(prop)
        end
    end
end)
