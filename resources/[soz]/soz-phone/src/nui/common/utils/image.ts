export const isImage = url => {
    return /(http(s?):)([/|.\w\s-])*\.(?:jpg|png|jpeg|gif|webp)/g.test(url);
};
