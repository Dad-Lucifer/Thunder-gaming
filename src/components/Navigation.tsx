import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChefHat } from "lucide-react";
import { ReservationDialog } from "@/components/ReservationDialog";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for the fixed header
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection("home")}>
            <div className={`p-1.5 rounded-lg transition-colors duration-300 ${isScrolled ? "bg-primary/10" : "bg-black/20 backdrop-blur-sm"}`}>
              <ChefHat className={`w-6 h-6 ${isScrolled ? "text-primary" : "text-white"}`} />
            </div>
            <h1 className={`text-2xl font-serif font-bold transition-colors duration-300 ${isScrolled ? "text-foreground" : "text-white shadow-sm"}`}>
              Kings Kitchen
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {["Home", "About", "Menu", "Gallery", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10 ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"}`}
              >
                {item}
              </button>
            ))}

            <div className="ml-4">
              <ReservationDialog
                trigger={
                  <Button className={`rounded-full px-6 transition-all duration-300 ${isScrolled ? "gradient-primary border-0" : "bg-white text-black hover:bg-white/90"}`}>
                    Reserve Table
                  </Button>
                }
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${isScrolled ? "text-foreground hover:bg-secondary" : "text-white hover:bg-white/10"}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-white/10 shadow-2xl animate-fade-in origin-top md:hidden">
            <div className="container mx-auto p-4 space-y-4 max-h-[85vh] overflow-y-auto">
              {["Home", "About", "Menu", "Gallery", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left py-4 px-4 text-lg font-medium text-white/90 hover:text-primary hover:bg-white/5 rounded-xl transition-all border-b border-white/5 last:border-0"
                >
                  {item}
                </button>
              ))}
              <div className="pt-4 pb-8">
                <ReservationDialog
                  trigger={
                    <Button className="w-full h-12 text-lg rounded-xl gradient-primary border-0 shadow-lg shadow-primary/20">
                      Reserve a Table
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
