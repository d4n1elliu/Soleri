const SIZES = {
  sm: 'h-10 w-10 text-base',
  md: 'h-12 w-12 text-lg',
  lg: 'h-20 w-20 text-3xl',
} as const;

export function InitialAvatar({
  name,
  src,
  size = 'md',
}: {
  name: string;
  src?: string | null;
  size?: keyof typeof SIZES;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${SIZES[size]} rounded-full object-cover`}
        referrerPolicy="no-referrer"
      />
    );
  }
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <div
      className={`${SIZES[size]} flex items-center justify-center rounded-full bg-zinc-700 font-semibold text-zinc-200`}
    >
      {initial}
    </div>
  );
}
