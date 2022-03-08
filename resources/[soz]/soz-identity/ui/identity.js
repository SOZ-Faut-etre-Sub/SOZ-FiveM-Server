const IDENTITY = {
    nationality: "Nationalité",
    lastName: "Nom",
    firstName: "Prénom(s)",
    gender: "Sexe",
    address: "Domicile - Adresse",
    phone: "Numéro de téléphone"
}

function displayLicensesData(...playerData) {
    const identityElement = document.querySelector("#right-col-identity");

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
