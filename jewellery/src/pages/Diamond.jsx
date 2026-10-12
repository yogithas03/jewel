import ShopPage from "../components/ShopPage";

export default function Diamond() {
  return (
    <ShopPage
      metal="diamond"
      title="Diamond Jewellery"
      subtitle="GIA-certified diamonds set in precious metals. Pure brilliance, guaranteed."
      heroImage="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&q=80"
      categoryOptions={["rings", "necklaces", "earrings", "bangles", "bracelets", "pendants"]}
    />
  );
}
