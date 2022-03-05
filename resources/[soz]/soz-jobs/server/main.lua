MySQL.ready(function()
    SynchroniseJob()
end)

local function SynchroniseJob()
    local jobGrades = MySQL.query.await("SELECT * FROM job_grades", {})

    if jobGrades then
        for _, jobGrade in pairs(jobGrades) do
            local job = Config.Jobs[v.jobId];

            if not job then
                exports["soz-monitor"]:Log("ERROR", ("Job %s (grade %s) is not present in configuration !"):format(v.jobId, v.name))
                goto continue
            end

            job.grades[v.name] = jobGrade

            ::continue::
        end
    end
end
