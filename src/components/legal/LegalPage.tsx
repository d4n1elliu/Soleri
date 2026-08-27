export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalPageProps {
  title: string;
  effectiveDate: string;
  sections: LegalSection[];
}

export function LegalPage({ title, effectiveDate, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-green-500 selection:text-black font-sans antialiased">
      {/* Nav */}
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
            Back to Home
          </a>
        </div>
      </nav>

      {/* Header */}
      <header className="px-4 pt-20 sm:px-8">
        <div className="w-full px-4 sm:px-8">
          <div className="border-b border-zinc-900 pb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Effective {effectiveDate}
            </span>
            <h1 className="mt-2 text-4xl font-light tracking-tight text-white sm:text-6xl">{title}</h1>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="px-4 py-16 sm:px-8">
        <div className="w-full max-w-3xl px-4 sm:px-8">
          <div className="flex flex-col gap-12">
            {sections.map((section, index) => (
              <section key={section.heading}>
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                  {String(index + 1).padStart(2, '0')} / {section.heading}
                </span>
                <div className="mt-4 flex flex-col gap-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-zinc-400">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-8 py-8 text-xs text-zinc-500">
        <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
          </div>
          <div>© 2026 Soleri. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  );
}
