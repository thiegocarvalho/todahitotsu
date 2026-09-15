const GATEWAYS = [
  'https://tan-rear-loon-786.mypinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://w3s.link/ipfs/',
];

export async function resolveIpfsImage(cid: string, onProgress: (msg: string) => void): Promise<string> {
  const cleanCid = cid.replace('ipfs://', '').trim();
  onProgress(`Starting resolution for CID: ${cleanCid}`);

  const promises = GATEWAYS.map((gateway) => {
    return new Promise<string>((resolve, reject) => {
      const url = `${gateway}${cleanCid}`;
      const img = new Image();
      
      img.onload = () => {
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
