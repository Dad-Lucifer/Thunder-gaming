import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Minus, Plus, ShoppingCart, Sparkles, ChefHat, Check, X, Utensils, ArrowRight, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import breakfastImg from "@/assets/menu-breakfast.jpg";
import lunchImg from "@/assets/menu-lunch.jpg";
import dinnerImg from "@/assets/menu-dinner.jpg";
import startersImg from "@/assets/menu-starters.jpg";
import specialImg from "@/assets/menu-special.jpg";

const orderSchema = z.object({
  tableNumber: z.string().min(1, { message: "Table number is required" }).regex(/^\d+$/, "Must be a number"),
});

type OrderForm = z.infer<typeof orderSchema>;

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Breakfast" | "Lunch" | "Dinner" | "Starters" | "Today's Special";
  image: string;
  popular?: boolean;
}

const menuItems: MenuItem[] = [
  // Breakfast
  { id: "b1", name: "Classic Eggs Benedict", description: "Poached eggs with hollandaise sauce on toasted muffin", price: 14.99, category: "Breakfast", image: breakfastImg, popular: true },
  { id: "b2", name: "Pancake Stack", description: "Fluffy pancakes with maple syrup and fresh berries", price: 12.99, category: "Breakfast", image: breakfastImg },
  { id: "b3", name: "French Toast", description: "Brioche French toast with cinnamon and berries", price: 13.99, category: "Breakfast", image: breakfastImg },
  { id: "b4", name: "Full English Breakfast", description: "Eggs, bacon, sausage, beans, mushrooms & toast", price: 16.99, category: "Breakfast", image: breakfastImg },

  // Lunch
  { id: "l1", name: "Grilled Chicken Sandwich", description: "With crispy fries, avocado and fresh salad", price: 15.99, category: "Lunch", image: lunchImg, popular: true },
  { id: "l2", name: "Caesar Salad", description: "Crisp romaine, parmesan, croutons with classic dressing", price: 12.99, category: "Lunch", image: lunchImg },
  { id: "l3", name: "Club Sandwich", description: "Triple-decker with turkey, bacon, lettuce and tomato", price: 14.99, category: "Lunch", image: lunchImg },
  { id: "l4", name: "Fish & Chips", description: "Beer-battered cod with tartar sauce and mushy peas", price: 17.99, category: "Lunch", image: lunchImg },

  // Dinner
  { id: "d1", name: "Ribeye Steak", description: "Premium aged beef with roasted vegetables", price: 42.99, category: "Dinner", image: dinnerImg, popular: true },
  { id: "d2", name: "Grilled Salmon", description: "Fresh Atlantic salmon with herbs and lemon butter", price: 28.99, category: "Dinner", image: dinnerImg },
  { id: "d3", name: "Truffle Pasta", description: "Handmade pasta with black truffle oil and parmesan", price: 24.99, category: "Dinner", image: dinnerImg },
  { id: "d4", name: "Lamb Chops", description: "Herb-crusted with mint sauce and mashed potatoes", price: 34.99, category: "Dinner", image: dinnerImg },

  // Starters
  { id: "s1", name: "Bruschetta", description: "Toasted bread with tomatoes, basil and balsamic glaze", price: 8.99, category: "Starters", image: startersImg },
  { id: "s2", name: "Spring Rolls", description: "Crispy vegetable spring rolls with sweet chili sauce", price: 7.99, category: "Starters", image: startersImg },
  { id: "s3", name: "Stuffed Mushrooms", description: "With garlic, herb and cream cheese filling", price: 9.99, category: "Starters", image: startersImg },
  { id: "s4", name: "Calamari", description: "Fried squid rings with lemon aioli", price: 11.99, category: "Starters", image: startersImg, popular: true },

  // Today's Special
  { id: "sp1", name: "Chef's Surf & Turf", description: "Premium ribeye with jumbo prawns and garlic butter", price: 54.99, category: "Today's Special", image: specialImg, popular: true },
  { id: "sp2", name: "Truffle Risotto", description: "Arborio rice with black truffle, wild mushrooms & parmesan", price: 32.99, category: "Today's Special", image: specialImg },
  { id: "sp3", name: "Pan-Seared Sea Bass", description: "Fresh catch with lemon butter sauce and asparagus", price: 38.99, category: "Today's Special", image: specialImg },
  { id: "sp4", name: "Wagyu Beef Wellington", description: "Premium wagyu wrapped in puff pastry with mushroom duxelles", price: 62.99, category: "Today's Special", image: specialImg },
];

