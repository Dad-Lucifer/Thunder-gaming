import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 pt-16 pb-8 border-t border-white/5 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-[80px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">Kings Kitchen</h3>
            </div>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Where elegance meets family tradition. Creating memorable dining experiences with passion and precision since 2008.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Facebook className="w-5 h-5" />} href="#" />
              <SocialLink icon={<Instagram className="w-5 h-5" />} href="#" />
              <SocialLink icon={<Twitter className="w-5 h-5" />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="text-lg font-bold text-white mb-6">Explore</h4>
            <ul className="space-y-4">
              <FooterLink href="#home">Home</FooterLink>
              <FooterLink href="#about">About Us</FooterLink>
              <FooterLink href="#menu">Our Menu</FooterLink>
              <FooterLink href="#gallery">Gallery</FooterLink>
              <FooterLink href="#contact">Reservations</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Visit Us</h4>
            <ul className="space-y-4 text-zinc-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">123 Gourmet Avenue<br />Downtown District<br />City, State 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+15551234567" className="text-sm hover:text-white transition-colors">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:info@kingskitchen.com" className="text-sm hover:text-white transition-colors">info@kingskitchen.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Stay Updated</h4>
            <p className="text-zinc-400 mb-4 text-sm">Subscribe to our newsletter for new menu items and exclusive offers.</p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Input
                  placeholder="Your email address"
                  className="bg-white/5 border-white/10 focus:border-primary text-white h-12 pr-12 rounded-xl text-sm placeholder:text-zinc-600"
                />
                <Button
                  size="icon"
                  type="submit"
                  className="absolute right-1 top-1 h-10 w-10 bg-primary text-black hover:bg-primary/90 rounded-lg"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} Kings Kitchen. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300 transform hover:-translate-y-1"
  >
    {icon}
  </a>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a
      href={href}
      className="text-zinc-400 text-sm hover:text-primary transition-all duration-300 flex items-center gap-2 group"
    >
      <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-4" />
      {children}
    </a>
  </li>
);

export default Footer;
