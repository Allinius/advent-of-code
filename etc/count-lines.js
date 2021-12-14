// to get gitlog.txt execute:
// git log --author="Allinius" --format=tformat: --numstat > gitlog.txt
const fs = require('fs');
const gitlog = fs.readFileSync('gitlog.txt', 'ucs2').split('\r\n').map(line => line.split('\t'));
console.log(gitlog.reduce((acc, line) => { 
    if (line[0] && line[1] && line[2]) {
        const ext = line[2].split('.').pop();
        if (acc.has(ext)) {
            const stats = acc.get(ext);
            stats.added += parseInt(line[0]);
            stats.removed += parseInt(line[1]);
        } else {
            acc.set(ext, {
                added: parseInt(line[0]),
                removed: parseInt(line[1])
            });
        }
    }
    return acc;
}, new Map() ));
