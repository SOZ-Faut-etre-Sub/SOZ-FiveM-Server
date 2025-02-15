export const isImage = (str: string) => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif|webp)/g.test(str);
};
