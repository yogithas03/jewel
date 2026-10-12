import bangelBanner from "../assets/bangelbanner.png";
import classicSolitaireGoldRing from "../assets/Classic Solitaire Gold Ring.jfif";
import jhumkaGoldEarrings from "../assets/Jhumka Gold Earrings.jfif";
import goldOmPendant from "../assets/Gold Om Pendant.jfif";
import classicGoldChainBracelet from "../assets/Classic Gold Chain Bracelet.jfif";
import necklaceBanner from "../assets/necklace-banner.png";
import bridalCard from "../assets/bridalcard.jpg";
import platinumBrand from "../assets/platinumbrand.jfif";
import goldJewellery from "../assets/goldjewellery.jpg";

export const categories = [
  {
    id: "gold",
    name: "Gold Jewellery",
    slug: "gold",
    route: "/jewellery/gold",
    image: goldJewellery,
    description: "Timeless gold pieces crafted with precision",
    count: 120,
  },
  {
    id: "diamond",
    name: "Diamond Jewellery",
    slug: "diamond",
    route: "/jewellery/diamond",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    description: "Brilliant diamonds set in precious metals",
    count: 85,
  },
  {
    id: "silver",
    name: "Silver Jewellery",
    slug: "silver",
    route: "/jewellery/silver",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    description: "Sterling silver designs for modern living",
    count: 10,
  },
  {
    id: "platinum",
    name: "Platinum Jewellery",
    slug: "platinum",
    route: "/jewellery/platinum",
    image: platinumBrand,
    description: "Rare and enduring platinum collections",
    count: 12,
  },
  {
    id: "bridal",
    name: "Bridal Jewellery",
    slug: "bridal",
    route: "/jewellery/bridal",
    image: bridalCard,
    description: "Make your special day unforgettable",
    count: 64,
  },
  {
    id: "rings",
    name: "Rings",
    slug: "rings",
    route: "/category/rings",
    image: classicSolitaireGoldRing,
    description: "Rings for every occasion and style",
    count: 10,
  },
  {
    id: "necklaces",
    name: "Necklaces",
    slug: "necklaces",
    route: "/category/necklaces",
    image: necklaceBanner,
    description: "Statement necklaces and delicate chains",
    count: 12,
  },
  {
    id: "earrings",
    name: "Earrings",
    slug: "earrings",
    route: "/category/earrings",
    image: jhumkaGoldEarrings,
    description: "From studs to chandeliers",
    count: 10,
  },
  {
    id: "bangles",
    name: "Bangles",
    slug: "bangles",
    route: "/category/bangles",
    image: bangelBanner,
    description: "Traditional and contemporary bangles",
    count: 10,
  },
  {
    id: "chains",
    name: "Chains",
    slug: "chains",
    route: "/category/chains",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    description: "Gold, silver and platinum chains",
    count: 48,
  },
  {
    id: "bracelets",
    name: "Bracelets",
    slug: "bracelets",
    route: "/category/bracelets",
    image: classicGoldChainBracelet,
    description: "Elegant bracelets for every wrist",
    count: 10,
  },
  {
    id: "pendants",
    name: "Pendants",
    slug: "pendants",
    route: "/category/pendants",
    image: goldOmPendant,
    description: "Meaningful pendants and charms",
    count: 10,
  },
];

export const shopCategories = [
  { label: "Gold", route: "/shop/gold", color: "#F5DF92" },
  { label: "Diamond", route: "/shop/diamond", color: "#B0C4DE" },
  { label: "Silver", route: "/shop/silver", color: "#A8A9AD" },
  { label: "Platinum", route: "/shop/platinum", color: "#8E8E8E" },
];
