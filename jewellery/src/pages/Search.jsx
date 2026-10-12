import { useSearchParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { products } from "../data/products";
import ProductGrid from "../components/ProductGrid";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.metal.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="pt-20 lg:pt-24">
      <div className="py-10 px-4 text-center" style={{ backgroundColor: "#064E3B" }}>
        <p className="text-xs tracking-widest mb-2" style={{ color: "#E8C96C" }}>SEARCH RESULTS</p>
        <h1
          className="text-3xl sm:text-4xl font-semibold"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F2DEAA" }}
        >
          "{query}"
        </h1>
        <p className="text-sm mt-3" style={{ color: "rgba(242, 222, 170,0.65)" }}>
          {results.length} result{results.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {query.trim() === "" ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Enter a search term to find jewellery.</p>
          </div>
        ) : (
          <ProductGrid
            products={results}
            emptyMessage={`No results for "${query}"`}
          />
        )}

        {results.length === 0 && query.trim() && (
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-6">Try browsing our collections:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {["Gold", "Diamond", "Silver", "Platinum", "Rings", "Necklaces", "Earrings"].map((cat) => (
                <Link
                  key={cat}
                  to={`/shop/${cat.toLowerCase()}`}
                  className="px-5 py-2 rounded-full text-sm border transition-all hover:bg-[#064E3B] hover:text-[#F2DEAA] hover:border-[#064E3B]"
                  style={{ borderColor: "#e5e7eb", color: "#064E3B" }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
