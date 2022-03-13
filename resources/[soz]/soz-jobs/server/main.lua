local QBCore = exports["qb-core"]:GetCoreObject()

exports("GetCoreObject", function()
    return SozJobCore
end)

MySQL.ready(function()
    SynchroniseJob()
end)

function SynchroniseJob()
    local jobGrades = MySQL.query.await("SELECT * FROM job_grades", {})
    local tmpGrades = {}

    for _, jobId in pairs(SozJobCore.JobType) do
        tmpGrades[jobId] = {}
    end

    if jobGrades then
        for _, jobGrade in ipairs(jobGrades) do
            if not SozJobCore.Jobs[jobGrade.jobId] then
                exports["soz-monitor"]:Log("ERROR", ("Job %s (grade %s) is not present in SozJobCore !"):format(jobGrade.jobId, jobGrade.name))
                goto continue
            end

            jobGrade.permissions = json.decode(jobGrade.permissions)
            tmpGrades[jobGrade.jobId][tostring(jobGrade.id)] = jobGrade

            ::continue::
        end
    end

    for _, jobId in pairs(SozJobCore.JobType) do
        SozJobCore.Jobs[jobId].grades = tmpGrades[jobId]
    end

    TriggerClientEvent("soz-jobs:Client:OnJobSync", -1, SozJobCore.Jobs)
end

function CheckPlayerJobPermission(player, permission)
    if not player then
        return false
    end

    return CheckJobPermission(player.job.id, player.job.grade, permission)
end

function GetJobDefaultGrade(jobId)
    local gradeId
    local job = SozJobCore.Jobs[jobId]

    if not job then
        return gradeId
    end

    for id, grade in ipairs(job.grades) do
        if grade.is_default == 1 then
            gradeId = id

            break
        end
    end

    return gradeId
end

function CheckJobPermission(jobId, gradeId, permission)
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

QBCore.Functions.CreateCallback("soz-jobs:GetPlayerJob", function(source, cb, target)
    local targetPlayer = QBCore.Functions.GetPlayer(tonumber(target))

    cb(targetPlayer.PlayerData.job)
end)

RegisterServerEvent("soz-jobs:AskJobSync", function()
    TriggerClientEvent("soz-jobs:Client:OnJobSync", source, SozJobCore.Jobs)
end)
