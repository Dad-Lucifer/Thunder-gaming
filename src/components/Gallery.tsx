import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Gallery = () => {
  const dishes = [
    {
      image: dish1,
      title: "Signature Pasta",
      description: "Fresh handmade pasta with seasonal ingredients",
      badge: "Popular"
    },
    {
      image: dish2,
      title: "Grilled Salmon",
      description: "Atlantic salmon with herb butter and vegetables",
      badge: "New"
    },
    {
      image: dish3,
      title: "Decadent Desserts",
      description: "Artisan desserts crafted by our pastry chef",
      badge: "Sweet"
    },
  ];

  return (
    <section id="gallery" className="py-16 md:py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 lg:mb-20 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4 md:mb-6">
            Culinary Masterpieces
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A glimpse into the artistry and passion behind every dish we serve.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {dishes.map((dish, index) => (
            <div
              key={index}
              className="group relative cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl border border-white/5 aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4]">
                <img
                  src={dish.image}
                  alt={dish.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Overlay - Always visible on mobile (bottom gradient), Hover on desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="self-start px-3 py-1 mb-3 text-xs font-medium tracking-wider text-black bg-primary rounded-full uppercase transform translate-y-4 opacity-0 transition-all duration-500 md:group-hover:translate-y-0 md:group-hover:opacity-100 block md:hidden lg:block lg:md:hidden">
                    {dish.badge}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 transform md:translate-y-4 transition-transform duration-500 md:group-hover:translate-y-0">
                    {dish.title}
                  </h3>
                  <p className="text-sm md:text-base text-zinc-300 transform md:translate-y-4 transition-transform duration-500 md:group-hover:translate-y-0 delay-75">
                    {dish.description}
                  </p>
                </div>

                {/* Mobile Specific Overlay (Always Visible) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:hidden z-10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-black bg-primary rounded-full uppercase">
                      {dish.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {dish.title}
                  </h3>
                  <p className="text-sm text-zinc-300 line-clamp-2">
                    {dish.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center animate-fade-in delay-300">
          <Button variant="outline" size="lg" className="rounded-full px-8 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-300 group">
            View Full Gallery <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
