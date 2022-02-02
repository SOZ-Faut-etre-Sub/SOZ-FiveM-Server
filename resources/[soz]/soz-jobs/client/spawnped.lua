function setupModel(model)
    RequestModel(model)
    while not HasModelLoaded(model) do
        RequestModel(model)
        Wait(0)
    end
    SetModelAsNoLongerNeeded(model)
end

function pedCreation_basic(PedToCreate)
    setupModel(GetHashKey(PedToCreate.modelHash))
    pedCreated = CreatePed(4, PedToCreate.modelHash, PedToCreate.x, PedToCreate.y, PedToCreate.z - 1, PedToCreate.rotation, false, false)
    SetEntityAsMissionEntity(pedCreated, true, true)
    IsEntityStatic(pedCreated, true)
    FreezeEntityPosition(pedCreated, true)
    SetBlockingOfNonTemporaryEvents(pedCreated, true)
    SetEntityInvincible(pedCreated, true)
end

RegisterNetEvent("soz-job:client:spawn-ped")
AddEventHandler("soz-job:client:spawn-ped", function(NPC)
    Citizen.CreateThread(function()
        while true do
            Citizen.Wait(0)
            if (not generalLoaded) then
                if NetworkIsHost() then
                    for i = 1, #NPC, 1 do
                        pedCreation_basic(NPC[i])
                        Citizen.Wait(10)
                    end
                end
                generalLoaded = true
            end
        end
    end)
end)
