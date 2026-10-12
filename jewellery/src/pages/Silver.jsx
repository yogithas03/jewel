import ShopPage from "../components/ShopPage";

export default function Silver() {
  return (
    <ShopPage
      metal="silver"
      title="Silver Jewellery"
      subtitle="Sterling silver designs for everyday elegance and festive moments."
      heroImage="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=80"
      categoryOptions={["rings", "necklaces", "earrings", "bangles", "chains", "bracelets", "pendants"]}
    />
  );
}
