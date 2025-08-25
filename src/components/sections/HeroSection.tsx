import BackgroundCarousel from "@/components/BackgroundCarousel";
import ActionButton from "@/components/ui/ActionButton";
import { APP_TEXT } from "@/constants/text";

export default function HeroSection() {
  return (
    <section className="relative h-96 overflow-hidden">
      <BackgroundCarousel />
      {/* Gradient overlay from blue to orange */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/70 z-[5]"></div>
      <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
        <div className="max-w-4xl px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="text-secondary">{APP_TEXT.hero.title}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            {APP_TEXT.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ActionButton href="/schedule" variant="primary" size="lg">
              {APP_TEXT.hero.scheduleButton}
            </ActionButton>
            <ActionButton href="/points-table" variant="secondary" size="lg">
              {APP_TEXT.hero.pointsButton}
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}
