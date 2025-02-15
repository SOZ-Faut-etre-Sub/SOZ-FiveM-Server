export const urlIsImage = url => {
    return /(http(s?):)([/|.\w\s-])*\.(?:jpg|png|jpeg|gif|webp)/g.test(url);
};
