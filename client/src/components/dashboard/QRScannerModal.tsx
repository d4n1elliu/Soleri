import { useRef, useEffect, useState, useCallback } from 'react';
import jsQR from 'jsqr';

interface QRScannerModalProps {
  onClose: () => void;
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

export function QRScannerModal({ onClose }: QRScannerModalProps) {
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

    // Try native BarcodeDetector first (Chrome, Edge, Android WebView)
    if (detectorRef.current) {
      try {
        const codes = await detectorRef.current.detect(canvas);
        if (codes.length > 0) result = codes[0].rawValue;
      } catch {
        // detector failed on this frame — fall through to jsQR
      }
    }

    // jsQR fallback (Firefox, Safari, etc.)
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
    // Initialise BarcodeDetector once
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

  const isSoleriUrl = scannedUrl?.startsWith(SOLERI_ORIGIN + '/u/');

  function openUrl() {
    if (scannedUrl) window.open(scannedUrl, '_blank', 'noopener,noreferrer');
    handleClose();
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
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              muted
              playsInline
            />
            {/* Scanning overlay */}
            {status === 'scanning' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative h-48 w-48">
                  {/* Corner brackets */}
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
            {/* Hidden canvas used for frame analysis */}
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

            <div className="rounded-lg bg-zinc-700 px-3 py-2.5">
              <p className="truncate text-sm text-zinc-300">{scannedUrl}</p>
            </div>

            {isSoleriUrl ? (
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
              <button
                onClick={openUrl}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-700 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-600"
              >
                Open link
              </button>
            )}

            <button
              onClick={() => {
                scanningRef.current = true;
                setStatus('requesting');
                setScannedUrl(null);
                // Re-start camera
                async function restart() {
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
                restart();
              }}
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
