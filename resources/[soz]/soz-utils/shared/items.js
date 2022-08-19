exports("ItemIsExpired", (item) => {
    if (item && item.metadata !== undefined) {
        if (item.metadata['expiration'] !== undefined) {
            return new Date().getTime() > new Date(item.metadata['expiration']).getTime()
        }
    }
    return false;
});

exports("GetTimestamp", () => {
     return new Date().getTime()
});
