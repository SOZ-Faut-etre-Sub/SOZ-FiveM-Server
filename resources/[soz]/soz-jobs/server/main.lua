MySQL.ready(function()
    SynchroniseJob()
end)

local function SynchroniseJob()
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
