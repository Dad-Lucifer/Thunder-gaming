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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Elegant dining experience at Kings Kitchen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6">
          Kings Kitchen
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Where Elegance Meets Family Tradition
        </p>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Experience the perfect blend of sophisticated cuisine and warm hospitality in a setting designed for memorable family moments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={scrollToMenu}
            size="lg"
            className="gradient-primary border-0 text-lg px-8 py-6 group"
          >
            Explore Menu
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-smooth" />
          </Button>
          <ReservationDialog
            trigger={
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-primary hover:bg-primary/10"
              >
                Reserve a Table
              </Button>
            }
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
