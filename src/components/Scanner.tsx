import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { resolveIpfsImage } from '../utils/ipfs';

export default function Scanner({ initialCid }: { initialCid?: string | null }) {
  const [scanning, setScanning] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [resolvedImage, setResolvedImage] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // We don't display these logs to the end user anymore, but we keep them for debugging if needed
  const addLog = (msg: string) => {
    console.log(`[IPFS] ${msg}`);
  };

  const handleCidFound = async (cid: string) => {
    setScanning(false);
    setResolving(true);
    try {
      const url = await resolveIpfsImage(cid, addLog);
      setResolvedImage(url);
    } catch (err) {
      console.error(err);
      // Even on error, we should probably show a retry or error state, but for now we just log
    } finally {
      setResolving(false);
    }
  };

  useEffect(() => {
    if (initialCid) {
      handleCidFound(initialCid);
    }
  }, [initialCid]);

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    setResolvedImage(null);
    setResolving(false);
    setScanning(true);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader', { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], verbose: false });
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop();

            // Check if it's a todahitotsu URL with ?cid=
            let targetCid = decodedText;
            try {
              const url = new URL(decodedText);
              if (url.searchParams.has('cid')) {
                targetCid = url.searchParams.get('cid') || decodedText;
              }
            } catch (e) {
              // Not a valid URL, use text as CID directly
            }

            handleCidFound(targetCid);
          }
        },
        () => {
          // ignore scan errors (happens every frame no QR is found)
        }
      );
    } catch (err: any) {
      console.error(`Failed to start scanner: ${err.message}`);
      setScanning(false);
    }
  };

  return (
    <div className="scanner-section">

      {!resolvedImage && (
        <p className="scanner-description">Escaneie o QR Code do seu livro para acessar os conteúdos exclusivos.</p>
      )}

      {!resolvedImage && (
        <div className={`scanner-wrapper ${scanning ? 'scanning' : ''}`}>
          <div id="qr-reader" className="reader-element"></div>

          {scanning && (
            <>
              <div className="crosshair"></div>
              <div className="scan-line"></div>
            </>
          )}

          {resolving && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '1px' }}>
                BAIXANDO CONTEÚDO...
              </p>
            </div>
          )}

          {!scanning && !resolving && (
            <div className="scanner-overlay-button">
              <button className="btn-primary" onClick={startScanner}>
                ESCANEAR
              </button>
            </div>
          )}
        </div>
      )}

      {!resolvedImage && (
        <div className="logo-container">
          <img src={`${import.meta.env.BASE_URL}images/site/logo-j.png`} alt="Toda Hitotsu Logo" className="bottom-logo" />
        </div>
      )}

      {resolvedImage && (
        <div className="result-container">
          <div className="result-header">CONTEÚDO DESBLOQUEADO</div>
          <img src={resolvedImage} alt="Conteúdo Exclusivo" className="final-image" />

          <button className="btn-primary" onClick={() => setResolvedImage(null)} style={{ marginTop: '1.5rem', width: '100%', fontSize: '1.2rem', padding: '0.8rem' }}>
            ESCANEAR OUTRO
          </button>
        </div>
      )}
    </div>
  );
}
