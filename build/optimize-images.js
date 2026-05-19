const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const fs = require('fs');
const path = require('path');

const folders = [
  'assets',
  ...fs.readdirSync('demos').map(f => `demos/${f}/assets`),
  ...fs.readdirSync('tools').map(f => `tools/${f}/assets`)
].filter(f => fs.existsSync(f));

(async () => {
  for (const folder of folders) {
    await imagemin([`${folder}/*.{jpg,png}`], {
      destination: folder,
      plugins: [
        imageminMozjpeg({ quality: 80 }),
        imageminPngquant({ quality: [0.6, 0.8] })
      ]
    });
    console.log(`✅ Optimized images in ${folder}`);
  }
})();