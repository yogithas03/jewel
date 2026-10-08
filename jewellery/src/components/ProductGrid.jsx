import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "./Loading";

export default function ProductGrid({ products, loading, emptyMessage = "No products found." }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">✦</div>
        <h3
          className="text-xl font-semibold mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
        >
          {emptyMessage}
        </h3>
        <p className="text-sm text-gray-500">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
