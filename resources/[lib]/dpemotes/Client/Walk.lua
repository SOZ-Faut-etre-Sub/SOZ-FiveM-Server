function WalkMenuStart(name)
  RequestWalking(name)
  SetPedMovementClipset(PlayerPedId(), name, 0.2)
  RemoveAnimSet(name)
end

function RequestWalking(set)
  RequestAnimSet(set)
  while not HasAnimSetLoaded(set) do
    Citizen.Wait(1)
  end 
end

function WalksOnCommand(source, args, raw)
  local WalksCommand = ""
  for a in pairsByKeys(DP.Walks) do
    WalksCommand = WalksCommand .. ""..string.lower(a)..", "
  end
  EmoteChatMessage(WalksCommand)
  EmoteChatMessage("To reset do /walk reset")
end

function WalkCommandStart(source, args, raw)
  local name = firstToUpper(args[1])

  if name == "Reset" then
      ResetPedMovementClipset(PlayerPedId()) return
  end

  local name2 = table.unpack(DP.Walks[name])
  if name2 ~= nil then
    WalkMenuStart(name2)
  else
    EmoteChatMessage("'"..name.."' is not a valid walk")
  end
end

local WalkstickUsed = false
local WalkstickObject = nil

RegisterNetEvent('dp:Client:UseWalkingStick')
AddEventHandler('dp:Client:UseWalkingStick', function()
  if not WalkstickUsed then
    local ped = PlayerPedId()
    RequestAnimSet('move_heist_lester')
    while not HasAnimSetLoaded('move_heist_lester') do
      Citizen.Wait(1)
    end
    SetPedMovementClipset(ped, 'move_heist_lester', 1.0) 
    WalkstickObject = CreateObject(GetHashKey("prop_cs_walking_stick"), 0, 0, 0, true, true, true)
    AttachEntityToEntity(WalkstickObject, ped, GetPedBoneIndex(ped, 57005), 0.16, 0.06, 0.0, 335.0, 300.0, 120.0, true, true, false, true, 5, true)
  else
    local ped = PlayerPedId()
    if PreviousWalkset ~= nil then
      RequestAnimSet(PreviousWalkset)
      while not HasAnimSetLoaded(PreviousWalkset) do
        Citizen.Wait(1)
      end
      SetPedMovementClipset(ped, PreviousWalkset, 1.0)
    end
    DetachEntity(WalkstickObject, 0, 0)
    DeleteEntity(WalkstickObject)
  end
  WalkstickUsed = not WalkstickUsed
end)
