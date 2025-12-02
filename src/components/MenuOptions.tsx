import { Button } from "@/components/ui/button";
import { ShoppingBag, UtensilsCrossed, ArrowRight, ChefHat } from "lucide-react";
import { ReservationDialog } from "@/components/ReservationDialog";
import { useNavigate } from "react-router-dom";
import restaurantImg from "@/assets/restaurant-interior.jpg";
import deliveryImg from "@/assets/delivery-bg.png";

const MenuOptions = () => {
  const navigate = useNavigate();

  return (
    <section id="menu" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <ChefHat className="w-6 h-6 text-primary mr-2" />
            <span className="text-primary font-semibold tracking-wide uppercase text-sm">Dining Options</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Whether you crave the comfort of your own home or the vibrant atmosphere of our restaurant, we have the perfect option for you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row h-[800px] lg:h-[600px] w-full max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
          {/* Order Online Panel */}
          <div className="group relative flex-1 min-h-[300px] lg:min-h-full hover:flex-[1.5] transition-[flex] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500 z-10" />
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out"
              style={{ backgroundImage: `url(${deliveryImg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20" />

            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-30 flex flex-col justify-end h-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-4xl font-serif font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                Order Online
              </h3>

              <p className="text-lg text-gray-200 mb-8 max-w-md opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 leading-relaxed">
                Experience gourmet dining at home. Freshly prepared, carefully packaged, and delivered swiftly to your doorstep.
              </p>

              <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                <Button className="h-14 px-8 text-lg bg-white text-black hover:bg-primary hover:text-white border-0 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                  Order Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Dine In Panel */}
          <div className="group relative flex-1 min-h-[300px] lg:min-h-full hover:flex-[1.5] transition-[flex] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500 z-10" />
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-100 group-hover:scale-110 transition-transform duration-1000 ease-out"
              style={{ backgroundImage: `url(${restaurantImg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20" />

            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-30 flex flex-col justify-end h-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-4xl font-serif font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                Dine In
              </h3>

              <p className="text-lg text-gray-200 mb-8 max-w-md opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 leading-relaxed">
                Immerse yourself in our elegant ambiance. Perfect for romantic dinners, family gatherings, and special celebrations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                <ReservationDialog
                  trigger={
                    <Button className="h-14 px-8 text-lg bg-white text-black hover:bg-primary hover:text-white border-0 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                      Reserve Table
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  onClick={() => navigate("/menu-selection")}
                  className="h-14 px-8 text-lg border-2 border-white/30 text-white hover:bg-white/10 hover:border-white hover:text-white backdrop-blur-sm rounded-xl transition-all duration-300"
                >
                  Order from Table
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuOptions;
