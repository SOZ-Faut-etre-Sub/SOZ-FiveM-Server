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
            event = "police:client:SetPrisonerClothes",
            label = "Se changer",
        },
    }
end

---@param job string
PoliceJob.Functions.GetDutyAction = function(job)
    return {
        {
            type = "server",
            event = "QBCore:ToggleDuty",
            icon = "fas fa-sign-in-alt",
            label = "Prise de service",
            canInteract = function()
                return not PlayerData.job.onduty
            end,
            job = job,
        },
        {
            type = "server",
            event = "QBCore:ToggleDuty",
            icon = "fas fa-sign-out-alt",
            label = "Fin de service",
            canInteract = function()
                return PlayerData.job.onduty
            end,
            job = job,
        },
    }
end
