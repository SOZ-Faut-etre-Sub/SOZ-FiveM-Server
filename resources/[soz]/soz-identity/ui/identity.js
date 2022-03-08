const IDENTITY = {
    nationality: "Nationalité",
    lastName: "Nom",
    firstName: "Prénom(s)",
    gender: "Sexe",
    address: "Domicile - Adresse",
    phone: "Numéro de téléphone"
}

function displayIdentityData(playerData) {
    const identityElement = document.querySelector("#right-col-identity");

    // Reset any existing content
    identityElement.innerHTML = null

    Object.entries(IDENTITY).forEach(([key, label]) => {
        const value = playerData[key];
        identityElement.innerHTML += `
            <div>
                <div class="text-small">${label}</div>
                <div>${value.toUpperCase()}</div>
            </div>
        `;
    });
};
