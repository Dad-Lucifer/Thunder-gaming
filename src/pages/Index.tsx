import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import MenuOptions from "@/components/MenuOptions";
import TableOrdering from "@/components/TableOrdering";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground scroll-smooth">
      <Navigation />

      <main>
        {/* Hero Section - Includes ID internally or is top of page */}
        <div id="home">
          <Hero />
        </div>

        <section id="about" className="relative">
          <About />
        </section>

        <section id="menu" className="relative">
          <MenuOptions />
        </section>

        {/* Table Ordering contains its own Dialog Trigger, it's not a scroll section itself but part of the flow */}
        <div className="hidden">
          {/* This component is likely just the dialog wrapper or button, sticking it here to ensure it's rendered */}
          <TableOrdering />
        </div>

        <section id="gallery" className="relative">
          <Gallery />
        </section>

        <section id="contact" className="relative">
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
