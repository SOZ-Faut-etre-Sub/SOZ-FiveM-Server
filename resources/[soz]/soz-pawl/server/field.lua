--- @class Field
Field = {}

function Field:new(identifier, fieldModel, fieldPositions, refillDelay)
    self.__index = self

    --- Build empty harvest history for initializing the field
    local harvestHistory = {}
    for _, p in pairs(fieldPositions) do
        table.insert(harvestHistory, 0)
    end

    return setmetatable({
        identifier = identifier,
        field = {},
        model = fieldModel,
        positions = fieldPositions,
        refill = refillDelay,
        harvestHistory = harvestHistory,
    }, self)
end

function Field:GetField()
    return self.field
end

function Field:GetCuttedTrees()
    return #self.positions - #self.field
end

---
--- Utils
---
function Field:TreeExistAtPosition(position)
    for _, tree in pairs(self.field) do
        if tree.position == position then
            return true
        end
    end
    return false
end

---
--- Consume the field
---
function Field:RemoveTree(position)
    for k, tree in pairs(self.field) do
        if tree.position == position then
            table.remove(self.field, k)
            table.insert(self.harvestHistory, os.time())

            self:SyncField()
            return true
        end
    end
    return false
end

function Field:Harvest(position)
    if #self.field <= 0 then
        return false
    end

    if not self:TreeExistAtPosition(position) then
        return false
    end

    return self:RemoveTree(position)
end

---
--- Regenerate the field capacity
---
function Field:GenerateTree()
    for _, position in pairs(self.positions) do
        if not self:TreeExistAtPosition(position) then
            return {model = self.model, position = position}
        end
    end
end

function Field:CanRefill()
    for k, time in pairs(self.harvestHistory) do
        if (os.time() - time) * 1000 >= self.refill then
            table.remove(self.harvestHistory, k)
            return true
        end
    end
    return false
end

function Field:Refill()
    if #self.field >= #self.positions then
        return
    end

    if not self:CanRefill() then
        return
    end

    local tree = self:GenerateTree()
    if tree then
        table.insert(self.field, tree)
        self:SyncField()
    end
end

---
--- Workers
---
function Field:RunBackgroundTasks()
    Citizen.CreateThread(function()
        while true do
            self:Refill()

            Citizen.Wait(60 * 1000)
        end
    end)
end

function Field:FullRefillField()
    while #self.field < #self.positions do
        self:Refill()
    end
end

function Field:SyncField()
    TriggerClientEvent("pawl:client:syncField", -1, self.identifier, self.field)
end
