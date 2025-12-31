import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { ReservationDialog } from "@/components/ReservationDialog";

const Hero = () => {
  const scrollToMenu = () => {
    const element = document.getElementById("menu");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Responsive Overlay */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src={heroImage}
          alt="Elegant dining experience at Kings Kitchen"
          className="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
          loading="eager"
          draggable="false"
        />
        {/* Mobile-optimized gradient: darker at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background/95 md:from-black/50 md:via-black/30 md:to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center animate-fade-in flex flex-col items-center justify-center h-full pt-16 md:pt-0">
        <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 text-xs md:text-sm font-medium tracking-widest text-primary border border-primary/30 rounded-full bg-primary/10 backdrop-blur-sm mb-2 md:mb-0">
            EST. 2008
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-tight leading-tight drop-shadow-2xl">
            Kings Kitchen
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-light text-zinc-200 tracking-wide drop-shadow-lg">
            Where Elegance Meets <span className="text-primary font-medium">Family Tradition</span>
          </p>
          <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-xl sm:max-w-2xl mx-auto leading-relaxed drop-shadow-md hidden sm:block">
            Experience the perfect blend of sophisticated cuisine and warm hospitality in a setting designed for memorable family moments.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-4 mt-8 md:mt-12 px-4 sm:px-0">
          <Button
            onClick={scrollToMenu}
            size="lg"
            className="w-full sm:w-auto gradient-primary border-0 text-lg h-14 sm:h-12 md:h-14 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 group"
          >
            Explore Menu
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="w-full sm:w-auto">
            <ReservationDialog
              trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg h-14 sm:h-12 md:h-14 px-8 rounded-full border-2 border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                >
                  Reserve a Table
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer onClick={scrollToMenu} md:bottom-10 animate-bounce">
        <div className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[10px] uppercase tracking-widest text-white/80 hidden md:block">Scroll</span>
          <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5 md:p-2 backdrop-blur-sm bg-black/10">
            <div className="w-1 md:w-1.5 h-2 md:h-3 bg-white/80 rounded-full animate-scroll-down" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
