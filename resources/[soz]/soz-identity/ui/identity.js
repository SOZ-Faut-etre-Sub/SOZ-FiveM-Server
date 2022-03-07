const IDENTITY = ["Nationalité", "Nom", "Prénom(s)", "Sexe", "Domicile - Adresse", "Numéro de téléphone"];

function displayLicensesData(...playerData) {
    const identityElement = document.querySelector("#right-col-identity");
    for (let index = 0; index < playerData.length; index++) {
        const label = IDENTITY[index] || '';
        const value = playerData[index] || '';
        
        identityElement.innerHTML += `
            <div>
                <div class="text-small">${label}</div>
                <div>${value.toUpperCase()}</div>
            </div>
        `;
    }
};
