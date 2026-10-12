export default function FilterPanel({ filters, setFilters, metal }) {
  const purityOptions = {
    gold: ["All", "24K", "22K", "18K"],
    silver: ["All", "925", "999"],
    platinum: ["All", "950", "900"],
    diamond: ["All", "18K", "14K"],
  };

  const occasionOptions = ["All", "Casual", "Formal", "Bridal", "Festive", "Wedding", "Engagement", "Religious", "Reception", "Party", "Office", "Everyday"];
  const genderOptions = ["All", "Women", "Men", "Unisex"];

  const purities = purityOptions[metal] || purityOptions.gold;

  const update = (key, value) => {
    if (key === "gender" || key === "for") {
      setFilters((prev) => ({ ...prev, gender: value, for: value }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const FilterSection = ({ title, children }) => (
    <div className="mb-6">
      <h4 className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#064E3B" }}>
        {title}
      </h4>
      {children}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}>
          Filters
        </h3>
        <button
          onClick={() => setFilters({ purity: "All", minPrice: "", maxPrice: "", occasion: "All", gender: "All", for: "All", sort: "popular" })}
          className="text-xs underline"
          style={{ color: "#E8C96C" }}
        >
          Clear all
        </button>
      </div>

      {/* Price range */}
      <FilterSection title="Price Range">
        <div className="flex flex-wrap gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-[#E8C96C] transition-colors"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-[#E8C96C] transition-colors"
          />
        </div>
      </FilterSection>

      {/* Purity */}
      <FilterSection title={metal === "silver" ? "Silver Purity" : metal === "platinum" ? "Platinum Grade" : "Gold Purity"}>
        <div className="flex flex-wrap gap-2">
          {purities.map((p) => (
            <button
              key={p}
              onClick={() => update("purity", p)}
              className="px-3 py-1.5 text-xs rounded-full border transition-all"
              style={
                filters.purity === p
                  ? { backgroundColor: "#064E3B", color: "#F2DEAA", borderColor: "#064E3B" }
                  : { backgroundColor: "white", color: "#064E3B", borderColor: "#e5e7eb" }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Occasion */}
      <FilterSection title="Occasion">
        <div className="flex flex-wrap gap-2">
          {occasionOptions.map((o) => (
            <button
              key={o}
              onClick={() => update("occasion", o)}
              className="px-3 py-1.5 text-xs rounded-full border transition-all"
              style={
                filters.occasion === o
                  ? { backgroundColor: "#E8C96C", color: "#064E3B", borderColor: "#E8C96C" }
                  : { backgroundColor: "white", color: "#064E3B", borderColor: "#e5e7eb" }
              }
            >
              {o}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Gender */}
      <FilterSection title="For">
        <div className="flex flex-wrap gap-2">
          {genderOptions.map((g) => (
            <button
              key={g}
              onClick={() => update("gender", g)}
              className="px-3 py-1.5 text-xs rounded-full border transition-all"
              style={
                (filters.gender === g || filters.for === g)
                  ? { backgroundColor: "#064E3B", color: "#F2DEAA", borderColor: "#064E3B" }
                  : { backgroundColor: "white", color: "#064E3B", borderColor: "#e5e7eb" }
              }
            >
              {g}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Sort By">
        <select
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-[#E8C96C] bg-white"
          style={{ color: "#064E3B" }}
        >
          <option value="popular">Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="new">New Arrivals</option>
          <option value="rating">Top Rated</option>
        </select>
      </FilterSection>
    </div>
  );
}
