SozJobCore.Functions = {}

SozJobCore.Functions.HasPermission = function(targetJobId, permission)
    return CheckJobPermission(targetJobId, PlayerData.job.id, PlayerData.job.grade, permission)
end

SozJobCore.Functions.GetDutyActions = function()
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

function CheckJobPermission(targetJobId, jobId, gradeId, permission)
    if targetJobId ~= jobId then
        return false
    end

    if not SozJobCore.Jobs[jobId] then
        return false
    end

    local job = SozJobCore.Jobs[jobId]

    if not job.grades[tostring(gradeId)] then
        return false
    end

    local grade = job.grades[tostring(gradeId)]

    if grade.owner == 1 then
        return true
    end

    permissions = grade.permissions

    for _, v in pairs(permissions) do
        if v == permission then
            return true
        end
    end

    return false
end
