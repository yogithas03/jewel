import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Jewellery from "./pages/Jewellery";
import Gold from "./pages/Gold";
import Diamond from "./pages/Diamond";
import Silver from "./pages/Silver";
import Platinum from "./pages/Platinum";
import GoldRate from "./pages/GoldRate";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";
import CategoryPage from "./pages/CategoryPage";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";


function NotFound() {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-6" style={{ color: "#E8C96C" }}>✦</p>
      <h1 className="text-3xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}>
        Page Not Found
      </h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="px-8 py-3 rounded-full text-sm font-semibold" style={{ backgroundColor: "#064E3B", color: "#F2DEAA" }}>
        GO HOME
      </a>
    </div>
  );
}

function ComingSoon({ title }) {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-6" style={{ color: "#E8C96C" }}>✦</p>
      <h1 className="text-3xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}>
        {title}
      </h1>
      <p className="text-gray-500">This page is coming soon.</p>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="site-shell min-h-screen flex flex-col overflow-x-clip">
          <Navbar />
          <main className="site-main flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jewellery" element={<Jewellery />} />
              <Route path="/jewellery/:slug" element={<Jewellery />} />
              <Route path="/shop/gold" element={<Gold />} />
              <Route path="/shop/diamond" element={<Diamond />} />
              <Route path="/shop/silver" element={<Silver />} />
              <Route path="/shop/platinum" element={<Platinum />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/gold-rate" element={<GoldRate />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/shipping" element={<ComingSoon title="Shipping Policy" />} />
              <Route path="/returns" element={<ComingSoon title="Returns & Exchanges" />} />
              <Route path="/care" element={<ComingSoon title="Jewellery Care Guide" />} />
              <Route path="/faqs" element={<ComingSoon title="FAQs" />} />
              <Route path="/privacy" element={<ComingSoon title="Privacy Policy" />} />
              <Route path="/terms" element={<ComingSoon title="Terms & Conditions" />} />
              <Route path="/refund" element={<ComingSoon title="Refund Policy" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {pathname === "/" && <Footer />}
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}





