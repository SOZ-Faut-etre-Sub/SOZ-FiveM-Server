const LICENSES = {
    car: {
        icon: "&#x1f697;",
        type: "car",
        verbose: "VOITURE",
        hasPoint: true
    },
    truck: {
        icon: "&#x1f69a;",
        type: "truck",
        verbose: "POID-LOURD",
        hasPoint: true
    },
    motorcycle: {
        icon: "&#x1f6f5;",
        type: "motorcycle",
        verbose: "MOTO",
        hasPoint: true
    },
    heli: {
        icon: "&#x1f681;",
        type: "heli",
        verbose: "HÉLICOPTÈRE",
        hasPoint: true
    },
    boat: {
        icon: "&#x26f5;",
        type: "boat",
        verbose: "BÂTEAU",
        hasPoint: true
    },
    weapon: {
        icon: "&#x1f52b;",
        type: "weapon",
        verbose: "PORT D'ARME"
    },
    hunting: {
        icon: "&#x1f98c;",
        type: "hunting",
        verbose: "CHASSE"
    },
    fishing: {
        icon: "&#x1f3a3;",
        type: "fishing",
        verbose: "PÊCHE"
    },
    rescuer: {
        icon: "&#x26d1;&#xfe0f;",
        type: "rescuer",
        verbose: "SECOURISTE"
    }
};

function displayLicensesData(playerLicenses = {}) {
    const iconsElement = document.querySelector('#icons');
    const licensesElement = document.querySelector('#licenses');
    const pointsElement = document.querySelector('#points');

    // Reset any existing content
    iconsElement.innerHTML = null;
    licensesElement.innerHTML = null;
    pointsElement.innerHTML = null;

    Object.entries(LICENSES).forEach(([licenseType, data]) => {
        const playerLicenseData = playerLicenses[licenseType];


        // Add icon
        iconsElement.innerHTML += `<div class="item">${data.icon}</div>`;

        // Add license type anc validity
        const validity = !!playerLicenseData ? "VALIDE" : "NON VALIDE";
        licensesElement.innerHTML += `
            <div class="item small">
                <div class="text-small">${data.verbose}</div>
                <div class="text-bold small-lh" id="validity-car">${validity}</div>
            </div>
        `;

        // Add points
        if (data.hasPoint) {
            const points = playerLicenseData || 0;
            console.log('pts', points, licenseType)
            pointsElement.innerHTML += `
                <div class="item">
                <div class="text-bold small-lh">
                <span>${points}</span>
                <span class="text-small">PTS</span>
                </div>
                </div>
            `;
        } else {
            pointsElement.innerHTML += "<div></div>";
        }
    });
}

function displayPlayerName(firstName = '', lastName = '') {
    const firstNameElement = document.querySelector("#first_name");
    const lastNameElement = document.querySelector("#last_name");

    firstNameElement.innerText = firstName.toUpperCase();
    lastNameElement.innerText = lastName.toUpperCase();
}

function setVisible(value) {
    document.querySelector("#wrapper").style.opacity = value ? 1 : 0;
}

window.addEventListener("message", (event) => {
    console.log('EVT', event.data.type);
    if (event.data.type === "show") {
        displayLicensesData(event.data.licences);
        displayPlayerName(
            event.data.firstName,
            event.data.lastName
        );
        setVisible(true);
    }
    if (event.data.type === "hide") {
        setVisible(false);
    }
});
