local seatBeltState = false
AddEventHandler("hud:client:UpdateSeatbelt", function(newState)
    seatBeltState = newState
end)

local undrivableVehicles = {}
AddEventHandler("gameEventTriggered", function(name, args)
    if name == "CEventNetworkVehicleUndrivable" then
        local ped = args[1]
        if GetEntityType(ped) == 2 and IsEntityDead(ped) then
            table.insert(undrivableVehicles, ped)
        end
    end
end)

local function GetPenalties(licenseType)
    local all_penalties = {
        ["overspeed"] = {
            duration = 0,
            warning = false,
            warningMsg = "Attention à ta vitesse ! Ne dépasse pas les 90 km/h.",
            failMsg = "Tu n'as pas su maîtriser ta vitesse. On arrête là...",
            isValid = function(context)
                local speed = math.ceil(GetEntitySpeed(context.vehicle) * 3.6)
                if speed > 90.0 then
                    return false
                end
                return true
            end,
        },

        ["out_of_veh"] = {
            duration = 0,
            warning = false,
            warningMsg = "Remonte dans le vehicule !",
            failMsg = "Pour passer le permis, il faut être DANS le véhicule !",
            isValid = function(context)
                local inVehicle = IsPedInAnyVehicle(context.player, true)
                if not inVehicle then
                    return false
                end

                local vehIn = GetVehiclePedIsIn(context.player, false)
                return vehIn == context.vehicle
            end,
        },

        ["seatbelt"] = {
            exclude = {"motorcycle"},
            duration = 0,
            warning = false,
            warningMsg = "Boucle ta ceinture ! La sécurité avant tout.",
            failMsg = "La ceinture ce n'est pas pour les ienchs ! C'est terminé.",
            isValid = function()
                return seatBeltState
            end,
        },

        ["undrivable"] = {
            duration = Config.PenaltyMaxDuration,
            noWarning = true,
            failMsg = "C'est perdu ! Ce véhicule n'ira plus très loin...",
            isValid = function(context)
                for i = 1, #undrivableVehicles, 1 do
                    if undrivableVehicles[i] == context.vehicle then
                        return false
                    end
                end
                return true
            end,
        },

        ["phone"] = {
            duration = 0,
            warning = false,
            warningMsg = "Range ce téléphone ! Regarde la route !",
            failMsg = "Le téléphone est interdit au volant !",
            isValid = function()
                return not exports["soz-phone"]:isPhoneVisible()
            end,
        },

        ["damage"] = {
            duration = 0,
            warning = false,
            minThreshold = 950,
            warningThreshold = 995,
            warningMsg = "Ne casse pas tout ! Attention aux dégâts.",
            failMsg = "C'est trop de dégâts ! On arrête les frais.",
            isValid = function(context)
                local this = context.self
                local health = GetEntityHealth(context.vehicle)
                if health <= this.warningThreshold then
                    -- Since this penalty is not time based, duration is manually set every iteration
                    this.duration = Config.PenaltyTickDelay + 1
                    if health >= this.minThreshold then
                        if not this.warning then
                            return false
                        end
                    else
                        this.duration = Config.PenaltyMaxDuration
                        return false
                    end
                end
                return true
            end,
        },
    }

    -- Filter penalties to remove excluded ones for this license type
    local penalties = {}
    for key, data in pairs(all_penalties) do
        local toBeExcluded = false
        if data.exclude and type(data.exclude) == "table" then
            for _, license in ipairs(data.exclude) do
                if license == licenseType then
                    toBeExcluded = true
                end
            end
        end
        if not toBeExcluded then
            penalties[key] = data
        end
    end
    return penalties
end

local penalties
local penaltyLoopIsRunning = false
function PenaltyCheckingLoop(context)
    penaltyLoopIsRunning = true
    penalties = GetPenalties(context.licenseType)

    Citizen.CreateThread(function()
        while penaltyLoopIsRunning do
            for _, p in pairs(penalties) do

                context.self = p -- Add penalty definition to context

                if p.isValid and not p.isValid(context) then
                    local newDuration = p.duration + Config.PenaltyTickDelay
                    p.duration = newDuration

                    -- Trigger warning
                    if not p.noWarning and newDuration > 0 and not p.warning then
                        DiplayInstructorNotification("WARNING", p)
                    end

                    -- Terminate exam
                    if newDuration >= Config.PenaltyMaxDuration then
                        DiplayInstructorNotification("FAIL", p)
                        TerminateExam(false)
                    end

                    -- Decrement penalty cooldown
                elseif not p.noWarning and p.duration and p.duration > 0 then
                    if p.duration <= Config.PenaltyTickDelay then
                        p.duration = 0
                        p.warning = false

                    else
                        p.duration = p.duration - Config.PenaltyTickDelay

                    end
                end
            end

            Citizen.Wait(Config.PenaltyTickDelay)
        end
    end)
end

---PenaltyLoop start is deferred until car moves
---@param context table Contextual data that is to be used during penalty checking loop
function StartPenaltyLoop(playerCoords, context)
    if not penaltyLoopIsRunning then
        local coords = context.spawnPoint
        local vehicleCoords = vector3(coords.x, coords.y, coords.z)
        if #(playerCoords - vehicleCoords) > 1.0 then
            PenaltyCheckingLoop(context)
        end
    end
end

---Reset penalty system
function CleanUpPenaltySystem()
    -- Terminate penalty loop
    penaltyLoopIsRunning = false
    -- Reset penalties table
    penalties = nil
    -- Reset default values
    seatBeltState = false
    undrivableVehicles = {}
end
