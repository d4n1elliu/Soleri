const LINK_CLASS =
  'inline-flex min-h-11 items-center text-zinc-300 hover:text-white transition-colors sm:min-h-0';

// Author credit shared by the landing and legal page footers.
export function FooterCredit() {
  return (
    <p className="text-center">
      © 2026 Built by{' '}
      <a href="https://www.daniel-liu.dev" target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
        Daniel Liu
      </a>
      . View on{' '}
      <a href="https://github.com/d4n1elliu" target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
        GitHub
      </a>{' '}
      and{' '}
      <a
        href="https://www.linkedin.com/in/daniel-liu-987b27252/"
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_CLASS}
      >
        LinkedIn
      </a>
      .
    </p>
  );
}
