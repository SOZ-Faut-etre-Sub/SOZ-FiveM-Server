const getImg = (id: string) => {
    switch (id) {
        case 'housing':
            return 'media/taxApp/housing.webp';
        case 'food':
            return 'media/taxApp/food.webp';
        case 'green':
            return 'media/taxApp/green.webp';
        case 'service':
            return 'media/taxApp/service.webp';
        case 'supply':
            return 'media/taxApp/supply.webp';
        case 'travel':
            return 'media/taxApp/travel.webp';
        case 'vehicle':
            return 'media/taxApp/vehicle.webp';
        case 'weapon':
            return 'media/taxApp/weapon.webp';
        default:
            return '';
    }
};

export default getImg;
