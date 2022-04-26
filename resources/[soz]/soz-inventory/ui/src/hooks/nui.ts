function closeNUI(cb: any) {
    fetch(`https://soz-inventory/closeNUI`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({}),
    }).then(cb());
}

export { closeNUI }
