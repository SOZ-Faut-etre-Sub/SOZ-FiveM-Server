function Delay(delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, delay);
    })
}

let timeout
async function setVisible(value) {
    if (value) {
        timeout = setTimeout(() => {
            setVisible(false);
        }, 4000);
    } else if (timeout) {
        clearTimeout(timeout);
    }

    const identityElement = document.querySelector("#identity");
    const licensesElement = document.querySelector("#licenses");

    // HIDE ALL
    if (!value) {
        identityElement.style.opacity = 0;
        licensesElement.style.opacity = 0;
        await Delay(250);
        identityElement.style.display = "none";
        licensesElement.style.display = "none";
        return
    }

    // Display identity or licences
    const fadeIn = async (el) => {
        el.style.display = "flex";
        el.style.opacity = 0;
        await Delay(10);
        el.style.opacity = 1;
    }

    if (value === "identity") await fadeIn(identityElement);
    else if (value === "licenses") await fadeIn(licensesElement);
}

// NUI Events
window.addEventListener("message", (event) => {
    if (event.data.type === "show") {
        displayLicensesData(event.data.licences);
        displayPlayerName(
            event.data.firstName,
            event.data.lastName
        );
        setVisible(event.data.scope);
    }
    if (event.data.type === "hide") {
        setVisible(false);
    }
});
