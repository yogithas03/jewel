import { useState, useMemo } from "react";
import { products as allProducts } from "../data/products";
import FilterPanel from "./FilterPanel";
import ProductGrid from "./ProductGrid";

const defaultFilters = {
  purity: "All",
  minPrice: "",
  maxPrice: "",
  occasion: "All",
  gender: "All",
  for: "All",
  sort: "popular",
  category: "All",
};

export default function ShopPage({ metal, title, subtitle, heroImage, categoryOptions = [] }) {
  const [filters, setFilters] = useState(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list =
      metal === "all"
        ? allProducts
        : metal === "diamond"
        ? allProducts.filter((p) => p.isDiamond)
        : allProducts.filter((p) => p.metal === metal && !p.isDiamond);

    if (filters.purity && filters.purity !== "All") {
      const targetPurity = filters.purity.toLowerCase();
      list = list.filter((p) => {
        const pPurity = String(p.purity || "").toLowerCase();
        return pPurity === targetPurity || pPurity.includes(targetPurity);
      });
    }

    if (filters.occasion && filters.occasion !== "All") {
      const targetOccasion = filters.occasion.toLowerCase();
      list = list.filter((p) => {
        const occList = [
          ...(Array.isArray(p.occasion) ? p.occasion : [p.occasion]),
          ...(Array.isArray(p.occasions) ? p.occasions : [p.occasions]),
        ].filter(Boolean).flatMap((o) => String(o).split(",").map((s) => s.trim().toLowerCase()));
        return occList.includes(targetOccasion);
      });
    }

    const activeFor = (filters.for && filters.for !== "All")
      ? filters.for
      : (filters.gender && filters.gender !== "All")
      ? filters.gender
      : "All";

    if (activeFor !== "All") {
      const targetFor = activeFor.toLowerCase();
      list = list.filter((p) => {
        const forList = [
          ...(Array.isArray(p.for) ? p.for : [p.for]),
          ...(Array.isArray(p.gender) ? p.gender : [p.gender]),
        ].filter(Boolean).flatMap((v) => String(v).split(",").map((s) => s.trim().toLowerCase()));
        return forList.includes(targetFor);
      });
    }

    if (filters.category && filters.category !== "All") {
      const target = filters.category.toLowerCase();
      list = list.filter((p) => p.category?.toLowerCase() === target);
    }

    if (filters.minPrice !== "" && filters.minPrice !== null && !isNaN(Number(filters.minPrice))) {
      list = list.filter((p) => Number(p.price) >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== "" && filters.maxPrice !== null && !isNaN(Number(filters.maxPrice))) {
      list = list.filter((p) => Number(p.price) <= Number(filters.maxPrice));
    }

    switch (filters.sort) {
      case "price_asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price_desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "new": list = [...list].sort((a, b) => (b.isNew || b.badge === "New" ? 1 : 0) - (a.isNew || a.badge === "New" ? 1 : 0)); break;
      case "rating": list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case "popular":
      default: list = [...list].sort((a, b) => {
        const scoreB = (b.isBestSeller || b.badge === "Bestseller" ? 10 : 0) + (b.reviews || 0) * 0.01;
        const scoreA = (a.isBestSeller || a.badge === "Bestseller" ? 10 : 0) + (a.reviews || 0) * 0.01;
        return scoreB - scoreA;
      });
    }

    return list;
  }, [metal, filters]);

  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero banner */}
      <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden" style={{ backgroundColor: "#064E3B" }}>
        {heroImage && (
          <img src={heroImage} alt={title} className="w-full h-full object-cover opacity-25" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-xs tracking-[0.35em] mb-3" style={{ color: "#D79B01" }}>DIKSHI JEWELLERY</p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F2DEAA" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-sm max-w-md" style={{ color: "rgba(242, 222, 170,0.70)" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Category tabs */}
        {categoryOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setFilters((f) => ({ ...f, category: "All" }))}
              className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
              style={
                filters.category === "All"
                  ? { backgroundColor: "#064E3B", color: "#F2DEAA", borderColor: "#064E3B" }
                  : { backgroundColor: "white", color: "#064E3B", borderColor: "#e5e7eb" }
              }
            >
              All
            </button>
            {categoryOptions.map((c) => (
              <button
                key={c}
                onClick={() => setFilters((f) => ({ ...f, category: c }))}
                className="px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize"
                style={
                  filters.category === c
                    ? { backgroundColor: "#064E3B", color: "#F2DEAA", borderColor: "#064E3B" }
                    : { backgroundColor: "white", color: "#064E3B", borderColor: "#e5e7eb" }
                }
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <p className="text-sm text-gray-500">{filtered.length} products</p>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all"
            style={{ borderColor: "#064E3B", color: "#064E3B" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters & Sort
          </button>
        </div>

        {/* Mobile filter drawer */}
        {filtersOpen && (
          <div className="lg:hidden mb-6">
            <FilterPanel filters={filters} setFilters={setFilters} metal={metal} />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop filter sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28">
              <FilterPanel filters={filters} setFilters={setFilters} metal={metal} />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">{filtered.length} products</p>
              <select
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                className="hidden lg:block px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none bg-white"
                style={{ color: "#064E3B" }}
              >
                <option value="popular">Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="new">New Arrivals</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            <ProductGrid products={filtered} />
          </div>
        </div>
      </div>
    </div>
  );
}
