import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().regex(/^\d{10}$/, {
    message: "Phone number must be exactly 10 digits.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const Contact = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    console.log(values);
    form.reset();
  }

  return (
    <section id="contact" className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 lg:mb-20 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4 md:mb-6">
            Get in Touch
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We'd love to hear from you. Whether it's a reservation request or general feedback, we're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-7xl mx-auto items-start">
          {/* Contact Information */}
          <div className="space-y-8 md:space-y-10 animate-fade-in order-2 lg:order-1">
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-inner ring-1 ring-primary/20">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">Location</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    123 Gourmet Avenue<br />
                    Downtown District<br />
                    City, State 12345
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-inner ring-1 ring-primary/20">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">Phone</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    <a href="tel:+15551234567" className="hover:text-primary transition-colors block py-0.5">+1 (555) 123-4567</a>
                    <a href="tel:+15559876543" className="hover:text-primary transition-colors block py-0.5">+1 (555) 987-6543</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-inner ring-1 ring-primary/20">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">Email</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    <a href="mailto:info@kingskitchen.com" className="hover:text-primary transition-colors block py-0.5">info@kingskitchen.com</a>
                    <a href="mailto:events@kingskitchen.com" className="hover:text-primary transition-colors block py-0.5">events@kingskitchen.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-inner ring-1 ring-primary/20">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">Hours</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    <span className="block mb-1"><span className="font-semibold text-foreground/80">Mon-Thu:</span> 11:00 AM - 10:00 PM</span>
                    <span className="block mb-1"><span className="font-semibold text-foreground/80">Fri-Sat:</span> 11:00 AM - 11:00 PM</span>
                    <span className="block"><span className="font-semibold text-foreground/80">Sun:</span> 10:00 AM - 9:00 PM</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in order-1 lg:order-2">
            <div className="bg-card/30 backdrop-blur-sm p-6 md:p-8 lg:p-10 rounded-3xl border border-white/5 shadow-2xl">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Send us a Message</h3>
                <p className="text-sm text-muted-foreground">Fill out the form below and we'll get back to you shortly.</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              className="w-full h-12 md:h-14 px-4 bg-background/50 border-white/10 focus:border-primary/50 text-base rounded-xl transition-all hover:bg-background/80"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your Email"
                              className="w-full h-12 md:h-14 px-4 bg-background/50 border-white/10 focus:border-primary/50 text-base rounded-xl transition-all hover:bg-background/80"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Phone Number (10 digits)"
                            className="w-full h-12 md:h-14 px-4 bg-background/50 border-white/10 focus:border-primary/50 text-base rounded-xl transition-all hover:bg-background/80"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="How can we help you?"
                            className="w-full min-h-[160px] p-4 bg-background/50 border-white/10 focus:border-primary/50 text-base rounded-xl resize-none transition-all hover:bg-background/80"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button type="submit" className="w-full h-12 md:h-14 text-base md:text-lg font-semibold gradient-primary rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300">
                      Send Message <Send className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
