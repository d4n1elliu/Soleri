import type { ProfileLink, PinnedTrack } from '../../types';
import { InitialAvatar } from '../ui';

export interface ProfileHeaderData {
  displayName: string;
  pronouns: string | null;
  location: string | null;
  bio: string | null;
  links: ProfileLink[];
  pinnedTrack: PinnedTrack | null;
  accentColor: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
}

export const DEFAULT_ACCENT = '#22c55e';

function linkIcon(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (host.includes('instagram.')) return '📷';
    if (host === 'x.com' || host.includes('twitter.')) return '𝕏';
    if (host.includes('tiktok.')) return '♪';
    if (host.includes('youtube.') || host === 'youtu.be') return '▶';
    if (host.includes('spotify.')) return '♫';
  } catch {
    // fall through to the globe
  }
  return '🌐';
}

export function ProfileHeader({ profile }: { profile: ProfileHeaderData }) {
  const accent = profile.accentColor ?? DEFAULT_ACCENT;

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-xl">
      {/* Banner */}
      {profile.bannerUrl ? (
        <img
          src={profile.bannerUrl}
          alt=""
          className="h-28 w-full object-cover sm:h-36"
        />
      ) : (
        <div
          className="h-20 w-full sm:h-24"
          style={{ background: `linear-gradient(135deg, ${accent}33, ${accent}0d)` }}
        />
      )}

      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        {/* Avatar overlapping the banner */}
        <div className="-mt-10 mb-3 inline-block rounded-full ring-4 ring-zinc-950">
          <InitialAvatar name={profile.displayName} src={profile.avatarUrl} size="lg" />
        </div>

        <h1 className="text-2xl font-light tracking-tight text-white sm:text-3xl">
          {profile.displayName}
        </h1>

        {(profile.pronouns || profile.location) && (
          <p className="mt-1 text-xs text-zinc-500">
            {[profile.pronouns, profile.location].filter(Boolean).join(' · ')}
          </p>
        )}

        {profile.bio && (
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-300">
            {profile.bio}
          </p>
        )}

        {profile.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex min-h-9 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
              >
                <span aria-hidden="true">{linkIcon(link.url)}</span>
                {link.label}
              </a>
            ))}
          </div>
        )}

        {profile.pinnedTrack && (
          <a
            href={`https://open.spotify.com/track/${profile.pinnedTrack.id}`}
            className="mt-4 flex items-center gap-3 rounded-xl border bg-zinc-900/60 p-3 transition-colors hover:bg-zinc-900"
            style={{ borderColor: `${accent}66` }}
          >
            {profile.pinnedTrack.image ? (
              <img
                src={profile.pinnedTrack.image}
                alt=""
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-zinc-800" />
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: accent }}>
                Currently obsessed with
              </p>
              <p className="truncate text-sm font-medium text-white">{profile.pinnedTrack.name}</p>
              <p className="truncate text-xs text-zinc-400">{profile.pinnedTrack.artists}</p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
