--- @class AccountShell
AccountShell = {}

function AccountShell.new()
    return setmetatable({}, {
        __index = AccountShell,
        __tostring = function()
            return "AccountShell"
        end,
    })
end

--- load
--- @param id any
--- @param owner any
--- @return table, boolean
function AccountShell:load(id, owner)
    print("^8" .. tostring(self) .. ":load() is not implemented !")
    return {}, false
end

--- save
--- @param id any
--- @param owner any
--- @param inventory string
--- @return boolean
function AccountShell:save(id, owner, inventory)
    print("^8" .. tostring(self) .. ":save() is not implemented !")
    return false
end
