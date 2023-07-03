export default {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render: (template: string, v: {
        [key: string]: unknown
    }): string => {
        return template.replace(/@{([^@{}]+)}/g, (substring, one) => {
            return eval(one);
        });
    },
    extractVariables: (html: string, patternToExtract: RegExp): string[] => {
        if (!patternToExtract.flags.includes('g')) {
            patternToExtract = new RegExp(patternToExtract.source, patternToExtract.flags + 'g');
        }

        return html.match(patternToExtract) || [];
    }
};
