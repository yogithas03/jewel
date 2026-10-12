import ShopPage from "../components/ShopPage";
import goldJewellery from "../assets/goldjewellery.jpg";

export default function Gold() {
  return (
    <ShopPage
      metal="gold"
      title="Gold Jewellery"
      subtitle="Crafted in 18K, 22K and 24K gold — timeless pieces for every occasion."
      heroImage={goldJewellery}
      categoryOptions={["rings", "necklaces", "earrings", "bangles", "chains", "bracelets", "pendants"]}
    />
  );
}
