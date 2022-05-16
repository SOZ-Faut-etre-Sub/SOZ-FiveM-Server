function CreateObject(model, x, y, z, w, culling, freeze)
    local entity = CreateObjectNoOffset(model, x, y, z, true, true, false)
    SetEntityHeading(entity, w)

    if culling then
        SetEntityDistanceCullingRadius(entity, culling)
    end

    if freeze then
        FreezeEntityPosition(entity, true)
    end

    Citizen.CreateThread(function ()
        while true do
            Wait(10 * 1000)

            if not DoesEntityExist(entity) then
                entity = CreateObjectNoOffset(model, x, y, z, true, true, false)
                SetEntityHeading(entity, w)

                if culling then
                    SetEntityDistanceCullingRadius(entity, culling)
                end

                if freeze then
                    FreezeEntityPosition(entity, true)
                end
            end
        end
    end)

    return entity
end

exports('CreateObject', CreateObject)
