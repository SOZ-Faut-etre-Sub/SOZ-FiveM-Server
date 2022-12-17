import { InventoryItem } from '../types/inventory';

export const handleSortInventory = (inventoryId: string, callback: any) => {
    fetch(`https://soz-inventory/sortInventoryAZ`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
            inventory: inventoryId,
        }),
    })
        .then((res) => res.json())
        .then((transfert) => {
            if (typeof transfert.sourceInventory === "object") {
                transfert.sourceInventory.items = Object.values(transfert.sourceInventory.items);
            }

            transfert.sourceInventory.items = transfert.sourceInventory.items.filter((i: InventoryItem) => i !== null)
            callback(transfert.sourceInventory);
        })
        .catch((e) => {
        console.error("Failed to sort inventory", e);
    });
}
