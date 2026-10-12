import ShopPage from "../components/ShopPage";
import platinumBrand from "../assets/platinumbrand.jfif";

export default function Platinum() {
  return (
    <ShopPage
      metal="platinum"
      title="Platinum Jewellery"
      subtitle="Rare. Enduring. Extraordinary. Discover our platinum collection."
      heroImage={platinumBrand}
      categoryOptions={["rings", "necklaces", "chains", "bracelets", "bangles", "earrings", "pendants"]}
    />
  );
}
