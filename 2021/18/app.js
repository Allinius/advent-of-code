const fs = require('fs');

const mediumInput = fs.readFileSync('input-medium.txt', 'utf8').split('\n');
const input = fs.readFileSync('input.txt', 'utf8').split('\n');


const mapArrayToNode = (arr, parent = null, depth = 0, type = 'root') => {
    if (!Array.isArray(arr)) {
        return arr;
    }
    const currNode = {
        parent,
        depth,
        type
    }
    currNode.left = mapArrayToNode(arr[0], currNode, depth + 1, 'left');
    currNode.right = mapArrayToNode(arr[1], currNode, depth + 1, 'right');
    return currNode;
}

const parseNumber = (lineInput) => {
    const arr = JSON.parse(lineInput);
    return mapArrayToNode(arr);
}

const findNodeToExplode = (node) => {
    if (typeof node === 'number') {
        return null;
    }
    if (node.depth >= 4) {
        return node;
    }
    return findNodeToExplode(node.left) || findNodeToExplode(node.right);
}

const getSidestChild = (node, direction) => {
    if (typeof node[direction] === 'number') {
        return node;
    }
    return getSidestChild(node[direction], direction);
}

const addToClosest = (node, direction, value) => {
    const oppositeDirection = direction === 'right' ? 'left' : 'right';
    let predecessor = node;
    while (predecessor != null && predecessor.type !== oppositeDirection) {
        predecessor = predecessor.parent;
    }

    if (predecessor == null || predecessor.parent == null) {
        return;
    }
    if (typeof predecessor.parent[direction] === 'number') {
        predecessor.parent[direction] += value;
        return;
    }
    const sidestChild = getSidestChild(predecessor.parent[direction], oppositeDirection);
    sidestChild[oppositeDirection] += value;
}

const explodeNode = (node) => {
    addToClosest(node, 'right', node.right);
    addToClosest(node, 'left', node.left);
    node.parent[node.type] = 0;
}

const findNodeToSplitChild = (node) => {
    if (typeof node === 'number') {
        if (node > 9) {
            return true;
        }
        return false;
    }
    const leftResult = findNodeToSplitChild(node.left);
    const rightResult = findNodeToSplitChild(node.right);
    if ((leftResult && typeof node.left === 'number' && node.left > 9) 
        || (!leftResult && rightResult && typeof node.right === 'number' && node.right > 9)) {
        return node;
    } 
    return leftResult || rightResult;
}

const splitChild = (node) => {
    if (typeof node.left === 'number' && node.left > 9) {
        node.left = {
            parent: node,
            depth: node.depth + 1,
            type: 'left',
            left: Math.floor(node.left / 2),
            right: Math.ceil(node.left / 2)
        }
        return;
    }
    if (typeof node.right === 'number' && node.right > 9) {
        node.right = {
            parent: node,
            depth: node.depth + 1,
            type: 'right',
            left: Math.floor(node.right / 2),
            right: Math.ceil(node.right / 2)
        }
        return;
    }
    return 'no child to split';
}

const treeToString = (node) => {
    if (typeof node === 'number') {
        return node;
    }
    return `[${treeToString(node.left)},${treeToString(node.right)}]`;
}

const solveNumber = (root) => {
    let somethingHappened = true;
    while (somethingHappened) {
        somethingHappened = false;
        const nodeToExplode = findNodeToExplode(root);
        if (nodeToExplode) {
            explodeNode(nodeToExplode);
            somethingHappened = true;
            continue;
        }
        const nodeToSplitChild = findNodeToSplitChild(root);
        if (nodeToSplitChild) {
            splitChild(nodeToSplitChild);
            somethingHappened = true;
        }
    }
}

const incrementAllDepths = (node) => {
    if (typeof node === 'number') {
        return;
    }
    node.depth++;
    incrementAllDepths(node.left);
    incrementAllDepths(node.right);
}

const addNumbers = (root1, root2) => {
    const newRoot = {
        parent: null,
        depth: 0,
        type: 'root',
        left: root1,
        right: root2
    };
    incrementAllDepths(root1);
    incrementAllDepths(root2);
    root1.type = 'left';
    root2.type = 'right';
    root1.parent = newRoot;
    root2.parent = newRoot;
    return newRoot;
}

const countMagnitude = (node) => {
    if (typeof node === 'number') {
        return node;
    }
    return 3 * countMagnitude(node.left) + 2 * countMagnitude(node.right);
}

const partOne = (input) => {
    const numbers = input.map(line => parseNumber(line));
    let root = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        root = addNumbers(root, numbers[i]);
        solveNumber(root);
    }
    
    // console.log(treeToString(root));
    return countMagnitude(root);
}

const partTwo = (input) => {
    let maxSumMagnitude = 0;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input.length; j++) {
            if (i !== j) {
                const num1 = parseNumber(input[i]);
                const num2 = parseNumber(input[j]);
                const root = addNumbers(num1, num2);
                solveNumber(root);
                maxSumMagnitude = Math.max(maxSumMagnitude, countMagnitude(root));
            }
        }
    }
    return maxSumMagnitude;
}

console.log(partOne(mediumInput));
console.log(partOne(input));
console.log(partTwo(mediumInput));
console.log(partTwo(input));
