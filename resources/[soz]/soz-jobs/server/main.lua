MySQL.ready(function()
    SynchroniseJob()
end)

function SynchroniseJob()
    local jobGrades = MySQL.query.await("SELECT * FROM job_grades", {})
    local tmpGrades = {}

    for _, jobId in Config.JobType do
        tmpGrades[jobId] = {}
    end

    if jobGrades then
        for _, jobGrade in pairs(jobGrades) do
            if not Config.Jobs[v.jobId] then
                exports["soz-monitor"]:Log("ERROR", ("Job %s (grade %s) is not present in configuration !"):format(v.jobId, v.name))
                goto continue
            end

            tmpGrades[jobId][v.name] = jobGrade

            ::continue::
        end
    end

    for _, jobId in Config.JobType do
        Config.Jobs[jobId].grades = tmpGrades[jobId]
    end
end

function CheckJobPermission(jobId, gradeId, permission)
    if not Config.Jobs[jobId] then
        return false
    end

    if not Config.Jobs[jobId].grades[gradeId] then
        return false
    end

    local grade = Config.Jobs[jobId].grades[gradeId]

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
