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
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <MenuOptions />
      <TableOrdering />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
