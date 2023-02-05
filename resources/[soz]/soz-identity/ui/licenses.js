const LICENSES = {
    car: { type: "car", verbose: "VOITURE", hasPoint: true },
    truck: { type: "truck", verbose: "POID-LOURD", hasPoint: true },
    motorcycle: { type: "motorcycle", verbose: "MOTO", hasPoint: true },
    heli: { type: "heli", verbose: "HÉLICOPTÈRE", hasPoint: true },
    boat: { type: "boat", verbose: "BÂTEAU", hasPoint: true },
    weapon: { type: "weapon", verbose: "PORT D'ARME" },
    hunting: { type: "hunting", verbose: "CHASSE" },
    fishing: { type: "fishing", verbose: "PÊCHE" },
    rescuer: { type: "rescuer", verbose: "SECOURISTE" }
};

function displayLicensesData(playerLicenses = {}) {
    const validitiesElement = document.querySelector('#validities');
    const pointsElement = document.querySelector('#points');

    // Reset any existing content
    validitiesElement.innerHTML = null;
    pointsElement.innerHTML = null;

    Object.entries(LICENSES).forEach(([licenseType, data]) => {
        const playerLicenseData = playerLicenses[licenseType];

        // Add license type and validity
        const validity = !!playerLicenseData ? "VALIDE" : "NON VALIDE";
        validitiesElement.innerHTML += `
            <div class="item small">
                <div class="text-small">${data.verbose}</div>
                <div class="text-bold small-lh">${validity}</div>
            </div>
        `;

        // Add points
        if (data.hasPoint) {
            const points = playerLicenseData || 0;
            pointsElement.innerHTML += `
                <div class="item text-center">
                    <div class="text-bold text-small small-lh">
                        ${!!points ? points + " POINTS" : "-"}
                    </div>
                </div>
            `;
        } else {
            pointsElement.innerHTML += "<div></div>";
        }
    });
};

function displayPlayerName(firstName = '', lastName = '') {
    const firstNameElement = document.querySelector("#first_name");
    const lastNameElement = document.querySelector("#last_name");

    firstNameElement.innerText = firstName.toUpperCase();
    lastNameElement.innerText = lastName.toUpperCase();
};
