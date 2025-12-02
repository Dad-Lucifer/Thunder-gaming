import restaurantInterior from "@/assets/restaurant-interior.jpg";

const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              A Legacy of Excellence
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At Kings Kitchen, we believe that exceptional dining is about more than just food—it's about creating lasting memories with the people you love. Our restaurant combines timeless elegance with a warm, family-friendly atmosphere.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Every dish is crafted with passion and precision, using only the finest locally-sourced ingredients. Our expert chefs blend traditional techniques with contemporary innovation to deliver an unforgettable culinary experience.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">200+</div>
                <div className="text-sm text-muted-foreground">Signature Dishes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Guests</div>
              </div>
            </div>
          </div>
          <div className="animate-scale-in">
            <img
              src={restaurantInterior}
              alt="Elegant interior of Kings Kitchen restaurant"
              className="w-full h-[600px] object-cover rounded-lg elegant-shadow"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
