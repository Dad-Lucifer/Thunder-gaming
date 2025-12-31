import { Button } from "@/components/ui/button";
import { ShoppingBag, UtensilsCrossed, ArrowRight, ChefHat, Phone } from "lucide-react";
import { ReservationDialog } from "@/components/ReservationDialog";
import { useNavigate } from "react-router-dom";
import restaurantImg from "@/assets/restaurant-interior.jpg";
import deliveryImg from "@/assets/delivery-bg.png";
import { toast } from "@/hooks/use-toast";

const MenuOptions = () => {
  const navigate = useNavigate();

  const handleOrderOnline = () => {
    toast({
      title: "Coming Soon",
      description: "Online ordering will be available shortly!",
    });
  };

  return (
    <section id="menu" className="py-16 md:py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16 lg:mb-20 animate-fade-in space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2 md:mb-4 backdrop-blur-sm border border-primary/20">
            <ChefHat className="w-5 h-5 md:w-6 md:h-6 text-primary mr-2" />
            <span className="text-primary font-semibold tracking-wide uppercase text-xs md:text-sm">Dining Options</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight leading-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Experience</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed px-4">
            Whether you crave the comfort of your own home or the vibrant atmosphere of our restaurant, we have the perfect option for you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 lg:h-[600px] w-full max-w-7xl mx-auto lg:rounded-[2.5rem] overflow-hidden lg:shadow-2xl lg:border lg:border-white/10">
          {/* Order Online Panel */}
          <div className="group relative flex-1 min-h-[450px] lg:min-h-full rounded-3xl lg:rounded-none overflow-hidden border border-white/10 lg:border-0 shadow-xl lg:shadow-none lg:hover:flex-[1.5] transition-[flex] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer">
            <div className="absolute inset-0 bg-black/40 lg:group-hover:bg-black/30 transition-colors duration-500 z-10" />
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-100 lg:group-hover:scale-110 transition-transform duration-1000 ease-out"
              style={{ backgroundImage: `url(${deliveryImg})` }}
            />
            {/* Gradient Overlay - Stronger on mobile for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent lg:from-black/90 lg:via-black/50 z-20" />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 lg:p-12 z-30 flex flex-col justify-end h-full">
              <div className="transform transition-transform duration-500 lg:translate-y-4 lg:group-hover:translate-y-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 md:mb-6 lg:group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <ShoppingBag className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>

                <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3 md:mb-4 lg:group-hover:text-primary transition-colors duration-300">
                  Order Online
                </h3>

                <p className="text-base md:text-lg text-zinc-300 mb-6 md:mb-8 max-w-md lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 lg:delay-100 leading-relaxed">
                  Experience gourmet dining at home. Freshly prepared, carefully packaged, and delivered swiftly to your doorstep.
                </p>

                <div className="lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 lg:delay-200 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleOrderOnline}
                    className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg bg-white text-black hover:bg-primary hover:text-white border-0 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] w-full sm:w-auto"
                  >
                    Order Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Dine In Panel */}
          <div className="group relative flex-1 min-h-[500px] lg:min-h-full rounded-3xl lg:rounded-none overflow-hidden border border-white/10 lg:border-0 shadow-xl lg:shadow-none lg:hover:flex-[1.5] transition-[flex] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
            <div className="absolute inset-0 bg-black/40 lg:group-hover:bg-black/30 transition-colors duration-500 z-10" />
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-100 lg:group-hover:scale-110 transition-transform duration-1000 ease-out"
              style={{ backgroundImage: `url(${restaurantImg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent lg:from-black/90 lg:via-black/50 z-20" />

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 lg:p-12 z-30 flex flex-col justify-end h-full">
              <div className="transform transition-transform duration-500 lg:translate-y-4 lg:group-hover:translate-y-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 md:mb-6 lg:group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <UtensilsCrossed className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>

                <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3 md:mb-4 lg:group-hover:text-primary transition-colors duration-300">
                  Dine In
                </h3>

                <p className="text-base md:text-lg text-zinc-300 mb-6 md:mb-8 max-w-md lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 lg:delay-100 leading-relaxed">
                  Immerse yourself in our elegant ambiance. Perfect for romantic dinners, family gatherings, and special celebrations.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 lg:delay-200">
                  <ReservationDialog
                    trigger={
                      <Button className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg bg-white text-black hover:bg-primary hover:text-white border-0 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] w-full sm:w-auto">
                        Reserve Table
                      </Button>
                    }
                  />
                  <Button
                    variant="outline"
                    onClick={() => navigate("/menu-selection")}
                    className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg border-2 border-white/30 text-white hover:bg-white/10 hover:border-white hover:text-white backdrop-blur-sm rounded-xl transition-all duration-300 w-full sm:w-auto"
                  >
                    Order from Table
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuOptions;
