import {BankEvents} from "../../typings/bank";
import {sendMessage} from "../utils/messages";

onNet('QBCore:Player:SetPlayerData', (playerData: any) => {
  sendMessage('BANK', BankEvents.SEND_CREDENTIALS, {
    name: `${playerData["charinfo"]["firstname"]} ${playerData["charinfo"]["lastname"]}`,
    balance: 0
  });
});
