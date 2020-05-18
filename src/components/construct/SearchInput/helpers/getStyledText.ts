export interface IStyledText {
    bold: boolean;
    value: string;
}

export function getStyledText(text: string, bold: Array<[number, number]>): IStyledText[] {
    const styledText: IStyledText[] = [];
    let { intervals, firstBold: curBold } = getIntervals(bold, text.length);

    for (let i = 1; i < intervals.length; i++) {
        const a = intervals[i - 1];
        const b = intervals[i];

        styledText.push({
            value: text.slice(a, b),
            bold: curBold
        });

        curBold = !curBold;
    }

    return styledText;
}

interface IIntervals {
    intervals: number[];
    firstBold: boolean;
}

function getIntervals(bold: Array<[number, number]>, size: number): IIntervals {
    const intervals: number[] = [];
    const firstBold = bold[0] && bold[0][0] === 0;

    if (!firstBold) {
        intervals.push(0);
    }

    for (const b of bold) {
        intervals.push(b[0]);
        intervals.push(b[1]);
    }

    if (intervals[intervals.length - 1] !== size) {
        intervals.push(size);
    }

    return {
        intervals,
        firstBold
    };
}
