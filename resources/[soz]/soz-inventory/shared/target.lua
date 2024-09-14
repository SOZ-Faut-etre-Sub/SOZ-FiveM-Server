function getCloakroomTargetOptions(job, storage, event)
    return {
        {
            type = "client",
            label = "Se changer",
            icon = "jobs/habiller",
            category = "society",
            canInteract = function()
                return PlayerData.job.id == job
            end,
            action = function()
                TriggerEvent(event or "soz-core:client:job::OpenCloakroomMenu", storage, job)
            end,
        },
        {
            label = "Vérifier le stock",
            icon = "jobs/check-stock",
            job = job,
            category = "society",
            action = function()
                TriggerEvent("soz-jobs:client:check-cloakroom-storage", storage)
            end,
        },
        {
            icon = "inventory/archive",
            label = "Ouvrir mon casier",
            category = "society",
            canInteract = function()
                return PlayerData.job.id == job
            end,
            action = function()
                TriggerServerEvent("inventory:server:openInventory", "stash", job .. "_" .. PlayerData.citizenid)
            end,
        },
    }
end

function concatTables(t1, t2)
    for i = 1, #t2 do
        t1[#t1 + 1] = t2[i]
    end
    return t1
end
