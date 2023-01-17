local ObjectList = {}
local ObjectListRef = {}

local function CreateObject(ref, model, x, y, z, w, culling, freeze)
    local entity = CreateObjectNoOffset(model, x, y, z, false, false, false)
    ObjectListRef[ref] = entity

    SetEntityHeading(entity, w)

    if freeze then
        FreezeEntityPosition(entity, true)
    end

    return entity
end

local function DeleteObject(ref)
    local entity = ObjectListRef[ref]

    if DoesEntityExist(entity) then
        DeleteEntity(entity)
        ObjectListRef[ref] = nil
    end
end

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    ObjectList = QBCore.Functions.TriggerRpc("soz-utils:object:GetList");

    for _, object in pairs(ObjectList) do
        CreateObject(object.ref, object.model, object.x, object.y, object.z, object.w, object.culling, object.freeze)
    end
end)

RegisterNetEvent("soz-utils:client:create-object", function(ref, model, x, y, z, w, culling, freeze)
    CreateObject(ref, model, x, y, z, w, culling, freeze)
end)

RegisterNetEvent("soz-utils:client:delete-object", function(ref)
    DeleteObject(ref)
end)

exports("CreateObjectClient", function(ref, model, x, y, z, w, culling, freeze)
    DeleteObject(ref)
    return CreateObject(ref, model, x, y, z, w, culling, freeze);
end)
