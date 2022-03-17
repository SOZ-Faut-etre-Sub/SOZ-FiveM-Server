SozJobCore.Functions = {}

SozJobCore.Functions.HasPermission = function(jobID, jobGrade, permission)
    return CheckJobPermission(jobID, jobGrade, permission)
end
