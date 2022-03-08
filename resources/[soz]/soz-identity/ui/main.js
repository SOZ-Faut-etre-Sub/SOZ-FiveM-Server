function Delay(delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}

async function HideUI(...elements) {
    elements.forEach(el => {
        el.style.opacity = 0;
    });
    await Delay();
    elements.forEach(el => {
        el.style.display =  "none";
    });
    return;
}

let timeout
function SetTimeout() {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
        setVisible(false);
    }, 4000);
}

async function setVisible(value) {
    const identityElement = document.querySelector("#identity");
    const licensesElement = document.querySelector("#licenses");

    if (value && !timeout) {
        // Display document when nothing on screen
        SetTimeout();

    } else if (value && timeout) {
        // Display document while one is already being displayed
        await HideUI(identityElement, licensesElement);
        SetTimeout();

    } else if (!value && timeout) {
        // Hide any document
        clearTimeout(timeout);
        await HideUI(identityElement, licensesElement);
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
    const scope = event.data.scope
    const type = event.data.type

    if (scope === "identity" && type === "show") {
        displayIdentityData(event.data);
        setVisible(event.data.scope);
    }
    
    if (scope === "licenses" && type === "show") {
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
