interface PageBannerProps {
  badge: string;
  title: string;
  subtitle: string;
}

export default function PageBanner({ badge, title, subtitle }: PageBannerProps) {
  return (
    <header className="pt-16">
      <div className="gradient-dark py-14 md:py-18 relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-pattern opacity-30" />
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-[var(--gold-400)]/10 rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 border border-[var(--gold-400)]/15 rounded-full" />
        <div className="container-wide text-center relative z-10">
          <span className="badge badge-gold mb-4">{badge}</span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3 animate-fade-in-up stagger-1 opacity-0 fill-forwards">
            {title}
          </h1>
          <p className="text-white/60 text-sm md:text-base animate-fade-in-up stagger-2 opacity-0 fill-forwards">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}
