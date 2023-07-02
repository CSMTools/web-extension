export default {
    render: (template: string, variables: {
        [key: string]: string
    }): string => {
        return template.replace(/@{([^@{}]+)}/g, (substring, one) => {
            return variables[one] ?? substring;
        });
    }
};
