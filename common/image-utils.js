const fs = require('fs');
const PImage = require('pureimage');

const drawImage = (image, zoom = 1) => {
    const img = PImage.make(zoom * image[0].length, zoom * image.length);
    const ctx = img.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, zoom * image[0].length, zoom * image.length);
    ctx.fillStyle = 'rgba(255,255,255,1)';

    image.forEach((row, y) =>
        row.forEach((pixel, x) => {
            if (pixel === '#') {
                ctx.fillRect(zoom * x, zoom * y, zoom, zoom);
            }
        })
    );
    PImage.encodePNGToStream(img, fs.createWriteStream('out.png'))
        .then(() => {
            console.log('wrote out the png file to out.png');
        })
        .catch((e) => {
            console.log('there was an error writing');
        });
};

module.exports = {
    drawImage,
};
