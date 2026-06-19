const universities = [
  "USP", "UNICAMP", "UFMG", "UFRJ", "PUC", "UNB", "UFPR", "UFSC",
  "UNESP", "UERJ", "Mackenzie", "FGV",
];

export default function LogoBar() {
  return (
    <section className="border-y border-surface-200/80 bg-white/60 py-5 backdrop-blur-sm">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
          Estudantes de todo o Brasil confiam na MentorUp
        </p>
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee gap-10 whitespace-nowrap">
            {[...universities, ...universities].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="text-sm font-semibold tracking-wide text-zinc-400/90"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
