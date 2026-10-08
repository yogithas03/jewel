import { useParams, Link } from "react-router-dom";
import { categories } from "../data/categories";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import ShopPage from "../components/ShopPage";
import { products } from "../data/products";

const metalMeta = {
  gold: {
    title: "Gold Jewellery",
    subtitle: "Timeless gold crafted in 18K, 22K and 24K purity.",
    hero: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80",
  },
  diamond: {
    title: "Diamond Jewellery",
    subtitle: "GIA-certified brilliance set in precious metals.",
    hero: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&q=80",
  },
  silver: {
    title: "Silver Jewellery",
    subtitle: "Sterling silver for everyday elegance.",
    hero: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=80",
  },
  platinum: {
    title: "Platinum Jewellery",
    subtitle: "Rare and enduring — the ultimate luxury.",
    hero: "https://images.unsplash.com/photo-1612198790700-1b9b5e9d5a4e?w=1200&q=80",
  },
};

export default function Jewellery() {
  const { slug } = useParams();

  // /jewellery/gold | /jewellery/diamond | etc.
  if (slug && metalMeta[slug]) {
    const meta = metalMeta[slug];
    return (
      <ShopPage
        metal={slug}
        title={meta.title}
        subtitle={meta.subtitle}
        heroImage={meta.hero}
        categoryOptions={["rings", "necklaces", "earrings", "bangles", "chains", "bracelets", "pendants"]}
      />
    );
  }

  // /jewellery/bridal
  if (slug === "bridal") {
    const bridalProducts = products.filter((p) => p.isBridal);
    return (
      <div className="pt-20 lg:pt-24">
        <PageHero
          title="Bridal Jewellery"
          subtitle="Every bride deserves to shine — curated bridal sets, just for you."
          image="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200&q=80"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {bridalProducts.length === 0 ? (
            <p className="text-center text-gray-400 py-20">Bridal collection launching soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bridalProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default /jewellery — all categories
  return (
    <div className="pt-20 lg:pt-24">
      <PageHero title="All Jewellery" subtitle="Explore our complete collection." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PageHero({ title, subtitle, image }) {
  return (
    <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden" style={{ backgroundColor: "#064E3B" }}>
      {image && <img src={image} alt={title} className="w-full h-full object-cover opacity-25" />}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p className="text-xs tracking-[0.35em] mb-3" style={{ color: "#D79B01" }}>DIKSHI JEWELLERY</p>
        <h1
          className="text-3xl sm:text-5xl font-semibold"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FCF1D0" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sm max-w-md" style={{ color: "rgba(252,241,208,0.70)" }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
