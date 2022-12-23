const intervalUnion = (intervals) => {
    intervals.sort((a, b) => a.start - b.start);
    const result = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const previous = result[result.length - 1];

        if (current.start <= previous.end) {
            previous.end = Math.max(current.end, previous.end);
        } else {
            result.push(current);
        }
    }
    return result;
};

const intervalIntersection = (intervals) => {
    intervals.sort((a, b) => a.start - b.start);
    const result = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const previous = result[result.length - 1];

        if (current.start <= previous.end) {
            previous.start = Math.max(previous.start, current.start);
            previous.end = Math.min(previous.end, current.end);
        } else {
            result.push(current);
        }
    }
    return result;
};

const positiveModulo = (number, n) => {
    return ((number % n) + n) % n;
};

module.exports = {
    intervalUnion,
    intervalIntersection,
    positiveModulo,
};
