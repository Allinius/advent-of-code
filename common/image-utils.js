const fs = require('fs');
const PImage = require('pureimage');

const drawImage = (image, zoom = 1, palette, fileName = 'out.png') => {
    const img = PImage.make(zoom * image[0].length, zoom * image.length);
    const ctx = img.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, zoom * image[0].length, zoom * image.length);

    image.forEach((row, y) =>
        row.forEach((pixel, x) => {
            if (palette && palette[pixel]) {
                ctx.fillStyle = palette[pixel];
                ctx.fillRect(zoom * x, zoom * y, zoom, zoom);
            } else if (pixel === '#') {
                ctx.fillStyle = 'rgba(255,255,255,1)';
                ctx.fillRect(zoom * x, zoom * y, zoom, zoom);
            }
        })
    );
    return PImage.encodePNGToStream(img, fs.createWriteStream(fileName))
        .then(() => {
            console.log('wrote out the png file to ' + fileName);
        })
        .catch((e) => {
            console.log('there was an error writing');
        });
};

module.exports = {
    drawImage,
};
