PoliceJob.Functions = {}

---@param job string
PoliceJob.Functions.GetCloakroomAction = function(job)
    return {
        {
            targeticon = "fas fa-box",
            icon = "fas fa-archive",
            event = "police:cloakroom:openStash",
            label = "Ouvrir mon casier",
            job = job,
        },
    }
end
