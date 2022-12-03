const difference = (array1, array2) => {
    return array1.filter((e) => !array2.includes(e));
};

const intersection = (array1, array2) => {
    return array1.filter((e) => array2.includes(e));
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

const simpleIdentity = (array1, array2) => {
    return array1.sort().join(',') === array2.sort().join(',');
};

module.exports = {
    difference,
    intersection,
    union,
    permutate,
    simpleIdentity,
};
