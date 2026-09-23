import { useEffect, useState } from 'react';
import {
  decodeTasteProfile,
  isShareId,
  payloadArtists,
  payloadTracks,
  spotifyUserUrl,
  spotifyArtistUrl,
  spotifyTrackUrl,
  type TasteEntry,
  type TastePayload,
} from '../../lib';
import { fetchShare, fetchProfile } from '../../api';
import type { ProfileData } from '../../types';
import { ProfileHeader, DEFAULT_ACCENT } from './ProfileHeader';

function PageShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
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
      <main className={`mx-auto w-full px-4 py-12 sm:py-16 ${wide ? 'max-w-5xl' : 'max-w-xl'}`}>
        {children}
      </main>
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
    <section className="mt-8 first:mt-0">
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
        <p className="text-2xl font-light text-white">
          This share link has expired or doesn&rsquo;t exist
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Share links expire after 90 days. Ask your friend to share a fresh QR code from their
          dashboard.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-green-500 px-8 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-green-400"
        >
          Try Soleri
        </a>
      </div>
    </PageShell>
  );
}

function isValidPayload(payload: TastePayload | null): payload is TastePayload {
  return !!payload && !!payload.id && !!payload.n;
}

export function SharedProfilePage({ encoded }: { encoded: string }) {
  // Legacy tokens decode locally; short IDs need the API
  const [payload, setPayload] = useState<TastePayload | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const decoded = decodeTasteProfile(encoded);
      let resolved: TastePayload | null = isValidPayload(decoded) ? decoded : null;
      if (!resolved && isShareId(encoded)) {
        resolved = await fetchShare(encoded);
      }
      if (cancelled) return;
      // Customisation loads live by user ID so edits show on old links
      const liveProfile = isValidPayload(resolved)
        ? (await fetchProfile(resolved.id)).profile
        : null;
      if (cancelled) return;
      setPayload(resolved);
      setProfile(liveProfile);
      setLoading(false);
    }

    setLoading(true);
    load();
    return () => {
      cancelled = true;
    };
  }, [encoded]);

  if (loading) {
    return (
      <PageShell>
        <div className="flex flex-col items-center py-24 text-center">
          <div className="h-20 w-20 animate-pulse rounded-full bg-zinc-800" />
          <div className="mt-4 h-6 w-40 animate-pulse rounded bg-zinc-800" />
          <p className="mt-8 text-sm text-zinc-500">Loading profile…</p>
        </div>
      </PageShell>
    );
  }

  if (!isValidPayload(payload)) {
    return <InvalidShare />;
  }

  const accent = profile?.accentColor ?? DEFAULT_ACCENT;
  const showGenres = (profile?.showGenres ?? true) && payload.g.length > 0;
  const showArtists = profile?.showArtists ?? true;
  const showTracks = profile?.showTracks ?? true;

  const stats = (
    <>
      {showGenres && (
        <section className="mt-8 first:mt-0">
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
      {showArtists && (
        <EntryList title="Top artists" entries={payloadArtists(payload)} toUrl={spotifyArtistUrl} />
      )}
      {showTracks && (
        <EntryList title="Top tracks" entries={payloadTracks(payload)} toUrl={spotifyTrackUrl} />
      )}
    </>
  );

  return (
    <PageShell wide>
      <div className="md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start md:gap-8">
        {/* Profile card */}
        <div>
          <ProfileHeader
            profile={{
              displayName: profile?.displayName || payload.n,
              pronouns: profile?.pronouns ?? null,
              location: profile?.location ?? null,
              bio: profile?.bio ?? null,
              links: profile?.links ?? [],
              pinnedTrack: profile?.pinnedTrack ?? null,
              accentColor: profile?.accentColor ?? null,
              avatarUrl: profile?.avatarUrl ?? null,
              bannerUrl: profile?.bannerUrl ?? null,
            }}
          />

          {/* Same-tab: a universal link in a new tab leaves iOS Safari on about:blank */}
          <a
            href={spotifyUserUrl(payload.id)}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-8 text-xs font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            Open in Spotify
          </a>
        </div>

        {/* Stats */}
        <div className="mt-10 md:mt-0">
          {stats}

          <div className="mt-10 rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-6 text-center backdrop-blur-xl">
            <p className="text-sm text-zinc-400">
              Connect your Spotify to see your own stats and compare tastes with{' '}
              {profile?.displayName || payload.n}.
            </p>
            <a
              href="/"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-700 px-8 text-xs font-semibold uppercase tracking-wider text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
            >
              Try Soleri
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
