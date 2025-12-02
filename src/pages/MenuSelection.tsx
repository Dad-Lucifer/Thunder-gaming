import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Minus, Plus, ShoppingCart, Sparkles, ChefHat, Check, X, Utensils, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import breakfastImg from "@/assets/menu-breakfast.jpg";
import lunchImg from "@/assets/menu-lunch.jpg";
import dinnerImg from "@/assets/menu-dinner.jpg";
import startersImg from "@/assets/menu-starters.jpg";
import specialImg from "@/assets/menu-special.jpg";

const orderSchema = z.object({
    tableNumber: z.string().min(1, { message: "Please enter your table number" }),
});

type OrderForm = z.infer<typeof orderSchema>;

type CustomizationType = "steak" | "pizza" | "burger" | "salad" | "breakfast_eggs" | "generic";

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: "Breakfast" | "Lunch" | "Dinner" | "Starters" | "Today's Special";
    image: string;
    popular?: boolean;
    customizationType?: CustomizationType;
}

interface CustomizationOptions {
    spiceLevel?: "Mild" | "Medium" | "Hot";
    cookingLevel?: "Rare" | "Medium Rare" | "Medium" | "Medium Well" | "Well Done";
    eggStyle?: "Scrambled" | "Fried" | "Poached" | "Boiled";
    dressing?: "Ranch" | "Vinaigrette" | "Caesar" | "None";
    noVeggies: boolean;
    extraCheese: boolean;
    notes: string;
}

interface CartItem {
    uniqueId: string;
    menuItemId: string;
    quantity: number;
    customizations: CustomizationOptions;
}

const menuItems: MenuItem[] = [
    // Breakfast
    { id: "b1", name: "Classic Eggs Benedict", description: "Poached eggs with hollandaise sauce on toasted muffin", price: 14.99, category: "Breakfast", image: breakfastImg, popular: true, customizationType: "breakfast_eggs" },
    { id: "b2", name: "Pancake Stack", description: "Fluffy pancakes with maple syrup and fresh berries", price: 12.99, category: "Breakfast", image: breakfastImg, customizationType: "generic" },
    { id: "b3", name: "French Toast", description: "Brioche French toast with cinnamon and berries", price: 13.99, category: "Breakfast", image: breakfastImg, customizationType: "generic" },
    { id: "b4", name: "Full English Breakfast", description: "Eggs, bacon, sausage, beans, mushrooms & toast", price: 16.99, category: "Breakfast", image: breakfastImg, customizationType: "breakfast_eggs" },

    // Lunch
    { id: "l1", name: "Grilled Chicken Sandwich", description: "With crispy fries, avocado and fresh salad", price: 15.99, category: "Lunch", image: lunchImg, popular: true, customizationType: "burger" },
    { id: "l2", name: "Caesar Salad", description: "Crisp romaine, parmesan, croutons with classic dressing", price: 12.99, category: "Lunch", image: lunchImg, customizationType: "salad" },
    { id: "l3", name: "Club Sandwich", description: "Triple-decker with turkey, bacon, lettuce and tomato", price: 14.99, category: "Lunch", image: lunchImg, customizationType: "burger" },
    { id: "l4", name: "Fish & Chips", description: "Beer-battered cod with tartar sauce and mushy peas", price: 17.99, category: "Lunch", image: lunchImg, customizationType: "generic" },

    // Dinner
    { id: "d1", name: "Ribeye Steak", description: "Premium aged beef with roasted vegetables", price: 42.99, category: "Dinner", image: dinnerImg, popular: true, customizationType: "steak" },
    { id: "d2", name: "Grilled Salmon", description: "Fresh Atlantic salmon with herbs and lemon butter", price: 28.99, category: "Dinner", image: dinnerImg, customizationType: "generic" },
    { id: "d3", name: "Truffle Pasta", description: "Handmade pasta with black truffle oil and parmesan", price: 24.99, category: "Dinner", image: dinnerImg, customizationType: "generic" },
    { id: "d4", name: "Lamb Chops", description: "Herb-crusted with mint sauce and mashed potatoes", price: 34.99, category: "Dinner", image: dinnerImg, customizationType: "steak" },

    // Starters
    { id: "s1", name: "Bruschetta", description: "Toasted bread with tomatoes, basil and balsamic glaze", price: 8.99, category: "Starters", image: startersImg, customizationType: "generic" },
    { id: "s2", name: "Spring Rolls", description: "Crispy vegetable spring rolls with sweet chili sauce", price: 7.99, category: "Starters", image: startersImg, customizationType: "generic" },
    { id: "s3", name: "Stuffed Mushrooms", description: "With garlic, herb and cream cheese filling", price: 9.99, category: "Starters", image: startersImg, customizationType: "generic" },
    { id: "s4", name: "Calamari", description: "Fried squid rings with lemon aioli", price: 11.99, category: "Starters", image: startersImg, popular: true, customizationType: "generic" },

    // Today's Special
    { id: "sp1", name: "Chef's Surf & Turf", description: "Premium ribeye with jumbo prawns and garlic butter", price: 54.99, category: "Today's Special", image: specialImg, popular: true, customizationType: "steak" },
    { id: "sp2", name: "Truffle Risotto", description: "Arborio rice with black truffle, wild mushrooms & parmesan", price: 32.99, category: "Today's Special", image: specialImg, customizationType: "generic" },
    { id: "sp3", name: "Pan-Seared Sea Bass", description: "Fresh catch with lemon butter sauce and asparagus", price: 38.99, category: "Today's Special", image: specialImg, customizationType: "generic" },
    { id: "sp4", name: "Wagyu Beef Wellington", description: "Premium wagyu wrapped in puff pastry with mushroom duxelles", price: 62.99, category: "Today's Special", image: specialImg, customizationType: "steak" },
];