interface TableOrderingDialogProps {
  trigger?: React.ReactNode;
}

export const TableOrderingDialog = ({ trigger }: TableOrderingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"table" | "menu">("table");
  const [tableNumber, setTableNumber] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>("Today's Special");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Using refs to avoid re-renders on scroll
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      tableNumber: ""
    }
  });

  const onTableSubmit = (data: OrderForm) => {
    setTableNumber(data.tableNumber);
    setStep("menu");
  };

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(i => i.id === itemId);
      return total + (item?.price || 0) * quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const submitOrder = () => {
    const orderItems = Object.entries(cart).map(([itemId, quantity]) => {
      const item = menuItems.find(i => i.id === itemId);
      return `${quantity}x ${item?.name}`;
    }).join(", ");

    toast({
      title: "Order Placed Successfully! 🎉",
      description: `Table ${tableNumber}: ${orderItems}. Total: $${getCartTotal().toFixed(2)}`,
    });

    setOpen(false);
    // Reset state after transition
    setTimeout(() => {
      setStep("table");
      setCart({});
      form.reset();
      setIsCartOpen(false);
    }, 300);
  };

  const categories = ["Today's Special", "Breakfast", "Lunch", "Dinner", "Starters"];

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    const element = categoryRefs.current[category];
    if (element) {
      // Adjust for sticky headers
      const headerOffset = window.innerWidth < 768 ? 120 : 20;
      const top = element.offsetTop - headerOffset;
      scrollContainerRef.current?.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Scroll spy to update active category
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const containerTop = scrollContainerRef.current.scrollTop;
      const containerHeight = scrollContainerRef.current.clientHeight;
      const scrollPosition = containerTop + containerHeight / 3;

      // Adjust offset for mobile
      const offset = window.innerWidth < 768 ? 140 : 0;

      for (const category of categories) {
        const element = categoryRefs.current[category];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition + offset >= offsetTop && scrollPosition + offset < offsetTop + offsetHeight) {
            setActiveCategory(category);
            break;
          }
        }
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [step]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setTimeout(() => {
          setStep("table");
          setCart({});
          form.reset();
          setIsCartOpen(false);
        }, 300);
      }
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order from Your Table
          </Button>
        )}
      </DialogTrigger>

      {/* Full screen dialog on mobile, rounded large dialog on desktop */}
      <DialogContent className="max-w-full sm:max-w-[95vw] w-full h-[100dvh] sm:h-[95vh] p-0 gap-0 overflow-hidden bg-background border-none shadow-none sm:shadow-2xl sm:rounded-3xl duration-300 flex flex-col">
        {step === "table" ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Background with blur and gradient */}
            <div
              className="absolute inset-0 bg-cover bg-center z-0 animate-slow-zoom"
              style={{ backgroundImage: `url(${dinnerImg})` }}
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />

            <div className="relative z-20 w-full max-w-md p-6 animate-in zoom-in-95 duration-500">
              <div className="bg-zinc-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center mb-8 relative z-10">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6 ring-1 ring-white/10 shadow-inner">
                    <ChefHat className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-zinc-300 text-sm">Please enter your table number to access the menu.</p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onTableSubmit)} className="space-y-6 relative z-10">
                    <FormField
                      control={form.control}
                      name="tableNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative group">
                              <Input
                                placeholder="e.g. 12"
                                {...field}
                                onChange={(e) => {
                                  // Only allow numbers
                                  const val = e.target.value.replace(/\D/g, '');
                                  field.onChange(val);
                                }}
                                inputMode="numeric" // Triggers numeric keyboard on mobile
                                className="h-16 text-center text-3xl font-bold bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-2xl transition-all tracking-widest"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-bold gradient-primary rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                    >
                      View Menu <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </Form>
              </div>
              <p className="text-center text-white/40 text-xs mt-8">Kings Kitchen Table Service</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full bg-background relative isolate">
            {/* Sidebar Navigation (Desktop) */}
            <div className="hidden md:flex flex-col w-64 bg-card border-r border-border/40 h-full p-6 shrink-0 z-20">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ChefHat className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">Kings Kitchen</h3>
                  <p className="text-xs text-muted-foreground mt-1">Table {tableNumber}</p>
                </div>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => scrollToCategory(category)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between group",
                      activeCategory === category
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="font-medium">{category}</span>
                    {activeCategory === category && <ArrowRight className="h-4 w-4 animate-in fade-in slide-in-from-left-2" />}
                  </button>
                ))}
              </div>

              <div className="mt-auto">
                <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-2">Need assistance?</p>
                  <Button variant="outline" className="w-full bg-background border-primary/20 hover:border-primary text-primary hover:bg-primary/5">Call Server</Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-zinc-50/50 dark:bg-zinc-950/50">
              {/* Mobile Header (Sticky) */}
              <div className="md:hidden flex items-center justify-between px-4 h-16 bg-background/80 backdrop-blur-xl border-b border-border/40 sticky top-0 z-50 shrink-0 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <ChefHat className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block leading-tight">Order Menu</span>
                    <span className="text-xs text-muted-foreground block leading-tight">Table {tableNumber}</span>
                  </div>
                </div>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted -mr-2">
                    <X className="h-5 w-5" />
                  </Button>
                </DialogClose>
              </div>

              {/* Mobile Category Pills (Sticky below header) */}
              <div className="md:hidden overflow-x-auto py-3 px-4 bg-background/95 backdrop-blur-md z-40 border-b border-border/40 scrollbar-hide shrink-0 sticky top-16">
                <div className="flex gap-2 min-w-max">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => scrollToCategory(category)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border ring-1 ring-transparent",
                        activeCategory === category
                          ? "bg-primary text-primary-foreground border-primary shadow-md ring-primary/20"
                          : "bg-background border-border hover:bg-muted text-muted-foreground"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items List (Continuous Scroll) */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-8 pb-32 md:pb-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
                  {categories.map((category) => (
                    <div
                      key={category}
                      ref={(el) => (categoryRefs.current[category] = el)}
                      className="scroll-mt-36 md:scroll-mt-8"
                    >
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground relative pl-0">
                          {category}
                        </h2>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted">{menuItems.filter(i => i.category === category).length} items</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                        {menuItems
                          .filter((item) => item.category === category)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="group bg-card rounded-2xl md:rounded-3xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 flex flex-row md:flex-col h-32 md:h-auto"
                            >
                              {/* Image Container - Left on mobile, Top on desktop */}
                              <div className="relative w-32 md:w-full md:aspect-[4/3] shrink-0 overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:opacity-60" />

                                {/* Desktop only badges */}
                                <div className="hidden md:block absolute top-3 right-3">
                                  <span className="bg-white/90 backdrop-blur-md text-foreground font-bold px-2.5 py-1 rounded-full shadow-lg text-sm">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>
                                {item.popular && (
                                  <div className="hidden md:block absolute top-3 left-3">
                                    <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                                      <Sparkles className="h-3 w-3" /> Popular
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Content Container */}
                              <div className="p-3 md:p-5 flex-1 flex flex-col justify-between md:justify-start min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <div className="min-w-0">
                                    <h3 className="text-base md:text-xl font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                                    <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 mb-1 md:mb-4">{item.description}</p>
                                  </div>
                                  {/* Mobile Price */}
                                  <span className="md:hidden font-bold text-sm bg-muted px-2 py-1 rounded-md shrink-0">${item.price.toFixed(2)}</span>
                                </div>

                                <div className="pt-1 md:pt-2 mt-auto">
                                  {cart[item.id] ? (
                                    <div className="flex items-center gap-2 bg-muted/80 rounded-lg md:rounded-xl p-1 pr-3 w-full justify-between animate-in fade-in zoom-in-95 duration-200">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => removeFromCart(item.id)}
                                        className="h-7 w-7 md:h-9 md:w-9 rounded-md md:rounded-lg bg-background shadow-sm hover:text-destructive shrink-0"
                                      >
                                        <Minus className="h-3 w-3 md:h-4 md:w-4" />
                                      </Button>
                                      <span className="font-bold text-sm md:text-lg w-6 text-center">{cart[item.id]}</span>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => addToCart(item.id)}
                                        className="h-7 w-7 md:h-9 md:w-9 rounded-md md:rounded-lg bg-background shadow-sm hover:text-primary shrink-0"
                                      >
                                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      onClick={() => addToCart(item.id)}
                                      size="sm"
                                      className="w-full h-8 md:h-11 rounded-lg md:rounded-xl gradient-primary hover:opacity-90 transition-all shadow-sm group-hover:shadow-primary/25 font-semibold text-xs md:text-sm"
                                    >
                                      Add <span className="hidden md:inline ml-1">to Order</span>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Cart Bar (Mobile Only - Simplified) */}
              {getCartItemCount() > 0 && !isCartOpen && (
                <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-40 animate-in slide-in-from-bottom-10 duration-500">
                  <div className="bg-zinc-900 border border-white/10 text-white rounded-full p-2 pl-4 shadow-2xl flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setIsCartOpen(true)}>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-black h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {getCartItemCount()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">View Cart</span>
                      </div>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-full font-bold text-sm">
                      ${getCartTotal().toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Sidebar / Drawer (Slide up on mobile, Slide left on desktop) */}
            <div className={cn(
              "fixed inset-x-0 bottom-0 md:inset-y-0 md:left-auto md:right-0 md:bottom-auto w-full h-[90vh] md:h-full md:w-[400px] bg-background shadow-2xl z-50 flex flex-col border-t md:border-t-0 md:border-l border-border/40 rounded-t-3xl md:rounded-none",
              // Mobile Transitions: Slide Up/Down
              "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              isCartOpen ? "translate-y-0 md:translate-x-0" : "translate-y-[100%] md:translate-y-0 md:translate-x-full"
            )}>
              {/* Mobile Drag Handle */}
              <div className="md:hidden w-full flex justify-center pt-3 pb-1" onClick={() => setIsCartOpen(false)}>
                <div className="w-12 h-1.5 bg-muted rounded-full" />
              </div>

              <div className="p-4 md:p-6 border-b border-border/40 flex items-center justify-between bg-muted/30 md:bg-transparent">
                <h2 className="text-xl md:text-2xl font-serif font-bold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  Your Order
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="rounded-full hover:bg-muted hidden md:flex">
                  <X className="h-5 w-5" />
                </Button>
                {/* Mobile Close Button (Optional since we have drag handle, but good to have) */}
                <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)} className="md:hidden text-muted-foreground">
                  Close
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4 md:p-6 bg-background">
                {Object.keys(cart).length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Utensils className="h-10 w-10 opacity-50" />
                    </div>
                    <p className="text-lg font-medium mb-2">Your cart is empty</p>
                    <p className="text-sm">Start adding some delicious items!</p>
                    <Button variant="outline" className="mt-6" onClick={() => setIsCartOpen(false)}>
                      Browse Menu
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {Object.entries(cart).map(([itemId, quantity]) => {
                      const item = menuItems.find(i => i.id === itemId);
                      if (!item) return null;
                      return (
                        <div key={itemId} className="flex gap-3 md:gap-4 bg-card p-3 rounded-2xl border border-border/20 shadow-sm relative group">
                          <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl" />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-bold text-sm md:text-base line-clamp-2 leading-tight">{item.name}</h4>
                              <span className="font-semibold text-sm md:text-base">${(item.price * quantity).toFixed(2)}</span>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-muted-foreground line-clamp-1 hidden md:block">{item.description}</p>
                              <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-1">
                                <button
                                  onClick={() => removeFromCart(itemId)}
                                  className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                                <button
                                  onClick={() => addToCart(itemId)}
                                  className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 md:p-6 bg-muted/20 border-t border-border/40 space-y-4 pb-8 md:pb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">${(getCartTotal() * 1.1).toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={submitOrder}
                  className="w-full h-14 text-lg font-bold gradient-primary rounded-xl shadow-lg hover:shadow-primary/25 transition-all"
                  disabled={getCartItemCount() === 0}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
