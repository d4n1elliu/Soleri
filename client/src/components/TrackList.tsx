import React from 'react'

type TrackListProps = {
  tracks: any[]
}

const msToTime = (ms: number) => {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function TrackList({ tracks }: TrackListProps) {
  const top10 = (tracks || []).slice(0, 10)

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-xl font-semibold">Your Top 10 Tracks</h2>
        <p className="text-sm text-gray-400">
          Click a title to open on Spotify.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm shadow-xl">
        {/* Header */}
        <div className="grid grid-cols-12 gap-3 px-4 sm:px-6 py-3 text-xs uppercase tracking-wider text-gray-400 sticky top-0 bg-zinc-900/70 rounded-t-2xl border-b border-white/10">
          <div className="col-span-1">#</div>
          <div className="col-span-6 sm:col-span-5">Track</div>
          <div className="hidden sm:block sm:col-span-4">Album</div>
          <div className="col-span-2 text-right">Time</div>
        </div>

        {/* Scroll area */}
        <div className="max-h-[540px] overflow-y-auto divide-y divide-white/5">
          {top10.map((t, idx) => {
            const cover =
              t?.album?.images?.[2]?.url ||
              t?.album?.images?.[1]?.url ||
              t?.album?.images?.[0]?.url
            const artists = (t?.artists || []).map((a: any) => a.name).join(', ')

            return (
              <div
                key={t.id || idx}
                className="grid grid-cols-12 gap-3 items-center px-4 sm:px-6 py-3 hover:bg-white/[0.03]"
              >
                <div className="col-span-1 text-sm tabular-nums text-gray-400">
                  {idx + 1}
                </div>

                <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                  <img
                    src={cover}
                    alt="Album"
                    className="h-12 w-12 rounded-md object-cover border border-white/10"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <a
                      href={t?.external_urls?.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate font-medium text-white hover:underline"
                      title={t?.name}
                    >
                      {t?.name}
                    </a>
                    <div className="truncate text-sm text-gray-400">
                      {artists}
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block sm:col-span-4 truncate text-sm text-gray-300/80">
                  {t?.album?.name}
                </div>

                <div className="col-span-2 text-right text-sm text-gray-300">
                  {msToTime(t?.duration_ms || 0)}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 text-xs text-gray-500">
          Showing top {top10.length} tracks
        </div>
      </div>
    </section>
  )
}