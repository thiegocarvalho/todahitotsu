const GATEWAYS = [
  'https://tan-rear-loon-786.mypinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://w3s.link/ipfs/',
];

// Only bare CIDs are accepted (v0 base58 or v1 base32). Anything else (paths, queries,
// extra segments) would let a crafted link make the site open arbitrary gateway content.
const CID_V0 = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
const CID_V1 = /^b[a-z2-7]{58,127}$/;

export function parseCid(input: string): string | null {
  const cid = input.trim().replace(/^ipfs:\/\//, '');
  return CID_V0.test(cid) || CID_V1.test(cid) ? cid : null;
}

export async function resolveIpfsImage(cid: string, onProgress: (msg: string) => void): Promise<string> {
  const cleanCid = parseCid(cid);
  if (!cleanCid) {
    onProgress('ERROR: invalid CID');
    throw new Error('Invalid CID');
  }
  onProgress(`Starting resolution for CID: ${cleanCid}`);

  const promises = GATEWAYS.map((gateway) => {
    return new Promise<string>((resolve, reject) => {
      const url = `${gateway}${cleanCid}`;
      const img = new Image();
      
      img.referrerPolicy = 'no-referrer';

      img.onload = () => {
        // Only something the browser decoded as an image can win the race
        if (img.naturalWidth === 0) {
          reject(new Error(`Not an image from ${gateway}`));
          return;
        }
        onProgress(`SUCCESS: Gateway ${gateway} responded first!`);
        resolve(url);
      };
      
      img.onerror = () => {
        onProgress(`FAILED: Gateway ${gateway} error`);
        reject(new Error(`Failed to load from ${gateway}`));
      };
      
      onProgress(`Testing gateway: ${gateway}`);
      img.src = url;
    });
  });

  try {
    const fastestUrl = await Promise.any(promises);
    return fastestUrl;
  } catch (err) {
    onProgress(`ERROR: All gateways failed to resolve the CID.`);
    throw new Error('All gateways failed');
  }
}
