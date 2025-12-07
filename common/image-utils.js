const { createCanvas } = require('canvas');
const fs = require('fs');

const drawImage = (image, zoom = 1, inputPalette, fileName = 'out.png') => {
    const canvas = createCanvas(zoom * image[0].length, zoom * image.length);
    const ctx = canvas.getContext('2d');
    ctx.font = `bold ${zoom + 1}px monospace`;
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, zoom * image[0].length, zoom * image.length);

    const palette = inputPalette || {};
    image.forEach((row, y) =>
        row.forEach((pixel, x) => {
            if (palette[pixel]) {
                ctx.fillStyle = palette[pixel];
                ctx.fillRect(zoom * x, zoom * y, zoom, zoom);
                if (palette.drawText) {
                    ctx.fillStyle = 'rgba(125,255,255,1)';
                    ctx.fillText(pixel, zoom * x, zoom * (y + 1));
                }
            } else {
                palette[pixel] = randomColor();
                ctx.fillStyle = palette[pixel];
                ctx.fillRect(zoom * x, zoom * y, zoom, zoom);
            }
        })
    );

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(fileName, buffer);
    console.log('wrote out the png file to ' + fileName);
};

const randomColor = () => {
    const h = Math.random();
    const s = Math.random();
    const v = Math.random();
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        (s = h.s), (v = h.v), (h = h.h);
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            (r = v), (g = t), (b = p);
            break;
        case 1:
            (r = q), (g = v), (b = p);
            break;
        case 2:
            (r = p), (g = v), (b = t);
            break;
        case 3:
            (r = p), (g = q), (b = v);
            break;
        case 4:
            (r = t), (g = p), (b = v);
            break;
        case 5:
            (r = v), (g = p), (b = q);
            break;
    }

    return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(
        b * 255
    )}, 1)`;
};

const hexToRgbA = (hex) => {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return (
            'rgba(' +
            [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') +
            ',1)'
        );
    }
    throw new Error('Bad Hex');
};

module.exports = {
    drawImage,
    hexToRgbA,
};
