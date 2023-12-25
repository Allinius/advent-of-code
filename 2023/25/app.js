const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const [name, conPart] = line.split(': ');
            return {
                name,
                connections: conPart.split(' '),
            };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    while (true) {
        nodes = createGraph(input);

        while (nodes.length > 2) {
            // pick a random node connection and merge it
            const firstIndex = Math.floor(Math.random() * nodes.length);
            const firstNode = nodes[firstIndex];
            nodes.splice(firstIndex, 1);

            const conIndex = Math.floor(
                Math.random() * firstNode.connections.length
            );
            const secondNode = firstNode.connections[conIndex];
            const secondIndex = nodes.indexOf(secondNode);
            nodes.splice(secondIndex, 1);

            const firstConnections = firstNode.connections.filter(
                (cn) => cn !== secondNode
            );
            const secondConnections = secondNode.connections.filter(
                (cn) => cn !== firstNode
            );
            const newNode = {
                name: `${firstNode.name}-${secondNode.name}`,
                connections: [...firstConnections, ...secondConnections],
            };
            newNode.connections.forEach((cnode) => {
                const firstI = cnode.connections.indexOf(firstNode);
                if (firstI >= 0) {
                    cnode.connections.splice(firstI, 1, newNode);
                }
                const secondI = cnode.connections.indexOf(secondNode);
                if (secondI >= 0) {
                    cnode.connections.splice(secondI, 1, newNode);
                }
            });

            nodes.push(newNode);
        }
        if (nodes[0].connections.length <= 3) {
            const firstGraph = nodes[0].name.split('-');
            const secondGraph = nodes[1].name.split('-');
            return firstGraph.length * secondGraph.length;
        }
    }

    return;
};

const createGraph = (input) => {
    const result = new Map();
    input.forEach((line) => {
        const name = line.name;
        const connections = line.connections.map((cname) =>
            result.has(cname)
                ? result.get(cname)
                : { name: cname, connections: [] }
        );
        if (!result.has(name)) {
            result.set(name, {
                name,
                connections,
            });
        } else {
            const nameObj = result.get(name);
            nameObj.connections.push(...connections);
        }
        connections.forEach((con) => {
            con.connections.push(result.get(name));
            if (!result.has(con.name)) {
                result.set(con.name, con);
            }
        });
    });
    return Array.from(result).map(([_, node]) => node);
};

assert.equal(partOne(inputSmall), 54);
console.log(partOne(input));
