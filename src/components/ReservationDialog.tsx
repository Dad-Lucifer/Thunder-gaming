import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, Check, ChevronRight, ChevronLeft, PartyPopper, Utensils, Sparkles, MapPin, Phone, User, CalendarDays, ChefHat } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

const reservationSchema = z.object({
  date: z.date({ required_error: "Please select a date" }),
  time: z.string({ required_error: "Please select a time" }),
  guests: z.number().min(1).max(12),
  occasion: z.string().optional(),
  table: z.string({ required_error: "Please select a table" }),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

type ReservationForm = z.infer<typeof reservationSchema>;

const timeSlots = [
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30"
];

const occasions = [
  { id: "casual", label: "Casual Dining", icon: "🍽️" },
  { id: "birthday", label: "Birthday", icon: "🎂" },
  { id: "anniversary", label: "Anniversary", icon: "💑" },
  { id: "date", label: "Date Night", icon: "🌹" },
  { id: "business", label: "Business Meal", icon: "💼" },
];

const tables = [
  { id: "1", name: "Window Seat", capacity: 2, type: "romantic", status: "available" },
  { id: "2", name: "Cozy Corner", capacity: 2, type: "quiet", status: "available" },
  { id: "3", name: "Family Booth", capacity: 4, type: "family", status: "reserved" },
  { id: "4", name: "Center Stage", capacity: 4, type: "lively", status: "available" },
  { id: "5", name: "Chef's Table", capacity: 6, type: "premium", status: "available" },
  { id: "6", name: "Garden View", capacity: 6, type: "scenic", status: "available" },
  { id: "7", name: "The Royal", capacity: 8, type: "luxury", status: "available" },
  { id: "8", name: "Banquet", capacity: 10, type: "group", status: "available" },
];

interface ReservationDialogProps {
  trigger?: React.ReactNode;
}

export const ReservationDialog = ({ trigger }: ReservationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const form = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guests: 2,
      occasion: "casual",
      name: "",
      phone: ""
    }
  });

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(["date", "time", "guests"]);
    } else if (step === 2) {
      isValid = await form.trigger(["occasion"]);
    } else if (step === 3) {
      isValid = await form.trigger(["table"]);
    } else if (step === 4) {
      isValid = await form.trigger(["name", "phone"]);
    }

    if (isValid) {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const onSubmit = (data: ReservationForm) => {
    const selectedTable = tables.find(t => t.id === data.table);
    toast({
      title: "Reservation Confirmed! 🥂",
      description: `Thanks ${data.name}, we've saved ${selectedTable?.name} for you on ${format(data.date, "MMM do")} at ${data.time}.`,
    });
    setOpen(false);
    setTimeout(() => {
      setStep(1);
      form.reset();
    }, 500);
  };

  const watchedDate = form.watch("date");
  const watchedTime = form.watch("time");
  const watchedGuests = form.watch("guests");
  const watchedOccasion = form.watch("occasion");
  const watchedTable = form.watch("table");
  const watchedName = form.watch("name");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="gradient-primary shadow-lg hover:shadow-primary/25 transition-all duration-300">
            Reserve a Table
          </Button>
        )}
      </DialogTrigger>
      {/* Optimized Content Container: h-[100dvh] on mobile for full screen */}
      <DialogContent className="max-w-2xl p-0 gap-0 bg-zinc-950 border-zinc-800 text-zinc-100 overflow-hidden sm:rounded-3xl h-[100dvh] sm:h-auto sm:max-h-[95vh] flex flex-col">
        <div className="flex md:h-[600px] h-full flex-col md:flex-row">

          {/* Mobile Progress Bar & Header (Visible only on small screens) */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-zinc-900/80 backdrop-blur-sm z-20">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              <span className="font-serif font-bold text-sm">Step {step}/4</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={cn("h-1.5 w-6 rounded-full transition-all duration-300", i <= step ? "bg-primary" : "bg-zinc-800")} />
              ))}
            </div>
          </div>

          {/* Left Sidebar - Summary & Progress (Desktop Only) */}
          <div className="hidden md:flex w-1/3 bg-zinc-900/50 border-r border-white/5 flex-col p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Utensils className="h-5 w-5 text-primary" />
                </div>
                <span className="font-serif font-bold text-lg">Kings Kitchen</span>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Your Reservation</h3>
                  <div className="space-y-4">
                    <div className={cn("flex items-center gap-3 transition-all duration-300", step >= 1 ? "opacity-100 translate-x-0" : "opacity-30 -translate-x-4")}>
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors", step > 1 ? "bg-primary border-primary text-black" : "border-zinc-700 bg-zinc-800")}>
                        {step > 1 ? <Check className="h-4 w-4" /> : "1"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Date & Time</p>
                        {watchedDate && watchedTime && (
                          <p className="text-xs text-primary">{format(watchedDate, "MMM do")} • {watchedTime}</p>
                        )}
                      </div>
                    </div>

                    <div className={cn("flex items-center gap-3 transition-all duration-300 delay-75", step >= 2 ? "opacity-100 translate-x-0" : "opacity-30 -translate-x-4")}>
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors", step > 2 ? "bg-primary border-primary text-black" : "border-zinc-700 bg-zinc-800")}>
                        {step > 2 ? <Check className="h-4 w-4" /> : "2"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Details</p>
                        {watchedGuests && (
                          <p className="text-xs text-primary">{watchedGuests} Guests • {occasions.find(o => o.id === watchedOccasion)?.label}</p>
                        )}
                      </div>
                    </div>

                    <div className={cn("flex items-center gap-3 transition-all duration-300 delay-150", step >= 3 ? "opacity-100 translate-x-0" : "opacity-30 -translate-x-4")}>
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors", step > 3 ? "bg-primary border-primary text-black" : "border-zinc-700 bg-zinc-800")}>
                        {step > 3 ? <Check className="h-4 w-4" /> : "3"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Table</p>
                        {watchedTable && (
                          <p className="text-xs text-primary">{tables.find(t => t.id === watchedTable)?.name}</p>
                        )}
                      </div>
                    </div>

                    <div className={cn("flex items-center gap-3 transition-all duration-300 delay-200", step >= 4 ? "opacity-100 translate-x-0" : "opacity-30 -translate-x-4")}>
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors", step > 4 ? "bg-primary border-primary text-black" : "border-zinc-700 bg-zinc-800")}>
                        {step > 4 ? <Check className="h-4 w-4" /> : "4"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Contact</p>
                        {watchedName && (
                          <p className="text-xs text-primary">{watchedName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto relative z-10">
              <div className="bg-zinc-900 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs font-bold text-yellow-500">High Demand</span>
                </div>
                <p className="text-xs text-zinc-400">Tables are filling up fast for this evening. Complete your booking soon!</p>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col bg-zinc-950 relative md:rounded-r-3xl h-full overflow-hidden">
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">

                  {/* Step 1: Date & Time */}
                  {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                      <div className="mb-4 md:mb-6">
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">When would you like to dine?</h2>
                        <p className="text-sm md:text-base text-zinc-400">Select a date and time for your visit.</p>
                      </div>

                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal h-12 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date() || date > addDays(new Date(), 30)
                                  }
                                  initialFocus
                                  className="bg-zinc-900 text-white"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                              {timeSlots.map((time) => (
                                <Button
                                  key={time}
                                  type="button"
                                  variant={field.value === time ? "default" : "outline"}
                                  className={cn(
                                    "h-10 border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all text-xs sm:text-sm",
                                    field.value === time && "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                                  )}
                                  onClick={() => field.onChange(time)}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: Guests & Occasion */}
                  {step === 2 && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                      <div className="mb-4 md:mb-6">
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">Who's joining us?</h2>
                        <p className="text-sm md:text-base text-zinc-400">Tell us about your party and the occasion.</p>
                      </div>

                      <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center mb-4">
                              <FormLabel className="text-base">Party Size</FormLabel>
                              <span className="text-2xl font-bold text-primary">{field.value} <span className="text-sm font-normal text-zinc-400">Guests</span></span>
                            </div>
                            <FormControl>
                              <div className="px-2 py-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                <Slider
                                  min={1}
                                  max={12}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(vals) => field.onChange(vals[0])}
                                  className="cursor-pointer"
                                />
                                <div className="flex justify-between mt-2 text-xs text-zinc-500 px-1">
                                  <span>1</span>
                                  <span>6</span>
                                  <span>12</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="occasion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Occasion</FormLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                              {occasions.map((occ) => (
                                <div
                                  key={occ.id}
                                  onClick={() => field.onChange(occ.id)}
                                  className={cn(
                                    "cursor-pointer p-3 md:p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 hover:bg-zinc-900",
                                    field.value === occ.id
                                      ? "bg-primary/10 border-primary ring-1 ring-primary/50"
                                      : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700"
                                  )}
                                >
                                  <span className="text-2xl">{occ.icon}</span>
                                  <span className={cn("font-medium", field.value === occ.id ? "text-primary" : "text-zinc-300")}>{occ.label}</span>
                                  {field.value === occ.id && <Check className="ml-auto h-4 w-4 text-primary" />}
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 3: Table Selection */}
                  {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                      <div className="shrink-0 mb-2">
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">Choose your spot</h2>
                        <p className="text-sm md:text-base text-zinc-400">Select an available table for your party.</p>
                      </div>

                      <FormField
                        control={form.control}
                        name="table"
                        render={({ field }) => (
                          <FormItem className="flex-1 min-h-0">
                            <ScrollArea className="h-[300px] md:h-[340px] pr-2 md:pr-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pb-4">
                                {tables.map((table) => {
                                  // Simplified logic: any table can seat 1 person, but we should match capacity if possible
                                  // For realism, table capacity should be >= guests
                                  const isCapacitySuitable = table.capacity >= watchedGuests;

                                  // Allow selecting larger tables, but maybe not massive ones for 2 people? 
                                  // For now, let's keep it simple: can fit? yes.
                                  const isSuitable = isCapacitySuitable;
                                  const isSelected = field.value === table.id;
                                  const isAvailable = table.status === "available";

                                  return (
                                    <div
                                      key={table.id}
                                      onClick={() => isSuitable && isAvailable && field.onChange(table.id)}
                                      className={cn(
                                        "relative p-3 md:p-4 rounded-xl border transition-all duration-300 flex flex-col gap-2 md:gap-3 group",
                                        isSelected
                                          ? "bg-primary/10 border-primary ring-1 ring-primary shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                                          : "bg-zinc-900 border-zinc-800",
                                        !isSuitable || !isAvailable
                                          ? "opacity-50 cursor-not-allowed grayscale bg-zinc-950/50"
                                          : "cursor-pointer hover:border-primary/50 hover:bg-zinc-800 hover:-translate-y-1"
                                      )}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div className="p-1.5 md:p-2 bg-zinc-950 rounded-lg border border-white/5">
                                          <Users className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        {table.status === "reserved" ? (
                                          <Badge variant="secondary" className="bg-zinc-800 text-zinc-500 text-[10px] md:text-xs">Reserved</Badge>
                                        ) : isSelected ? (
                                          <Badge className="bg-primary text-black hover:bg-primary text-[10px] md:text-xs">Selected</Badge>
                                        ) : !isSuitable ? (
                                          <Badge variant="outline" className="border-red-900/50 text-red-700 text-[10px] md:text-xs">Small</Badge>
                                        ) : (
                                          <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-[10px] md:text-xs">Available</Badge>
                                        )}
                                      </div>

                                      <div>
                                        <h4 className={cn("font-bold text-base md:text-lg", isSelected ? "text-primary" : "text-white")}>{table.name}</h4>
                                        <p className="text-xs text-zinc-400 capitalize">{table.type} • Seats {table.capacity}</p>
                                      </div>

                                      {isSelected && (
                                        <div className="absolute inset-0 border-2 border-primary rounded-xl animate-pulse opacity-20" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 4: Contact Details */}
                  {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                      <div className="mb-4 md:mb-6">
                        <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">Final Details</h2>
                        <p className="text-sm md:text-base text-zinc-400">Enter your contact information to confirm.</p>
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                  <Input
                                    placeholder="John Doe"
                                    {...field}
                                    className="pl-10 h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                  <Input
                                    placeholder="1234567890"
                                    {...field}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                      field.onChange(value);
                                    }}
                                    type="tel"
                                    className="pl-10 h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-1 focus:ring-primary"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage>
                                {form.formState.errors.phone?.message}
                              </FormMessage>
                              <p className="text-xs text-zinc-500 pt-1">Enter exactly 10 digits.</p>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 mt-6">
                        <h4 className="text-sm font-semibold text-white mb-2">Reservation Summary</h4>
                        <div className="space-y-1 text-sm text-zinc-400">
                          <p>• {format(watchedDate || new Date(), "PPP")} at {watchedTime}</p>
                          <p>• {watchedGuests} Guests ({occasions.find(o => o.id === watchedOccasion)?.label})</p>
                          <p>• {tables.find(t => t.id === watchedTable)?.name}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-auto pt-4 md:pt-6 flex items-center justify-between border-t border-white/5 bg-zinc-950 z-10">
                    {step > 1 ? (
                      <Button type="button" variant="ghost" onClick={prevStep} className="text-zinc-400 hover:text-white hover:bg-white/5">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                    ) : (
                      <div /> /* Spacer */
                    )}

                    {step < 4 ? (
                      <Button type="button" onClick={nextStep} className="gradient-primary px-6 md:px-8">
                        Next Step <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" className="gradient-primary px-6 md:px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                        Confirm <span className="hidden sm:inline ml-1">Booking</span> <PartyPopper className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
