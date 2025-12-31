import restaurantInterior from "@/assets/restaurant-interior.jpg";

const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 lg:py-32 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="animate-fade-in order-2 md:order-1">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
              A Legacy of Excellence
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4 md:mb-6 leading-relaxed">
              At Kings Kitchen, we believe that exceptional dining is about more than just food—it's about creating lasting memories with the people you love. Our restaurant combines timeless elegance with a warm, family-friendly atmosphere.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              Every dish is crafted with passion and precision, using only the finest locally-sourced ingredients. Our expert chefs blend traditional techniques with contemporary innovation to deliver an unforgettable culinary experience.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mt-8 p-4 bg-background/50 rounded-2xl border border-white/5 shadow-sm">
              <div className="text-center p-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 md:mb-2">15+</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Years Experience</div>
              </div>
              <div className="text-center p-2 border-l border-white/10">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 md:mb-2">200+</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Signature Dishes</div>
              </div>
              <div className="text-center p-2 border-l border-white/10">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 md:mb-2">50K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">Happy Guests</div>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="animate-scale-in order-1 md:order-2 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl z-10 pointer-events-none" />
            <img
              src={restaurantInterior}
              alt="Elegant interior of Kings Kitchen restaurant"
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-2xl elegant-shadow transform transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
