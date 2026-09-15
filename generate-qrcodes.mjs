import fs from 'fs';
import QRCode from 'qrcode';
import { createCanvas, loadImage } from 'canvas';

const data = {
    "Elyra": "bafybeieqdh6mcms7l3hju4o7pjrfvcn3fhjjv4jkzkq5uw5okzq3fqsrae",
    "Muordock": "bafybeieecm5ugfbjmbmd22k5dzxjxy73q7xtigyagzutfsgk7q7saiewha",
    "Guido": "bafybeibjmysshdjiapjmuba5aj7vfoouyoqpps7shckabsnftmg3mvcdgq",
    "Airon": "bafybeib5lrxqsdt6w2syw4gkpkyualuyiha4yheokboewy4s4ekw6zcsma",
    "Marvelus": "bafybeihad2x4ui3ckjwtimuczriub4ydtmonpdsarhegzgihsy2vuyyxia",
    "Nuri": "bafybeidiup7wz3lvfm44x73pkhjiqrrowokvtbbyrltjvavgvsivy663t4",
    "Tenko": "bafybeidb3tobsqhxjiap642y2j3eku6tw2l5ecisobzxflhnx7xla27ebi",
    "Ciron": "bafybeiazijjxyaiv5qz3lkauplf3lgxzencrri6v22oqnn472z7i2j7tii",
    "Jonas Deives": "bafybeibtqwj6wpcdlxv7fwoyptl3fm4k2puj4kzz2prla3ya6a7lrf6pkm",
    "Full Strong": "bafybeibjg62v5wxqf64szhlrzvpnhlgpk2uobbdinrelgiehftyjc6je6m"
};

fs.mkdirSync('images/qr-codes/staging', { recursive: true });
fs.mkdirSync('images/qr-codes/producao', { recursive: true });

async function createQR(name, url, outputPath) {
    const qrBuffer = await QRCode.toBuffer(url, { width: 400, margin: 4 });
    const qrImg = await loadImage(qrBuffer);
    
    const margin = 80;
    const canvas = createCanvas(qrImg.width, qrImg.height + margin);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, canvas.width / 2, margin / 2);
    
    // Draw QR code
    ctx.drawImage(qrImg, 0, margin);
    
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    
    return new Promise(resolve => out.on('finish', resolve));
}

async function main() {
    for (const [name, cid] of Object.entries(data)) {
        console.log(`Generating QR for ${name}...`);
        const stagingUrl = `https://thiegocarvalho.github.io/todahitotsu/?cid=${cid}`;
        await createQR(name, stagingUrl, `images/qr-codes/staging/${name}.png`);
        
        const prodUrl = `https://todahitotsu.com/?cid=${cid}`;
        await createQR(name, prodUrl, `images/qr-codes/producao/${name}.png`);
    }
    console.log("All QR codes generated successfully!");
}

main().catch(console.error);
