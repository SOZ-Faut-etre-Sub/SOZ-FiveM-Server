

function Dealership:GenerateVehicleButton(vehicle)
    local label = vehicle.name
    local description = "Acheter " .. label
    local value = self.confirmMenu
    local select = function()
        self:GenerateConfirmMenu(vehicle)
    end
    if vehicle.stock == 0 then
        label = "^9" .. label
        description = "❌ HORS STOCK de " .. label
        select = function()
        end
        value = nil
    elseif vehicle.stock == 1 then
        label = "~o~" .. label
        description = "⚠ Stock limité de  " .. label
    end
    return {
        label = label,
        rightLabel = "💸 $" .. QBCore.Shared.GroupDigits(vehicle.price),
        value = value,
        description = description,
        select = select,
        enter = function()
            self:CleanVehicleSpawn()
            self:VisualizeVehicle(vehicle)
        end,
    }
end
