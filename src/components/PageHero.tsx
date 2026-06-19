import SectionHeader from "./SectionHeader";

interface PageHeroProps {
  label: string;
  title: React.ReactNode;
  description?: string;
}

export default function PageHero({ label, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-[4.5rem] pb-6 lg:pt-20 lg:pb-8">
      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-80" />
      <div className="container-custom relative px-4 sm:px-6 lg:px-8">
        <SectionHeader label={label} title={title} description={description} className="mb-0" />
      </div>
    </section>
  );
}
