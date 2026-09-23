const SIZES = {
  sm: 'h-10 w-10 text-base',
  md: 'h-12 w-12 text-lg',
  lg: 'h-20 w-20 text-3xl',
} as const;

export function InitialAvatar({
  name,
  size = 'md',
}: {
  name: string;
  size?: keyof typeof SIZES;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <div
      className={`${SIZES[size]} flex items-center justify-center rounded-full bg-zinc-700 font-semibold text-zinc-200`}
    >
      {initial}
    </div>
  );
}
