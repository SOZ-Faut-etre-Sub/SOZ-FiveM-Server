const IDENTITY = {
    lastName: "Nom",
    firstName: "Prénom(s)",
    gender: "Sexe",
    job: "Profession",
    address: "Domicile - Adresse",
    phone: "Numéro de téléphone"
};

const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14;

function displayMugshot(mugshot) {
    const img = new Image();
    img.src = `https://nui-img/${mugshot}/${mugshot}`;

    const containerElement = document.querySelector("#left-col-identity");
    containerElement.innerHTML = null;
    containerElement.appendChild(img);
}

function displayIdentityData(playerData) {
    const identityElement = document.querySelector("#right-col-identity");
    const pictureElement = document.querySelector("#left-col-identity");
    const newPlayerBadgeElement = document.querySelector("#identity-new-player-badge");

    // Reset any existing content
    identityElement.innerHTML = null;
    pictureElement.innerHTML = null;

    if (new Date().getTime() - playerData.created_at < TWO_WEEKS) {
        newPlayerBadgeElement.style.display = "block";
    } else {
        newPlayerBadgeElement.style.display = "none";
    }

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
