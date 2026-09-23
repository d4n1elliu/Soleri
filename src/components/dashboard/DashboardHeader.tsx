import { useState } from 'react';
import { InitialAvatar } from '../ui';

export const NAV_ITEMS = [
  { label: 'Overview', href: '#' },
  { label: 'Recent Plays', href: '#recent-plays' },
  { label: 'Listening Clock', href: '#listening-clock' },
  { label: 'Marathons', href: '#listening-marathons' },
  { label: 'Artist Obsessions', href: '#artist-obsessions' },
  { label: 'Discovery Rate', href: '#discovery-rate' },
  { label: 'Billboard', href: '#billboard' },
];

interface DashboardHeaderProps {
  displayName: string | null;
  spotifyId: string | null;
  avatarUrl: string | null;
  onScan: () => void;
  onShare: () => void;
  onEditProfile: () => void;
}

export function DashboardHeader({
  displayName,
  spotifyId,
  avatarUrl,
  onScan,
  onShare,
  onEditProfile,
}: DashboardHeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 overflow-x-clip border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="flex min-w-0 items-center justify-between gap-3 py-2 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 sm:py-3.5">
        <a href="/" className="flex min-h-11 shrink-0 items-center gap-2.5">
          <img src="/Soleri.svg" alt="Soleri" className="h-7 w-7 rounded-md" />
          <span className="hidden font-bold tracking-tight min-[380px]:inline">Soleri</span>
        </a>
        {displayName && (
          <p className="hidden min-w-0 shrink truncate text-sm text-zinc-500 sm:block lg:block">
            Welcome back{' '}
            <span className="ml-2 font-medium uppercase tracking-wide text-zinc-300">
              {displayName}
            </span>
          </p>
        )}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onScan}
            className="flex h-11 w-11 items-center justify-center gap-1.5 rounded-lg border border-zinc-700 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60 sm:h-auto sm:w-auto sm:px-3 sm:py-1.5"
            aria-label="Scan QR code"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
              <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
            </svg>
            <span className="hidden sm:inline">Scan</span>
          </button>
          {spotifyId && (
            <button
              onClick={onShare}
              className="flex h-11 w-11 items-center justify-center gap-1.5 rounded-lg bg-green-500 text-sm font-medium text-black transition-colors hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-auto sm:w-auto sm:px-3 sm:py-1.5"
              aria-label="Share profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              <span className="hidden sm:inline">Share</span>
            </button>
          )}
          <button
            onClick={onEditProfile}
            className="flex h-11 w-11 items-center justify-center rounded-full transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60 sm:h-auto sm:w-auto"
            aria-label="Edit profile"
          >
            <InitialAvatar name={displayName ?? spotifyId ?? '?'} src={avatarUrl} size="sm" />
          </button>
          {/* Mobile sections dropdown trigger — hidden on desktop */}
          <button
            onClick={() => setMobileNavOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/60 sm:h-auto sm:w-auto sm:p-2 lg:hidden"
            aria-label="Toggle section menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileNavOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 lg:hidden">
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
            Dashboard
          </p>
          <div className="grid grid-cols-2 gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
