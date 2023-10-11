PoliceJob.Functions = {}

PoliceJob.Functions.IsJobAllowed = function()
    for _, allowedJob in ipairs(Config.AllowedJobInteraction) do
        if PlayerData.job.id == allowedJob then
            return true
        end
    end

    return false
end

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

---@param job string
PoliceJob.Functions.GetCloakroomPrisonerAction = function()
    return {
        {
            targeticon = "fas fa-box",
            icon = "fas fa-tshirt",
            event = "soz-core:client:police:SetPrisonerClothes",
            label = "Se changer",
        },
    }
end
