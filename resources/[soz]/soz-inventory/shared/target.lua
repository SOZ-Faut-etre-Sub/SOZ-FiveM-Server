function getCloakroomTargetOptions(job, storage, event)
    return {
        {
            color = job,
            type = "client",
            label = "Se changer",
            icon = "c:jobs/habiller.png",
            storage = storage,
            job = job,
            canInteract = function()
                return true
            end,
            action = function()
                TriggerEvent(event or "soz-core:client:job::OpenCloakroomMenu", storage, job)
            end,
        },
        {
            color = job,
            type = "client",
            label = "Vérifier le stock",
            icon = "c:jobs/check-stock.png",
            storage = storage,
            job = job,
            canInteract = function()
                return PlayerData.job.onduty
            end,
            action = function()
                TriggerEvent("soz-jobs:client:check-cloakroom-storage", storage)
            end,
        },
        {
            color = job,
            targeticon = "fas fa-box",
            icon = "fas fa-archive",
            label = "Ouvrir mon casier",
            job = job,
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