const MenuSelection = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<"table" | "menu">("table");
    const [tableNumber, setTableNumber] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("Today's Special");
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Customization Dialog State
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [customizations, setCustomizations] = useState<CustomizationOptions>({
        spiceLevel: "Medium",
        cookingLevel: "Medium",
        eggStyle: "Scrambled",
        dressing: "Ranch",
        noVeggies: false,
        extraCheese: false,
        notes: ""
    });

    const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const form = useForm<OrderForm>({
        resolver: zodResolver(orderSchema),
    });

    const onTableSubmit = (data: OrderForm) => {
        setTableNumber(data.tableNumber);
        setStep("menu");
    };

    const handleItemClick = (item: MenuItem) => {
        setSelectedItem(item);
        // Reset customizations based on item type
        setCustomizations({
            spiceLevel: "Medium",
            cookingLevel: "Medium",
            eggStyle: "Scrambled",
            dressing: "Ranch",
            noVeggies: false,
            extraCheese: false,
            notes: ""
        });
    };

    const confirmAddToCart = () => {
        if (!selectedItem) return;

        const newItem: CartItem = {
            uniqueId: crypto.randomUUID(),
            menuItemId: selectedItem.id,
            quantity: 1,
            customizations: { ...customizations }
        };

        setCart(prev => [...prev, newItem]);
        setSelectedItem(null);
        toast({
            title: "Added to Order",
            description: `${selectedItem.name} added with your preferences.`,
        });
    };

    const updateQuantity = (uniqueId: string, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.uniqueId === uniqueId) {
                    return { ...item, quantity: Math.max(0, item.quantity + delta) };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const removeFromCart = (uniqueId: string) => {
        setCart(prev => prev.filter(item => item.uniqueId !== uniqueId));
    };

    const getCartTotal = () => {
        return cart.reduce((total, cartItem) => {
            const item = menuItems.find(i => i.id === cartItem.menuItemId);
            return total + (item?.price || 0) * cartItem.quantity;
        }, 0);
    };

    const getCartItemCount = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const submitOrder = () => {
        const orderSummary = cart.map(item => {
            const menuItem = menuItems.find(i => i.id === item.menuItemId);
            return `${item.quantity}x ${menuItem?.name}`;
        }).join(", ");

        toast({
            title: "Order Placed Successfully! 🎉",
            description: `Table ${tableNumber}: ${orderSummary}. Total: $${getCartTotal().toFixed(2)}`,
        });

        setStep("table");
        setCart([]);
        form.reset();
        setIsCartOpen(false);
        navigate("/");
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
        <div className="min-h-screen bg-background">
            {step === "table" ? (
                <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
                    {/* Background with blur and gradient */}
                    <div
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{ backgroundImage: `url(${dinnerImg})` }}
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />

                    <div className="absolute top-4 left-4 z-30">
                        <Button variant="ghost" className="text-white hover:bg-white/10 gap-2" onClick={() => navigate("/")}>
                            <ArrowLeft className="h-5 w-5" />
                            Back to Home
                        </Button>
                    </div>

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
                <div className="flex h-screen bg-zinc-950 overflow-hidden text-zinc-100">
                    {/* Sidebar Navigation (Desktop) */}
                    <div className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-white/10 h-full p-6 shrink-0">
                        <div className="flex items-center gap-3 mb-8 px-2 cursor-pointer" onClick={() => navigate("/")}>
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ChefHat className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-none text-white">Kings Kitchen</h3>
                                <p className="text-xs text-zinc-400 mt-1">Table {tableNumber}</p>
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
                                            : "hover:bg-white/5 text-zinc-400 hover:text-white"
                                    )}
                                >
                                    <span className="font-medium">{category}</span>
                                    {activeCategory === category && <ArrowRight className="h-4 w-4 animate-in fade-in slide-in-from-left-2" />}
                                </button>
                            ))}
                        </div>

                        <div className="mt-auto">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <p className="text-sm text-zinc-400 mb-2">Need assistance?</p>
                                <Button variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">Call Server</Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                        {/* Mobile Header */}
                        <div className="md:hidden flex items-center justify-between p-4 bg-zinc-900/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 shrink-0 h-[70px]">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary/10 rounded-lg">
                                    <ChefHat className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-bold text-lg text-white">Table {tableNumber}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white" onClick={() => navigate("/")}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Mobile Category Pills */}
                        <div className="md:hidden overflow-x-auto pb-3 pt-3 px-4 bg-zinc-900/95 backdrop-blur-md z-30 border-b border-white/10 scrollbar-hide shrink-0 sticky top-[70px]">
                            <div className="flex gap-2 min-w-max">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => scrollToCategory(category)}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border",
                                            activeCategory === category
                                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                : "bg-zinc-800 border-white/10 hover:bg-zinc-700 text-zinc-300"
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
                                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">{category}</h2>
                                            <span className="text-sm md:text-base text-zinc-400 bg-white/5 px-2 py-1 rounded-md">{menuItems.filter(i => i.category === category).length} items</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                            {menuItems
                                                .filter((item) => item.category === category)
                                                .map((item) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleItemClick(item)}
                                                        className="group bg-zinc-900 rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 flex flex-col cursor-pointer"
                                                    >
                                                        <div className="relative aspect-[4/3] overflow-hidden">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                                                            <div className="absolute top-3 right-3">
                                                                <span className="bg-black/60 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded-full shadow-lg text-xs md:text-sm border border-white/10">
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
                                                                <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-1 text-white group-hover:text-primary transition-colors">{item.name}</h3>
                                                                <p className="text-zinc-400 text-sm line-clamp-2 mb-4 h-10">{item.description}</p>
                                                            </div>

                                                            <div className="pt-2">
                                                                <Button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleItemClick(item);
                                                                    }}
                                                                    className="w-full h-11 rounded-xl gradient-primary hover:opacity-90 transition-all shadow-md group-hover:shadow-primary/25 font-semibold"
                                                                >
                                                                    Add to Order
                                                                </Button>
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
                                <div className="bg-white text-zinc-950 rounded-2xl p-4 shadow-2xl flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform ring-1 ring-black/10" onClick={() => setIsCartOpen(true)}>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center font-bold shadow-inner">
                                            {getCartItemCount()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">View Order</span>
                                            <span className="text-xs opacity-80">${getCartTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="bg-black/5 p-2 rounded-full">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cart Sidebar / Drawer */}
                    <div className={cn(
                        "fixed inset-y-0 right-0 w-full md:w-[400px] bg-zinc-900 shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 flex flex-col border-l border-white/10",
                        isCartOpen ? "translate-x-0" : "translate-x-full"
                    )}>
                        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                            <h2 className="text-xl md:text-2xl font-serif font-bold flex items-center gap-2 text-white">
                                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                                Your Order
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="rounded-full hover:bg-white/10 text-white">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 p-4 md:p-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 p-8">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Utensils className="h-10 w-10 opacity-50" />
                                    </div>
                                    <p className="text-lg font-medium mb-2 text-white">Your cart is empty</p>
                                    <p className="text-sm">Start adding some delicious items!</p>
                                    <Button variant="outline" className="mt-6 border-white/20 text-white hover:bg-white/10 hover:text-white" onClick={() => setIsCartOpen(false)}>
                                        Browse Menu
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4 md:space-y-6">
                                    {cart.map((cartItem) => {
                                        const item = menuItems.find(i => i.id === cartItem.menuItemId);
                                        if (!item) return null;
                                        return (
                                            <div key={cartItem.uniqueId} className="flex gap-3 md:gap-4 bg-black/20 p-2 rounded-xl border border-white/5">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg md:rounded-xl" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-sm md:text-base line-clamp-1 text-white">{item.name}</h4>
                                                        <span className="font-semibold text-sm md:text-base ml-2 text-white">${(item.price * cartItem.quantity).toFixed(2)}</span>
                                                    </div>

                                                    {/* Customizations Display */}
                                                    <div className="text-xs text-zinc-500 mb-2 space-y-0.5">
                                                        {item.customizationType === "steak" && cartItem.customizations.cookingLevel && <p>Cook: {cartItem.customizations.cookingLevel}</p>}
                                                        {item.customizationType === "breakfast_eggs" && cartItem.customizations.eggStyle && <p>Style: {cartItem.customizations.eggStyle}</p>}
                                                        {item.customizationType === "salad" && cartItem.customizations.dressing && <p>Dressing: {cartItem.customizations.dressing}</p>}
                                                        {cartItem.customizations.spiceLevel && <p>Spice: {cartItem.customizations.spiceLevel}</p>}
                                                        {cartItem.customizations.noVeggies && <p>• No Veggies</p>}
                                                        {cartItem.customizations.extraCheese && <p>• Extra Cheese</p>}
                                                        {cartItem.customizations.notes && <p className="italic">"{cartItem.customizations.notes}"</p>}
                                                    </div>

                                                    <div className="flex items-center gap-2 md:gap-3 bg-white/5 rounded-lg p-1 w-max">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => updateQuantity(cartItem.uniqueId, -1)}
                                                            className="h-6 w-6 rounded-md hover:bg-white/10 text-white hover:text-red-400 shrink-0"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="text-sm font-bold w-4 text-center text-white">{cartItem.quantity}</span>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => updateQuantity(cartItem.uniqueId, 1)}
                                                            className="h-6 w-6 rounded-md hover:bg-white/10 text-white hover:text-primary shrink-0"
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

                        <div className="p-4 md:p-6 bg-black/20 border-t border-white/10 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-zinc-400">
                                    <span>Subtotal</span>
                                    <span className="text-white">${getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-zinc-400">
                                    <span>Tax (10%)</span>
                                    <span className="text-white">${(getCartTotal() * 0.1).toFixed(2)}</span>
                                </div>
                                <Separator className="my-2 bg-white/10" />
                                <div className="flex justify-between text-xl font-bold text-white">
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

                    {/* Customization Dialog */}
                    <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                        <DialogContent className="bg-zinc-900 border-white/10 text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-serif">{selectedItem?.name}</DialogTitle>
                            </DialogHeader>

                            <div className="grid gap-6 py-4">
                                {/* Dynamic Customization Fields based on Type */}

                                {/* Steak Cooking Level */}
                                {selectedItem?.customizationType === "steak" && (
                                    <div className="space-y-3">
                                        <Label className="text-base font-semibold">Cooking Level</Label>
                                        <RadioGroup
                                            defaultValue="Medium"
                                            value={customizations.cookingLevel}
                                            onValueChange={(val) => setCustomizations(prev => ({ ...prev, cookingLevel: val as CustomizationOptions["cookingLevel"] }))}
                                            className="flex flex-wrap gap-3"
                                        >
                                            {["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"].map((level) => (
                                                <div key={level} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={level} id={level} className="border-white/20 text-primary" />
                                                    <Label htmlFor={level} className="font-normal cursor-pointer">{level}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        <Separator className="bg-white/10" />
                                    </div>
                                )}

                                {/* Egg Style */}
                                {selectedItem?.customizationType === "breakfast_eggs" && (
                                    <div className="space-y-3">
                                        <Label className="text-base font-semibold">Preparation Style</Label>
                                        <RadioGroup
                                            defaultValue="Scrambled"
                                            value={customizations.eggStyle}
                                            onValueChange={(val) => setCustomizations(prev => ({ ...prev, eggStyle: val as CustomizationOptions["eggStyle"] }))}
                                            className="flex flex-wrap gap-3"
                                        >
                                            {["Scrambled", "Fried", "Poached", "Boiled"].map((style) => (
                                                <div key={style} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={style} id={style} className="border-white/20 text-primary" />
                                                    <Label htmlFor={style} className="font-normal cursor-pointer">{style}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        <Separator className="bg-white/10" />
                                    </div>
                                )}

                                {/* Salad Dressing */}
                                {selectedItem?.customizationType === "salad" && (
                                    <div className="space-y-3">
                                        <Label className="text-base font-semibold">Dressing Choice</Label>
                                        <RadioGroup
                                            defaultValue="Ranch"
                                            value={customizations.dressing}
                                            onValueChange={(val) => setCustomizations(prev => ({ ...prev, dressing: val as CustomizationOptions["dressing"] }))}
                                            className="flex flex-wrap gap-3"
                                        >
                                            {["Ranch", "Vinaigrette", "Caesar", "None"].map((dressing) => (
                                                <div key={dressing} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={dressing} id={dressing} className="border-white/20 text-primary" />
                                                    <Label htmlFor={dressing} className="font-normal cursor-pointer">{dressing}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        <Separator className="bg-white/10" />
                                    </div>
                                )}

                                {/* Spice Level (Generic, Burger, Steak, etc) */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Spice Level</Label>
                                    <RadioGroup
                                        defaultValue="Medium"
                                        value={customizations.spiceLevel}
                                        onValueChange={(val) => setCustomizations(prev => ({ ...prev, spiceLevel: val as CustomizationOptions["spiceLevel"] }))}
                                        className="flex gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Mild" id="mild" className="border-white/20 text-primary" />
                                            <Label htmlFor="mild" className="font-normal cursor-pointer">Mild</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Medium" id="medium" className="border-white/20 text-primary" />
                                            <Label htmlFor="medium" className="font-normal cursor-pointer">Medium</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Hot" id="hot" className="border-white/20 text-primary" />
                                            <Label htmlFor="hot" className="font-normal cursor-pointer">Hot</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <Separator className="bg-white/10" />

                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Dietary Preferences</Label>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="noVeggies"
                                                checked={customizations.noVeggies}
                                                onCheckedChange={(checked) => setCustomizations(prev => ({ ...prev, noVeggies: checked as boolean }))}
                                                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                            />
                                            <Label htmlFor="noVeggies" className="font-normal cursor-pointer">Less / No Veggies</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="extraCheese"
                                                checked={customizations.extraCheese}
                                                onCheckedChange={(checked) => setCustomizations(prev => ({ ...prev, extraCheese: checked as boolean }))}
                                                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                            />
                                            <Label htmlFor="extraCheese" className="font-normal cursor-pointer">Extra Cheese</Label>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-white/10" />

                                <div className="space-y-3">
                                    <Label htmlFor="notes" className="text-base font-semibold">Special Instructions</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Any other requests? (e.g. sauce on side)"
                                        className="bg-black/20 border-white/10 min-h-[80px]"
                                        value={customizations.notes}
                                        onChange={(e) => setCustomizations(prev => ({ ...prev, notes: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="outline" onClick={() => setSelectedItem(null)} className="border-white/10 hover:bg-white/10 hover:text-white">
                                    Cancel
                                </Button>
                                <Button onClick={confirmAddToCart} className="gradient-primary">
                                    Add to Order - ${selectedItem?.price.toFixed(2)}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
};

export default MenuSelection;
