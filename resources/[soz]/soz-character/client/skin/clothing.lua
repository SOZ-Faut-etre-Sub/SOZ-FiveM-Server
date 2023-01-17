-- Now Depreciated. Use Config.Torsos
function GetProperTorso(ped, drawable, texture)
    local player = PlayerPedId()
    local torsoDrawable, torsoTexture = -1, -1

    if not IsPedModel(ped, "mp_m_freemode_01") and not IsPedModel(ped, "mp_f_freemode_01") then
        return torsoDrawable, torsoTexture
    end

    local topHash = GetHashNameForComponent(player, 11, drawable, texture)

    for i = 0, GetShopPedApparelForcedComponentCount(topHash) do
        local nameHash, enumValue, componentType = GetForcedComponent(topHash, i)

        if componentType == 3 then
            if nameHash == 0 or nameHash == GetHashKey("0") then
                torsoDrawable = enumValue
                torsoTexture = 0
            else
                _, torsoDrawable, torsoTexture = GetComponentDataFromHash(nameHash)
            end
        end
    end

    return torsoDrawable, torsoTexture
end

function GetComponentDataFromHash(hash)
    local blob = string.rep("\0\0\0\0\0\0\0\0", 9 + 16)
    if not Citizen.InvokeNative(0x74C0E2A57EC66760, hash, blob) then
        return nil
    end

    -- adapted from: https://gist.github.com/root-cause/3b80234367b0c856d60bf5cb4b826f86
    local lockHash = string.unpack("<i4", blob, 1)
    local hash = string.unpack("<i4", blob, 9)
    local locate = string.unpack("<i4", blob, 17)
    local drawable = string.unpack("<i4", blob, 25)
    local texture = string.unpack("<i4", blob, 33)
    local field5 = string.unpack("<i4", blob, 41)
    local component = string.unpack("<i4", blob, 49)
    local field7 = string.unpack("<i4", blob, 57)
    local field8 = string.unpack("<i4", blob, 65)
    local gxt = string.unpack("c64", blob, 73)

    return component, drawable, texture, gxt, field5, field7, field8
end
