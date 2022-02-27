const LICENSES = {
    car: {
        type: "car",
        verbose: "VOITURE",
        hasPoint: true
    },
    truck: {
        type: "truck",
        verbose: "POID-LOURD",
        hasPoint: true
    },
    motorcycle: {
        type: "motorcycle",
        verbose: "MOTO",
        hasPoint: true
    },
    heli: {
        type: "heli",
        verbose: "HÉLICOPTÈRE",
        hasPoint: true
    },
    boat: {
        type: "boat",
        verbose: "BÂTEAU",
        hasPoint: true
    },
    weapon: {
        type: "weapon",
        verbose: "PORT D'ARME"
    },
    hunting: {
        type: "hunting",
        verbose: "CHASSE"
    },
    fishing: {
        type: "fishing",
        verbose: "PÊCHE"
    },
    rescuer: {
        type: "rescuer",
        verbose: "SECOURISTE"
    }
};

function displayLicensesData(playerLicenses = {}) {
    const licensesElement = document.querySelector('#licenses');
    const pointsElement = document.querySelector('#points');

    // Reset any existing content
    licensesElement.innerHTML = null;
    pointsElement.innerHTML = null;

    Object.entries(LICENSES).forEach(([licenseType, data]) => {
        const playerLicenseData = playerLicenses[licenseType];

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
                <div class="item text-center">
                    <div class="text-bold text-small small-lh">
                        ${!!points ? points + " POINTS" : "-" }
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
    document.querySelector(".super-wrapper").style.opacity = value ? 1 : 0;
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
