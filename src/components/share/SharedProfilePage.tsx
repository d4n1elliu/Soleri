import { useMemo } from 'react';
import {
  decodeTasteProfile,
  payloadArtists,
  payloadTracks,
  spotifyUserUrl,
  spotifyArtistUrl,
  spotifyTrackUrl,
  type TasteEntry,
} from '../../lib';
import { InitialAvatar } from '../ui';

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-clip bg-zinc-950 text-zinc-100 selection:bg-green-500 selection:text-black font-sans antialiased">
      <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-4 py-5">
          <a href="/" className="flex items-center gap-3">
            <img src="/Soleri.svg" alt="Soleri logo" className="h-7 w-7 rounded-md" />
            <span className="text-sm font-semibold tracking-wide uppercase text-white">Soleri</span>
          </a>
          <a
            href="/"
            className="text-xs font-medium uppercase tracking-widest text-zinc-400 transition-colors hover:text-white"
          >
            Get your own stats
          </a>
        </div>
      </nav>
      <main className="mx-auto w-full max-w-xl px-4 py-12 sm:py-16">{children}</main>
    </div>
  );
}

function EntryList({
  title,
  entries,
  toUrl,
}: {
  title: string;
  entries: TasteEntry[];
  toUrl: (id: string) => string;
}) {
  if (entries.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-500">{title}</h2>
      <div className="mt-3 flex flex-col gap-1.5">
        {entries.map((entry, index) => (
          <a
            key={entry.id}
            href={toUrl(entry.id)}
            className="flex min-h-11 items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-4 transition-colors hover:border-zinc-700"
          >
            <span className="w-5 font-mono text-xs text-zinc-600">{index + 1}</span>
            <span className="truncate text-sm text-zinc-200">{entry.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function InvalidShare() {
  return (
    <PageShell>
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-8 text-center backdrop-blur-xl">
        <p className="text-2xl font-light text-white">This share link doesn&rsquo;t work</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          It may be incomplete, expired, or from an older version of Soleri. Ask your friend to
          share a fresh QR code from their dashboard.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-green-500 px-8 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-green-400"
        >
          Go to Soleri
        </a>
      </div>
    </PageShell>
  );
}

export function SharedProfilePage({ encoded }: { encoded: string }) {
  const payload = useMemo(() => decodeTasteProfile(encoded), [encoded]);

  if (!payload || !payload.id || !payload.n) {
    return <InvalidShare />;
  }

  return (
    <PageShell>
      <div className="flex flex-col items-center text-center">
        <InitialAvatar name={payload.n} size="lg" />
        <h1 className="mt-4 text-3xl font-light tracking-tight text-white sm:text-4xl">{payload.n}</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-zinc-500">
          Soleri taste profile
        </p>

        {/* Same-tab on purpose: a universal link in a new tab strands iOS Safari on about:blank */}
        <a
          href={spotifyUserUrl(payload.id)}
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-green-500 px-8 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-green-400"
        >
          Open in Spotify
        </a>
      </div>

      {payload.g.length > 0 && (
        <section className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-500">Top genres</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {payload.g.map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300"
              >
                {genre}
              </span>
            ))}
          </div>
        </section>
      )}

      <EntryList title="Top artists" entries={payloadArtists(payload)} toUrl={spotifyArtistUrl} />
      <EntryList title="Top tracks" entries={payloadTracks(payload)} toUrl={spotifyTrackUrl} />

      <div className="mt-12 rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-center backdrop-blur-xl">
        <p className="text-sm text-zinc-400">
          Connect your Spotify to see your own stats and compare tastes with {payload.n}.
        </p>
        <a
          href="/"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-700 px-8 text-xs font-semibold uppercase tracking-wider text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
        >
          Try Soleri
        </a>
      </div>
    </PageShell>
  );
}
