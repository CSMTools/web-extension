// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const render = (template: string, v: {
    [key: string]: unknown
}): string => {
    return template.replace(/@{([^@{}]+)}/g, (substring, one) => {
        return eval(one);
    });
};

export const extractVariables = (html: string, patternToExtract: RegExp): string[] => {
    if (!patternToExtract.flags.includes('g')) {
        patternToExtract = new RegExp(patternToExtract.source, patternToExtract.flags + 'g');
    }

    return html.match(patternToExtract) || [];
};
