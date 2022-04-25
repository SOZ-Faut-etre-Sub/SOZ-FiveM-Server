RegisterNetEvent("admin:jobs:setjob", function(jobID, gradeId)
    local Player = QBCore.Functions.GetPlayer(source)
    Player.Functions.SetJob(jobID, gradeId)
end)
