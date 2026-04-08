const fs = require('fs');
const https = require('https');
const path = require('path');

const ICON_MAP = {
  'drum': 'game-icons/drum-kit',
  'percussion': 'game-icons/concussion-sensor',
  'congas': 'game-icons/bongo',
  'keyboard': 'game-icons/piano-keys',
  'piano': 'game-icons/grand-piano',
  'bass': 'game-icons/guitar-bass-head',
  'guitar': 'game-icons/electric-guitar',
  'guitar-acoustic': 'game-icons/acoustic-guitar',
  'sax': 'game-icons/saxophone',
  'trumpet': 'game-icons/trumpet',
  'amp-bass': 'game-icons/speaker',
  'amp-guitar': 'game-icons/speaker',
  'speaker': 'game-icons/speaker',
  'monitor': 'game-icons/speaker', 
  'subwoofer': 'game-icons/subwoofer',
  'mic-stand': 'game-icons/microphone',
  'mic': 'game-icons/microphone',
  'di': 'game-icons/wire-coil',
  'power': 'game-icons/plug',
  'riser': 'game-icons/stage',
  'stand': 'game-icons/music-stand',
  'backdrop': 'game-icons/vertical-banner'
};

const fallbacks = {
  'congas': 'game-icons/bongo',
  'stand': 'game-icons/wooden-sign',
  'bass': 'game-icons/guitar',
  'backdrop': 'game-icons/tattered-banner',
  'percussion': 'game-icons/bongo',
  'bass': 'game-icons/electric-guitar'
};

const dir = path.join(__dirname, 'public', 'icons', 'instruments');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

async function fetchSvg(id) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.iconify.design/${id}.svg`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (data.startsWith('<svg')) resolve(data);
        else resolve(null);
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const [name, id] of Object.entries(ICON_MAP)) {
    console.log(`Downloading ${name} (${id})...`);
    let svg = await fetchSvg(id);
    if (!svg && fallbacks[name]) {
      console.log(`Failed, trying fallback ${fallbacks[name]}...`);
      svg = await fetchSvg(fallbacks[name]);
    }
    
    if (svg) {
      fs.writeFileSync(path.join(dir, `${name}.svg`), svg);
      console.log(`Saved ${name}.svg`);
    } else {
      console.log(`FAILED to download ${name}`);
      fs.writeFileSync(path.join(dir, `${name}.svg`), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" fill="currentColor"/></svg>');
    }
  }
}

run();
