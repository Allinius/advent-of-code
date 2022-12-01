const fs = require('fs');
const PImage = require('pureimage');

const parseInput = (fileName) => {
    const parts = fs.readFileSync(fileName, 'utf8').replace(/\r/g, "").split('\n\n');
    const image = parts[1].split('\n').map(l => l.split(''));
    return {
        algorithm: parts[0],
        image
    }
}

const smallInput = parseInput('input-small.txt');
const input = parseInput('input.txt');

const getPixel = (image, x, y) => {
    return image[y] != null && image[y][x] != null ? image[y][x] : '.';
}

const getPixelLookupAddress = (image, px, py) => {
    const neighbours = [];
    for (let y = py - 1; y <= py + 1; y++) {
        for (let x = px - 1; x <= px + 1; x++) {
            neighbours.push(getPixel(image, x, y));
        }
    }
    return parseInt(neighbours.join('').replaceAll('#', 1).replaceAll('.', 0), 2);
}

const drawImage = (image, zoom = 1) => {
    // console.log(image.map(row => row.join('')).join('\n'));
    const img = PImage.make(zoom * image[0].length, zoom * image.length);
    const ctx = img.getContext('2d');
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(0, 0, zoom * image[0].length, zoom * image.length);
    ctx.fillStyle = 'rgba(0,0,0,1)';

    image.forEach((row, y) => 
        row.forEach((pixel, x) => {
            if (pixel === '#') {
                ctx.fillRect(zoom * x, zoom * y, zoom, zoom);
            }
        })
    )
    PImage.encodePNGToStream(img, fs.createWriteStream('out.png')).then(() => {
        console.log("wrote out the png file to out.png");
    }).catch((e)=>{
        console.log("there was an error writing");
    });
}

const countLitPixels = (image, border) => {
    const trimmed = image.slice(border, image.length - border).map(row =>
        row.slice(border, row.length - border)    
    );
    return trimmed.reduce((count, row) => 
        count + row.reduce((rowCount, p) => 
            p === '#' ? rowCount + 1 : rowCount
        , 0)
    , 0);
}

const partOne = (input, steps) => {
    const marginSize = 2 * steps;
    const emptyLine = new Array(input.image[0].length + 2 * marginSize).fill('.');
    const rowMargin = new Array(marginSize).fill('.');
    input.image = input.image.map(row => [...rowMargin, ...row, ...rowMargin]);
    for (let i = 0; i < marginSize; i++) {
        input.image.unshift(emptyLine);
        input.image.push(emptyLine);
    }
    const imageSize = input.image.length;

    for (let step = 0; step < steps; step++) {
        const newImage = new Array(imageSize).fill([]).map(row => new Array(imageSize).fill('.'));
        for (let y = 0; y < imageSize; y++) {
            for (let x = 0; x < imageSize; x++) {
                const address = getPixelLookupAddress(input.image, x, y);
                newImage[y][x] = input.algorithm[address];
            }
        }
        input.image = newImage;
    }
    drawImage(input.image, 2);
    return countLitPixels(input.image, marginSize / 2);
}

// console.log(partOne(smallInput, 2));
// console.log(partOne(input, 2));
console.log(partOne(input, 50));

