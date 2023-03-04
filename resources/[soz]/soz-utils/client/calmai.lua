local relationshipTypesLike = {"CIVMALE", "CIVFEMALE", "COP", "SECURITY_GUARD", "PRIVATE_SECURITY"}

local relationshipTypesRespect = {
    "GANG_1",
    "GANG_2",
    "GANG_9",
    "GANG_10",
    "AMBIENT_GANG_LOST",
    "AMBIENT_GANG_MEXICAN",
    "AMBIENT_GANG_FAMILY",
    "AMBIENT_GANG_BALLAS",
    "AMBIENT_GANG_MARABUNTE",
    "AMBIENT_GANG_CULT",
    "AMBIENT_GANG_SALVA",
    "AMBIENT_GANG_WEICHENG",
    "AMBIENT_GANG_HILLBILLY",
    "DEALER",
    "HATES_PLAYER",
    "NO_RELATIONSHIP",
    "SPECIAL",
    "MISSION2",
    "MISSION3",
    "MISSION4",
    "MISSION5",
    "MISSION6",
    "MISSION7",
    "MISSION8",
    "AGGRESSIVE_INVESTIGATE",
    "MEDIC",
    "FIREMAN",
}

--[[
Relationship types:
0 = Companion
1 = Respect
2 = Like
3 = Neutral
4 = Dislike
5 = Hate
255 = Pedestrians
]]
for _, group in ipairs(relationshipTypesRespect) do
    SetRelationshipBetweenGroups(1, GetHashKey(group), GetHashKey("PLAYER"))
end
for _, group in ipairs(relationshipTypesLike) do
    SetRelationshipBetweenGroups(2, GetHashKey(group), GetHashKey("PLAYER"))
end
