import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Minus, Plus, ShoppingCart, Sparkles, ChefHat, Check, X, Utensils, ArrowRight } from "lucide-react";
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
  tableNumber: z.string().min(1, { message: "Please enter your table number" }),
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

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
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
    setStep("table");
    setCart({});
    form.reset();
    setIsCartOpen(false);
  };

  const categories = ["Today's Special", "Breakfast", "Lunch", "Dinner", "Starters"];

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    const element = categoryRefs.current[category];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Scroll spy to update active category
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const containerTop = scrollContainerRef.current.scrollTop;
      const containerHeight = scrollContainerRef.current.clientHeight;
      const scrollPosition = containerTop + containerHeight / 3; // Trigger point

      for (const category of categories) {
        const element = categoryRefs.current[category];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
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
  }, [step]); // Re-attach when step changes to 'menu'

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

      <DialogContent className="max-w-full sm:max-w-[95vw] w-full h-[100dvh] sm:h-[95vh] p-0 gap-0 overflow-hidden bg-background border-none shadow-2xl sm:rounded-3xl duration-300">
        {step === "table" ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Background with blur and gradient */}
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url(${dinnerImg})` }}
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />

            <div className="relative z-20 w-full max-w-md p-6 md:p-8 animate-in zoom-in-95 duration-500">
              <div className="bg-background/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 rounded-full bg-primary/20 mb-6 ring-1 ring-primary/30">
                    <ChefHat className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-gray-300">Enter your table number to begin</p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onTableSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="tableNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Table Number"
                                {...field}
                                className="h-14 md:h-16 text-center text-xl md:text-2xl bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary/50 rounded-2xl transition-all"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-14 md:h-16 text-lg font-semibold gradient-primary rounded-2xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
                    >
                      Start Ordering
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full bg-gray-50 dark:bg-zinc-900">
            {/* Sidebar Navigation (Desktop) */}
            <div className="hidden md:flex flex-col w-64 bg-background border-r border-border/40 h-full p-6 shrink-0">
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
                  <Button variant="outline" className="w-full bg-background">Call Server</Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              {/* Mobile Header */}
              <div className="md:hidden flex items-center justify-between p-4 bg-background/95 backdrop-blur-md border-b border-border/40 sticky top-0 z-40 shrink-0 h-[70px]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <ChefHat className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-lg">Table {tableNumber}</span>
                </div>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                    <X className="h-5 w-5" />
                  </Button>
                </DialogClose>
              </div>

              {/* Mobile Category Pills */}
              <div className="md:hidden overflow-x-auto pb-3 pt-3 px-4 bg-background/95 backdrop-blur-md z-30 border-b border-border/40 scrollbar-hide shrink-0 sticky top-[70px]">
                <div className="flex gap-2 min-w-max">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => scrollToCategory(category)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border",
                        activeCategory === category
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
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
                className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-8 pb-32 md:pb-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/20"
              >
                <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
                  {categories.map((category) => (
                    <div
                      key={category}
                      ref={(el) => (categoryRefs.current[category] = el)}
                      className="scroll-mt-36 md:scroll-mt-8"
                    >
                      <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">{category}</h2>
                        <span className="text-sm md:text-base text-muted-foreground bg-muted px-2 py-1 rounded-md">{menuItems.filter(i => i.category === category).length} items</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {menuItems
                          .filter((item) => item.category === category)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="group bg-card rounded-2xl md:rounded-3xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
                            >
                              <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                <div className="absolute top-3 right-3">
                                  <span className="bg-white/90 backdrop-blur-md text-foreground font-bold px-2.5 py-1 rounded-full shadow-lg text-xs md:text-sm">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>

                                {item.popular && (
                                  <div className="absolute top-3 left-3">
                                    <span className="bg-primary text-primary-foreground text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                                      <Sparkles className="h-3 w-3" /> Popular
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="p-4 md:p-5 flex-1 flex flex-col">
                                <div className="flex-1">
                                  <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">{item.description}</p>
                                </div>

                                <div className="pt-2">
                                  {cart[item.id] ? (
                                    <div className="flex items-center gap-2 bg-muted rounded-xl p-1 pr-3 w-full justify-between animate-in fade-in zoom-in-95 duration-200">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => removeFromCart(item.id)}
                                        className="h-9 w-9 rounded-lg bg-background shadow-sm hover:text-destructive shrink-0"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <span className="font-bold text-lg w-6 text-center">{cart[item.id]}</span>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => addToCart(item.id)}
                                        className="h-9 w-9 rounded-lg bg-background shadow-sm hover:text-primary shrink-0"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      onClick={() => addToCart(item.id)}
                                      className="w-full h-11 rounded-xl gradient-primary hover:opacity-90 transition-all shadow-md group-hover:shadow-primary/25 font-semibold"
                                    >
                                      Add to Order
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

              {/* Floating Cart Bar (Mobile & Desktop) */}
              {getCartItemCount() > 0 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 animate-in slide-in-from-bottom-10 duration-500">
                  <div className="bg-foreground text-background rounded-2xl p-4 shadow-2xl flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform ring-1 ring-white/10" onClick={() => setIsCartOpen(true)}>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-inner">
                        {getCartItemCount()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">View Order</span>
                        <span className="text-xs opacity-80">${getCartTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="bg-white/10 p-2 rounded-full">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Sidebar / Drawer */}
            <div className={cn(
              "fixed inset-y-0 right-0 w-full md:w-[400px] bg-background shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 flex flex-col border-l border-border/40",
              isCartOpen ? "translate-x-0" : "translate-x-full"
            )}>
              <div className="p-4 md:p-6 border-b border-border/40 flex items-center justify-between bg-muted/30">
                <h2 className="text-xl md:text-2xl font-serif font-bold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  Your Order
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="rounded-full hover:bg-muted">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4 md:p-6">
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
                        <div key={itemId} className="flex gap-3 md:gap-4 bg-card/50 p-2 rounded-xl border border-border/20">
                          <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg md:rounded-xl" />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-sm md:text-base line-clamp-1">{item.name}</h4>
                              <span className="font-semibold text-sm md:text-base ml-2">${(item.price * quantity).toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 md:mb-3 line-clamp-1">{item.description}</p>
                            <div className="flex items-center gap-2 md:gap-3 bg-muted/50 rounded-lg p-1 w-max">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeFromCart(itemId)}
                                className="h-6 w-6 rounded-md hover:bg-background"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => addToCart(itemId)}
                                className="h-6 w-6 rounded-md hover:bg-background"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 md:p-6 bg-muted/30 border-t border-border/40 space-y-4">
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
                  className="w-full h-12 md:h-14 text-lg font-bold gradient-primary rounded-xl shadow-lg hover:shadow-primary/25 transition-all"
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
