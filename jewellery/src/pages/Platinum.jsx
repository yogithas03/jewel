import ShopPage from "../components/ShopPage";

export default function Platinum() {
  return (
    <ShopPage
      metal="platinum"
      title="Platinum Jewellery"
      subtitle="Rare. Enduring. Extraordinary. Discover our platinum collection."
      heroImage="https://images.unsplash.com/photo-1612198790700-1b9b5e9d5a4e?w=1200&q=80"
      categoryOptions={["rings", "chains", "bracelets", "earrings"]}
    />
  );
}
