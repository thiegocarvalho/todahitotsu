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

  const controller = new AbortController();

  const promises = GATEWAYS.map(async (gateway) => {
    const url = `${gateway}${cleanCid}`;
    try {
      onProgress(`Testing gateway: ${gateway}`);
      const response = await fetch(url, {
        signal: controller.signal,
        method: 'HEAD' // use HEAD to check faster without downloading immediately, or just fetch if images are small
      });

      if (response.ok) {
        onProgress(`SUCCESS: Gateway ${gateway} responded first!`);
        controller.abort(); // Cancel other requests
        return url;
      }
      throw new Error(`Gateway ${gateway} returned ${response.status}`);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err;
      }
      onProgress(`FAILED: Gateway ${gateway} error - ${err.message}`);
      throw err;
    }
  });

  try {
    const fastestUrl = await Promise.any(promises);
    return fastestUrl;
  } catch (err) {
    onProgress(`ERROR: All gateways failed to resolve the CID.`);
    throw new Error('All gateways failed');
  }
}
