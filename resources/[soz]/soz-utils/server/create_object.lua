local ObjectList = {}
local ObjectListRef = {}

local function CreateObjectServerSide(model, x, y, z, w, culling, freeze)
    local ref = tostring(model) .. tostring(x) .. tostring(y) .. tostring(z)
    local entity = CreateObjectNoOffset(model, x, y, z, true, true, false)
    SetEntityHeading(entity, w)

    ObjectListRef[ref] = entity

    -- if culling then
    --    SetEntityDistanceCullingRadius(entity, culling)
    -- end

    if freeze then
        FreezeEntityPosition(entity, true)
    end

    return ref
end

local function CreateObjectClientSide(model, x, y, z, w, culling, freeze)
    local ref = tostring(model) .. tostring(x) .. tostring(y) .. tostring(z)

    table.insert(ObjectList, {ref = ref, model = model, x = x, y = y, z = z, w = w, culling = culling, freeze = freeze})

    TriggerClientEvent("soz-utils:object:create", -1, ref, model, x, y, z, w, culling, freeze)
end

local function DeleteObjectServerSide(ref)
    -- @TODO
end

local function DeleteObjectClientSide(ref)
    TriggerClientEvent("soz-utils:object:delete", -1, ref)
end

QBCore.Functions.CreateCallback("soz-utils:object:GetList", function(source, cb)
    cb(ObjectList)
end)

function CreateObject(model, x, y, z, w, culling, freeze)
    CreateObjectClientSide(model, x, y, z, w, culling, freeze)
end

function DeleteObject(ref)
    DeleteObjectClientSide(ref)
end

exports("CreateObject", CreateObject)
exports("DeleteObject", DeleteObject)
