const CREDITS = [
  { prefix: 'Built by', label: 'Daniel Liu', href: 'https://www.daniel-liu.dev' },
  { prefix: 'View on', label: 'GitHub', href: 'https://github.com/d4n1elliu' },
  { prefix: 'Connect on', label: 'LinkedIn', href: 'https://www.linkedin.com/in/daniel-liu-987b27252/' },
];

const ITEM_CLASS = 'flex min-h-11 items-center justify-center gap-1 whitespace-nowrap sm:min-h-0';

// Author credit shared by the landing and legal page footers.
export function FooterCredit() {
  return (
    <div className="grid w-full grid-cols-2 gap-x-4 sm:flex sm:w-auto sm:items-center sm:gap-8">
      {CREDITS.map((credit) => (
        <span key={credit.label} className={`${ITEM_CLASS} last:col-span-2`}>
          {credit.prefix}{' '}
          <a
            href={credit.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center text-zinc-300 hover:text-white transition-colors sm:min-h-0"
          >
            {credit.label}
          </a>
        </span>
      ))}
    </div>
  );
}
