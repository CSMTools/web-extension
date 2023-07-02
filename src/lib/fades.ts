export function getGradient(type: string, fadePercentage: number) {
    if (type === 'Fade') {
        return getGradientFade(fadePercentage);
    }

    if (type === 'Acid Fade') {
        return getGradientAcidFade(fadePercentage);
    }

    if (type === 'Amber Fade') {
        return getGradientAmberFade(fadePercentage);
    }

    return 'transparent';
}

function getGradientFade(fadePercentage: number) {
    let style = 'linear-gradient(to right, #605c89 %purple%, #ff6e98 %pink%, #ffb559 %yellow%, #8D918D 100%)';
    let purple = 0;

    if (fadePercentage >= 97.5) {
        purple = 10;
    } else if (fadePercentage >= 95) {
        purple = 7.5;
    } else if (fadePercentage >= 90) {
        purple = 5;
    } else if (fadePercentage >= 85) {
        purple = 2.5;
    } else if (fadePercentage >= 80) {
        purple = 1;
    }

    const reversePurple = 10 - purple;

    style = style.replace('%purple', purple.toString());
    style = style.replace('%pink', (30 - reversePurple).toString());
    style = style.replace('%yellow', (70 - reversePurple).toString());

    return style;
}

function getGradientAmberFade(fadePercentage: number) {
    let style = 'linear-gradient(to right, #8D918D %gray%, #404231 %green%, #60351f %orange%, #775c36 %yellow%)';
    let gray = 0;

    if (fadePercentage >= 97.5) {
        gray = 1;
    } else if (fadePercentage >= 95) {
        gray = 2;
    } else if (fadePercentage >= 90) {
        gray = 3;
    } else if (fadePercentage >= 85) {
        gray = 5;
    } else if (fadePercentage >= 80) {
        gray = 6;
    }

    const revGray = 10 - gray;

    const green = gray + 30;
    const orange = green + 40;
    const yellow = orange + 20 + revGray;

    style = style.replace('%gray', gray.toString());
    style = style.replace('%green', green.toString());
    style = style.replace('%orange', orange.toString());
    style = style.replace('%yellow', yellow.toString());

    return style;
}

function getGradientAcidFade(fadePercentage: number) {
    let style = 'linear-gradient(to right, #8D918D %gray%, #6f7836 %acid%, #8a764a %yellow%, #7b663b %gold%)';
    let gray = 0;

    if (fadePercentage >= 97.5) {
        gray = 5;
    } else if (fadePercentage >= 95) {
        gray = 20;
    } else if (fadePercentage >= 90) {
        gray = 30;
    } else if (fadePercentage >= 85) {
        gray = 40;
    } else if (fadePercentage >= 80) {
        gray = 70;
    }

    const acid = gray;
    const yellow = acid + 50;
    const gold = yellow + 10;

    style = style.replace('%gray', gray.toString());
    style = style.replace('%acid', acid.toString());
    style = style.replace('%yellow', yellow.toString());
    style = style.replace('%gold', gold.toString());

    return style;
}

export function isFade(paintIndex: number): boolean {
    return [38, 522, 752, 1026].includes(paintIndex);
}

export function isAmberFade(paintIndex: number): boolean {
    return [246, 523].includes(paintIndex);
}

export function isAcidFade(paintIndex: number): boolean {
    return paintIndex === 253;
}

export function isBerriesAndCherries(paintIndex: number): boolean {
    return paintIndex === 1002;
}

export function isAnyFade(paintIndex: number): boolean {
    return isFade(paintIndex) || isAmberFade(paintIndex) || isAcidFade(paintIndex) || isBerriesAndCherries(paintIndex);
}

export function getFadeName(paintIndex: number): string {
    if (isFade(paintIndex)) {
        return 'Fade';
    }

    if (isAmberFade(paintIndex)) {
        return 'Amber Fade';
    }

    if (isAcidFade(paintIndex)) {
        return 'Acid Fade';
    }

    if (isBerriesAndCherries(paintIndex)) {
        return 'Berries and Cherries';
    }

    return '';
}
