import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { products } from "../data/products";
import ProductGrid from "../components/ProductGrid";
import FilterPanel from "../components/FilterPanel";
import bangelBanner from "../assets/bangelbanner.png";
import braceletBanner from "../assets/braclet_coll.jfif";
import earringsBanner from "../assets/earrings-banner.png";
import necklaceBanner from "../assets/necklace-banner.png";

const categoryBanners = {
  bangles: bangelBanner,
  bracelets: braceletBanner,
  earrings: earringsBanner,
  necklaces: necklaceBanner,
};

const defaultFilters = {
  purity: "All",
  minPrice: "",
  maxPrice: "",
  occasion: "All",
  gender: "All",
  for: "All",
  sort: "popular",
};

export default function CategoryPage() {
  const { category } = useParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const label = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Collection";
  const bannerImage = category ? categoryBanners[category.toLowerCase()] : null;

  const categoryProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = p.category?.toLowerCase() === category?.toLowerCase();
      if (!matchCat) return false;
      if (category?.toLowerCase() === "earrings") {
        return !p.isDiamond;
      }
      if (category?.toLowerCase() === "pendants") {
        return !p.isDiamond;
      }
      if (category?.toLowerCase() === "bracelets") {
        return p.metal === "gold" && !p.isDiamond;
      }
      return true;
    });
  }, [category]);

  const filtered = useMemo(() => {
    let list = [...categoryProducts];

    // Purity: All means no restriction
    if (filters.purity && filters.purity !== "All") {
      const targetPurity = filters.purity.toLowerCase();
      list = list.filter((p) => String(p.purity || "").toLowerCase() === targetPurity);
    }

    // Occasion: All means no restriction
    if (filters.occasion && filters.occasion !== "All") {
      const targetOccasion = filters.occasion.toLowerCase();
      list = list.filter((p) => {
        const occList = [
          ...(Array.isArray(p.occasion) ? p.occasion : [p.occasion]),
          ...(Array.isArray(p.occasions) ? p.occasions : [p.occasions]),
        ].filter(Boolean).map((o) => String(o).toLowerCase());
        return occList.includes(targetOccasion);
      });
    }

    // For / Target Customer: All means no restriction
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
        ].filter(Boolean).map((v) => String(v).toLowerCase());
        return forList.includes(targetFor);
      });
    }

    // Price range
    if (filters.minPrice !== "" && filters.minPrice !== null && !isNaN(Number(filters.minPrice))) {
      list = list.filter((p) => Number(p.price) >= Number(filters.minPrice));
    }
    if (filters.maxPrice !== "" && filters.maxPrice !== null && !isNaN(Number(filters.maxPrice))) {
      list = list.filter((p) => Number(p.price) <= Number(filters.maxPrice));
    }

    // Sort
    switch (filters.sort) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "new":
        list.sort((a, b) => (b.isNew || b.badge === "New" ? 1 : 0) - (a.isNew || a.badge === "New" ? 1 : 0));
        break;
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
      default:
        list.sort((a, b) => {
          const scoreB = (b.isBestSeller || b.badge === "Bestseller" ? 10 : 0) + (b.reviews || 0) * 0.01;
          const scoreA = (a.isBestSeller || a.badge === "Bestseller" ? 10 : 0) + (a.reviews || 0) * 0.01;
          return scoreB - scoreA;
        });
    }

    return list;
  }, [categoryProducts, filters]);

  return (
    <div className="pt-20 lg:pt-24">
      <div
        className="relative h-48 overflow-hidden sm:h-64"
        style={{ backgroundColor: "#064E3B" }}
      >
        {bannerImage && (
          <>
            <img
              src={bannerImage}
              alt={`${label} banner`}
              className="absolute inset-0 h-full w-full object-cover object-center"
              style={{ filter: "brightness(0.55) saturate(1.15)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(6,78,59,0.85) 0%, rgba(6,78,59,0.4) 60%, rgba(6,78,59,0.2) 100%)",
              }}
            />
          </>
        )}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <p className="text-xs tracking-[0.35em] mb-2" style={{ color: "#D79B01" }}>DIKSHI JEWELLERY</p>
          <h1
            className="text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F2DEAA" }}
          >
            {label}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-[#064E3B]">{filtered.length}</span> of{" "}
            {categoryProducts.length} items in {label}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-[#064E3B]"
            >
              <span>Filters</span>
              <span className="text-xs">{filtersOpen ? "▲" : "▼"}</span>
            </button>

            <select
              value={filters.sort}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
              aria-label="Sort products"
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none bg-white text-[#064E3B]"
            >
              <option value="popular">Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="new">New Arrivals</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {filtersOpen && (
          <div className="lg:hidden mb-6">
            <FilterPanel filters={filters} setFilters={setFilters} metal="gold" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block">
            <FilterPanel filters={filters} setFilters={setFilters} metal="gold" />
          </div>
          <div className="lg:col-span-3">
            <ProductGrid
              products={filtered}
              emptyMessage={`No ${label.toLowerCase()} match your selected filters.`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
