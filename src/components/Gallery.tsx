import dish1 from "@/assets/dish-1.jpg";
import dish2 from "@/assets/dish-2.jpg";
import dish3 from "@/assets/dish-3.jpg";

const Gallery = () => {
  const dishes = [
    {
      image: dish1,
      title: "Signature Pasta",
      description: "Fresh handmade pasta with seasonal ingredients",
    },
    {
      image: dish2,
      title: "Grilled Salmon",
      description: "Atlantic salmon with herb butter and vegetables",
    },
    {
      image: dish3,
      title: "Decadent Desserts",
      description: "Artisan desserts crafted by our pastry chef",
    },
  ];

  return (
    <section id="gallery" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Culinary Masterpieces
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A glimpse into the artistry and passion behind every dish we serve.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {dishes.map((dish, index) => (
            <div
              key={index}
              className="group cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-lg elegant-shadow">
                <img
                  src={dish.image}
                  alt={dish.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-smooth duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {dish.title}
                    </h3>
                    <p className="text-muted-foreground">{dish.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
