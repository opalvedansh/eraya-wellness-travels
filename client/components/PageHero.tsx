import NavBar from "./NavBar";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
}

export default function PageHero({
  title,
  subtitle,
  backgroundImage,
}: PageHeroProps) {
  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden flex items-center justify-center pt-16 sm:pt-20 lg:pt-24">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Navigation Bar */}
      <NavBar />

      {/* Content Container */}
      <div className="relative z-10 px-3 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-white leading-tight mb-2 sm:mb-3 lg:mb-6 tracking-tight">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-gray-100 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl font-light leading-relaxed px-1 sm:px-0">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
