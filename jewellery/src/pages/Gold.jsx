import ShopPage from "../components/ShopPage";

export default function Gold() {
  return (
    <ShopPage
      metal="gold"
      title="Gold Jewellery"
      subtitle="Crafted in 18K, 22K and 24K gold — timeless pieces for every occasion."
      heroImage="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80"
      categoryOptions={["rings", "necklaces", "earrings", "bangles", "chains", "bracelets", "pendants"]}
    />
  );
}
