import { useParams } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import ProductGrid from "../components/ProductGrid";

export default function CategoryPage() {
  const { category } = useParams();
  const categoryProducts = products.filter((p) => p.category === category);

  const label = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Collection";

  return (
    <div className="pt-20 lg:pt-24">
      <div className="relative h-40 sm:h-56 overflow-hidden" style={{ backgroundColor: "#064E3B" }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-xs tracking-[0.35em] mb-2" style={{ color: "#D79B01" }}>DIKSHI JEWELLERY</p>
          <h1
            className="text-3xl sm:text-4xl font-semibold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FCF1D0" }}
          >
            {label}
          </h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-sm text-gray-500 mb-8">{categoryProducts.length} items in {label}</p>
        <ProductGrid products={categoryProducts} emptyMessage={`No ${label} found.`} />
      </div>
    </div>
  );
}
