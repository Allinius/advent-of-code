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

const GCD = (a, b) => {
    if (b === 0) {
        return a;
    } else {
        return GCD(b, a % b);
    }
};
const LCM = (a, b) => {
    return (a * b) / GCD(a, b);
};

// Calculate LCM for an array of numbers
const arrayLCM = (numbers) => {
    if (numbers.length === 0) {
        return null;
    } else if (numbers.length === 1) {
        return numbers[0];
    } else {
        let lcm = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
            lcm = LCM(lcm, numbers[i]);
        }
        return lcm;
    }
};

const sumFromTo = (from, to) => {
    if (from > to) {
        [from, to] = [to, from];
    }
    const diff = to - from;
    if (diff % 2 === 0) {
        return (diff + 1) * (from + diff / 2);
    } else {
        return diff * (from + Math.floor(diff / 2)) + to;
    }
};

module.exports = {
    intervalUnion,
    intervalIntersection,
    positiveModulo,
    GCD,
    LCM,
    arrayLCM,
    sumFromTo,
};
