RegisterServerEvent("job:set:unemployed", function()
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    TriggerClientEvent("soz-core:client:notification:draw", source, string.format("Vous êtes à nouveau sans emploi"))
    Player.Functions.SetJob(SozJobCore.JobType.Unemployed, nil)
end)

RegisterServerEvent("job:set:pole", function(jobId)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    local job = SozJobCore.Jobs[jobId]

    if not job then
        return
    end

    TriggerClientEvent("soz-core:client:notification:draw", source, string.format("Vous commencez le travail: %s", job.label))

    local gradeId = nil

    for id, grade in ipairs(job.grades) do
        if grade.is_default == 1 then
            gradeId = id

            break
        end
    end

    Player.Functions.SetJob(jobId, GetJobDefaultGrade(jobId))
end)

RegisterServerEvent("job:payout", function(money)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    Player.Functions.AddMoney("money", money)
    TriggerClientEvent("soz-core:client:notification:draw", source, string.format("Vous recevez: %s $ pour votre travail", money))
end)

RegisterServerEvent("job:anounce", function(string)
    TriggerClientEvent("soz-core:client:notification:draw", source, string.format(string))
end)
