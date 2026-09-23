import { useEffect, useRef } from 'react';
import type { Options } from 'qr-code-styling';

// Error correction H keeps the centred logo scannable.
export function qrStyleOptions(data: string, size: number): Options {
  return {
    type: 'svg',
    width: size,
    height: size,
    data,
    margin: Math.round(size * 0.06),
    qrOptions: { errorCorrectionLevel: 'H' },
    image: '/Soleri.svg',
    imageOptions: { imageSize: 0.2, margin: Math.round(size * 0.015), crossOrigin: 'anonymous' },
    dotsOptions: { type: 'rounded', color: '#0b0b0b' },
    cornersSquareOptions: { type: 'extra-rounded', color: '#0b0b0b' },
    cornersDotOptions: { type: 'dot', color: '#0b0b0b' },
    backgroundOptions: { color: '#ffffff' },
  };
}

export async function downloadStyledQr(data: string, fileName: string, size = 1024) {
  const { default: QRCodeStyling } = await import('qr-code-styling');
  const qr = new QRCodeStyling({ ...qrStyleOptions(data, size), type: 'canvas' });
  await qr.download({ name: fileName, extension: 'png' });
}

export function StyledQr({ data, size, className }: { data: string; size: number; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (cancelled || !container) return;
      container.replaceChildren();
      new QRCodeStyling(qrStyleOptions(data, size)).append(container);
      const svg = container.querySelector('svg');
      if (svg) {
        svg.style.width = '100%';
        svg.style.height = '100%';
      }
    });
    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, [data, size]);

  return <div ref={containerRef} className={className} aria-label="Profile QR code" role="img" />;
}
