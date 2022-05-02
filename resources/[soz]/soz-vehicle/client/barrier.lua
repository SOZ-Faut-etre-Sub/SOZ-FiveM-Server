local gates = {[GetHashKey("prop_sec_barrier_ld_01a")] = true, [GetHashKey("prop_sec_barrier_ld_02a")] = true}

Citizen.CreateThread(function()
    while true do
        local coords = GetEntityCoords(PlayerPedId())
        local objects = GetGamePool("CObject")

        for i = 1, #objects, 1 do
            local objectModel = GetEntityModel(objects[i])
            local objectCoords = GetEntityCoords(objects[i])
            local distance = #(objectCoords - coords)
            local identifier = "b_" .. objectCoords.x .. objectCoords.y .. objectCoords.z

            if gates[objectModel] and distance <= 20.0 then
                if not IsDoorRegisteredWithSystem(identifier) then
                    AddDoorToSystem(identifier, objectModel, objectCoords.x, objectCoords.y, objectCoords.z, true, true, false);
                    DoorSystemSetOpenRatio(identifier, 1.0, false, true);
                end
                DoorSystemSetAutomaticDistance(identifier, 5.0, false, true)
            elseif gates[objectModel] and distance >= 40.0 then
                if IsDoorRegisteredWithSystem(identifier) then
                    RemoveDoorFromSystem(identifier)
                end
            end
        end

        Wait(1000)
    end
end)
