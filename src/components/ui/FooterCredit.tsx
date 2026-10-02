const CREDITS = [
  { label: 'Built by Daniel Liu', href: 'https://www.daniel-liu.dev' },
  { label: 'GitHub', href: 'https://github.com/d4n1elliu' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/daniel-liu-987b27252/' },
];

// Author credit shared by the landing and legal page footers.
export function FooterCredit() {
  return (
    <div className="grid w-full grid-cols-2 gap-x-4 sm:flex sm:w-auto sm:items-center sm:gap-8">
      {CREDITS.map((credit) => (
        <a
          key={credit.label}
          href={credit.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center justify-center whitespace-nowrap hover:text-zinc-300 transition-colors first:col-span-2 sm:min-h-0 sm:justify-start"
        >
          {credit.label}
        </a>
      ))}
    </div>
  );
}
