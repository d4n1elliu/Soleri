import { useRef, useEffect, useState, useCallback } from 'react';
import jsQR from 'jsqr';

interface QRScannerModalProps {
  onClose: () => void;
  onTasteMatch?: (encodedPayload: string, theirSpotifyId: string) => void;
}

// BarcodeDetector is not yet in the TypeScript lib, so we declare it minimally
interface BarcodeDetectorResult {
  rawValue: string;
}
interface BarcodeDetectorAPI {
  detect(source: CanvasElement | HTMLVideoElement | ImageData): Promise<BarcodeDetectorResult[]>;
}
type CanvasElement = HTMLCanvasElement;
declare global {
  interface Window {
    BarcodeDetector?: new (options: { formats: string[] }) => BarcodeDetectorAPI;
  }
}

const SOLERI_ORIGIN = 'https://soleri.app';
const SOLERI_USER_PATH = SOLERI_ORIGIN + '/u/';

interface ParsedSoleriUrl {
  spotifyId: string;
  tastePayload: string | null;
}

function parseSoleriUrl(url: string): ParsedSoleriUrl | null {
  if (!url.startsWith(SOLERI_USER_PATH)) return null;
  const rest = url.slice(SOLERI_USER_PATH.length);
  const qIndex = rest.indexOf('?');
  const spotifyId = qIndex >= 0 ? rest.slice(0, qIndex) : rest;
  if (!spotifyId) return null;
  const params = new URLSearchParams(qIndex >= 0 ? rest.slice(qIndex + 1) : '');
  return { spotifyId, tastePayload: params.get('p') };
}

export function QRScannerModal({ onClose, onTasteMatch }: QRScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const detectorRef = useRef<BarcodeDetectorAPI | null>(null);
  const scanningRef = useRef(true);

  const [status, setStatus] = useState<'requesting' | 'scanning' | 'found' | 'error'>('requesting');
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const stopCamera = useCallback(() => {
    scanningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  const scanFrame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!scanningRef.current) return;
    if (!video || !canvas || video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(video, 0, 0);

    let result: string | null = null;

    if (detectorRef.current) {
      try {
        const codes = await detectorRef.current.detect(canvas);
        if (codes.length > 0) result = codes[0].rawValue;
      } catch {
        // fall through to jsQR
      }
    }

    if (!result) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height, {
        inversionAttempts: 'dontInvert',
      });
      if (code) result = code.data;
    }

    if (result) {
      stopCamera();
      setScannedUrl(result);
      setStatus('found');
    } else {
      rafRef.current = requestAnimationFrame(scanFrame);
    }
  }, [stopCamera]);

  useEffect(() => {
    if (window.BarcodeDetector) {
      detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
    }

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStatus('scanning');
          scanFrame();
        }
      } catch {
        setErrorMsg('Camera access denied. Please allow camera permissions and try again.');
        setStatus('error');
      }
    }

    startCamera();
    return stopCamera;
  }, [scanFrame, stopCamera]);

  const parsed = scannedUrl ? parseSoleriUrl(scannedUrl) : null;
  const isSoleriUrl = !!parsed;
  const hasTastePayload = !!(parsed?.tastePayload && onTasteMatch);

  function handleTasteMatch() {
    if (parsed?.tastePayload && onTasteMatch) {
      stopCamera();
      onTasteMatch(parsed.tastePayload, parsed.spotifyId);
      onClose();
    }
  }

  function openUrl() {
    if (scannedUrl) {
      // Open the clean profile URL (without the long taste payload)
      const cleanUrl = parsed
        ? `${SOLERI_USER_PATH}${parsed.spotifyId}`
        : scannedUrl;
      window.open(cleanUrl, '_blank', 'noopener,noreferrer');
    }
    handleClose();
  }

  async function restartCamera() {
    scanningRef.current = true;
    setStatus('requesting');
    setScannedUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('scanning');
        scanFrame();
      }
    } catch {
      setErrorMsg('Camera access denied.');
      setStatus('error');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <span className="font-semibold text-white">Scan QR code</span>
          <button
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Camera viewport */}
        {status !== 'found' && (
          <div className="relative mx-5 mb-4 overflow-hidden rounded-xl bg-zinc-900" style={{ aspectRatio: '1' }}>
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
            {status === 'scanning' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative h-48 w-48">
                  <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-green-400 rounded-tl-md" />
                  <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-green-400 rounded-tr-md" />
                  <span className="absolute left-0 bottom-0 h-8 w-8 border-l-2 border-b-2 border-green-400 rounded-bl-md" />
                  <span className="absolute right-0 bottom-0 h-8 w-8 border-r-2 border-b-2 border-green-400 rounded-br-md" />
                </div>
              </div>
            )}
            {status === 'requesting' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-zinc-400">Requesting camera…</p>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="mx-5 mb-5 rounded-xl bg-zinc-900 p-6 text-center">
            <p className="text-sm text-red-400">{errorMsg}</p>
          </div>
        )}

        {/* Found state */}
        {status === 'found' && scannedUrl && (
          <div className="px-5 pb-5 space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-green-900/40 border border-green-700 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-green-300 font-medium">QR code detected!</span>
            </div>

            {isSoleriUrl && (
              <div className="rounded-lg bg-zinc-700 px-3 py-2.5">
                <p className="truncate text-sm text-zinc-300">
                  {SOLERI_USER_PATH}{parsed!.spotifyId}
                </p>
              </div>
            )}

            {hasTastePayload ? (
              <>
                <button
                  onClick={handleTasteMatch}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Compare Tastes
                </button>
                <button
                  onClick={openUrl}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-600 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
                >
                  View profile
                </button>
              </>
            ) : isSoleriUrl ? (
              <button
                onClick={openUrl}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                View Soleri profile
              </button>
            ) : (
              <>
                <div className="rounded-lg bg-zinc-700 px-3 py-2.5">
                  <p className="truncate text-sm text-zinc-300">{scannedUrl}</p>
                </div>
                <button
                  onClick={openUrl}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-700 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-600"
                >
                  Open link
                </button>
              </>
            )}

            <button
              onClick={restartCamera}
              className="w-full rounded-lg border border-zinc-600 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
            >
              Scan again
            </button>
          </div>
        )}

        {status === 'scanning' && (
          <p className="px-5 pb-5 text-center text-xs text-zinc-500">
            Point your camera at a Soleri profile QR code
          </p>
        )}
      </div>
    </div>
  );
}
