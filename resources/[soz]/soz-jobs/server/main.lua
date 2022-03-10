local QBCore = exports["qb-core"]:GetCoreObject()

MySQL.ready(function()
    SynchroniseJob()
end)

function SynchroniseJob()
    local jobGrades = MySQL.query.await("SELECT * FROM job_grades", {})
    local tmpGrades = {}

    for _, jobId in pairs(Config.JobType) do
        tmpGrades[jobId] = {}
    end

    if jobGrades then
        for _, jobGrade in ipairs(jobGrades) do
            if not Config.Jobs[jobGrade.jobId] then
                exports["soz-monitor"]:Log("ERROR", ("Job %s (grade %s) is not present in configuration !"):format(jobGrade.jobId, jobGrade.name))
                goto continue
            end

            jobGrade.permissions = json.decode(jobGrade.permissions)
            tmpGrades[jobGrade.jobId][tostring(jobGrade.id)] = jobGrade

            ::continue::
        end
    end

    for _, jobId in pairs(Config.JobType) do
        Config.Jobs[jobId].grades = tmpGrades[jobId]
    end

    TriggerClientEvent("soz-jobs:Client:OnJobSync", -1, Config.Jobs)
end

function CheckJobPermission(jobId, gradeId, permission)
    if not Config.Jobs[jobId] then
        return false
    end

    if not Config.Jobs[jobId].grades[tostring(gradeId)] then
        return false
    end

    local grade = Config.Jobs[jobId].grades[tostring(gradeId)]

    if grade.owner == true then
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

QBCore.Functions.CreateCallback("soz-jobs:HasJobGradePermission", function(source, cb, jobId, gradeId, permission)
    cb(CheckJobPermission(jobId, gradeId, permission))
end)

QBCore.Functions.CreateCallback("soz-jobs:HasPlayerPermission", function(source, cb, permission)
    local player = QBCore.Functions.GetPlayer(source)

    cb(CheckJobPermission(player.PlayerData.job.id, player.PlayerData.job.grade.id, permission))
end)

RegisterServerEvent("soz-jobs:AskJobSync", function()
    TriggerClientEvent("soz-jobs:Client:OnJobSync", source, Config.Jobs)
end)
