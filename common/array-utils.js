const difference = (array1, array2) => {
    return array1.filter((e) => !array2.includes(e));
};

const intersection = (array1, array2) => {
    return array1.filter((e) => array2.includes(e));
};

const intersectionMulti = (...arrays) => {
    return arrays[0].filter((e) =>
        arrays
            .slice(1)
            .reduce((isCommon, arr) => isCommon && arr.includes(e), true)
    );
};

const union = (array1, array2) => {
    return [...array1, ...array2];
};

const permutate = (inputArr) => {
    let result = [];

    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m);
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
            }
        }
    };

    permute(inputArr);

    return result;
};

function combinate(elements, length) {
    if (length === 0) {
        return [[]];
    }

    let combinations = [];
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let subcombinations = combinate(elements.slice(i + 1), length - 1);
        subcombinations.forEach((combination) => {
            combinations.push([element, ...combination]);
        });
    }

    return combinations;
}

const simpleIdentity = (array1, array2) => {
    return array1.sort().join(',') === array2.sort().join(',');
};

module.exports = {
    difference,
    intersection,
    intersectionMulti,
    union,
    permutate,
    combinate,
    simpleIdentity,
};
