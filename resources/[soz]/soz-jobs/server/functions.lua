SozJobCore.Functions = {}

SozJobCore.Functions.HasPermission = function(targetJobId, jobID, jobGrade, permission)
    return CheckJobPermission(targetJobId, jobID, jobGrade, permission)
end
