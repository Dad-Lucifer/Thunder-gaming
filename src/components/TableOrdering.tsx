import { TableOrderingDialog } from "./TableOrderingDialog";
import { UtensilsCrossed } from "lucide-react";

const TableOrdering = () => {
  return (
    <section id="order" className="py-20 px-4 bg-card">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="flex justify-center mb-6">
          <UtensilsCrossed className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Order from Your Table
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Already seated? Browse our menu and place your order directly from your table. 
          Quick, easy, and convenient.
        </p>
        <TableOrderingDialog />
      </div>
    </section>
  );
};

export default TableOrdering;
