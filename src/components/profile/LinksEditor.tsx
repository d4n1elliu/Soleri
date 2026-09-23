import { PROFILE_LIMITS } from '../../types';
import { inputCls } from './formStyles';

interface LinksEditorProps {
  links: { label: string; url: string }[];
  onChange: (links: { label: string; url: string }[]) => void;
}

export function LinksEditor({ links, onChange }: LinksEditorProps) {
  function update(index: number, patch: Partial<{ label: string; url: string }>) {
    onChange(links.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
      <h2 className="mb-1 text-sm font-semibold text-white">Links</h2>
      <p className="mb-4 text-xs text-zinc-600">Up to {PROFILE_LIMITS.links}, https only.</p>
      <div className="space-y-3">
        {links.map((link, i) => (
          <div key={i} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2">
            <input
              aria-label={`Link ${i + 1} label`}
              className={inputCls}
              maxLength={PROFILE_LIMITS.linkLabel}
              placeholder="Label"
              value={link.label}
              onChange={(e) => update(i, { label: e.target.value })}
            />
            <input
              aria-label={`Link ${i + 1} URL`}
              className={inputCls}
              maxLength={PROFILE_LIMITS.linkUrl}
              placeholder="https://…"
              type="url"
              value={link.url}
              onChange={(e) => update(i, { url: e.target.value })}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
