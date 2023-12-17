const { createCanvas } = require('canvas');
const fs = require('fs');

const drawImage = (image, zoom = 1, palette, fileName = 'out.png') => {
    const canvas = createCanvas(zoom * image[0].length, zoom * image.length);
    const ctx = canvas.getContext('2d');
    ctx.font = `bold ${zoom + 1}px monospace`;
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, zoom * image[0].length, zoom * image.length);

    image.forEach((row, y) =>
        row.forEach((pixel, x) => {
            if (palette && palette[pixel]) {
                ctx.fillStyle = palette[pixel];
                ctx.fillRect(zoom * x, zoom * y, zoom, zoom);
                if (palette.drawText) {
                    ctx.fillStyle = 'rgba(125,255,255,1)';
                    ctx.fillText(pixel, zoom * x, zoom * (y + 1));
                }
            } else if (pixel === '#') {
                ctx.fillStyle = 'rgba(255,255,255,1)';
                ctx.fillRect(zoom * x, zoom * y, zoom, zoom);
            }
        })
    );

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(fileName, buffer);
    console.log('wrote out the png file to ' + fileName);
};

module.exports = {
    drawImage,
};
