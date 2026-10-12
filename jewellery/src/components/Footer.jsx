import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import "./Footer.css";

const STORE_ADDRESS =
  "No.80 & 81, Velachery Main Rd, Devi Karumariamman Nagar, Pallikaranai, Chennai, Tamil Nadu 600100, India";

const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;

const footerColumns = [
  {
    heading: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Jewellery", to: "/jewellery" },
      { label: "Gold Jewellery", to: "/shop/gold" },
      { label: "Diamond Jewellery", to: "/shop/diamond" },
      { label: "Silver Jewellery", to: "/shop/silver" },
      { label: "New Arrivals", to: "/jewellery?sort=newest" },
    ],
  },
  {
    heading: "Customer Care",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "FAQs", to: "/faqs" },
      { label: "Shipping & Delivery", to: "/shipping" },
      { label: "Returns & Exchanges", to: "/returns" },
      { label: "Jewellery Care", to: "/care" },
    ],
  },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Shipping Policy", to: "/shipping" },
];

const revealVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function SocialLink({ name, children }) {
  return (
    <a
      className="footer-social"
      href={`https://www.${name}.com/`}
      target="_blank"
      rel="noreferrer"
      aria-label={`DIKSHI JEWELLERY on ${name}`}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const footerRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const opacity = useTransform(smoothProgress, [0, 0.45, 1], [0.45, 0.8, 1]);
  const scale = useTransform(smoothProgress, [0, 1], [0.96, 1]);

  return (
    <motion.footer
      ref={footerRef}
      className="site-footer"
      style={reduceMotion ? undefined : { opacity, scale }}
    >
      <motion.div
        className="footer-inner"
        variants={revealVariants}
        initial={reduceMotion ? false : "hidden"}
        whileInView={reduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.12 }}
      >
        <div className="footer-grid">
          <motion.section className="footer-brand" variants={itemVariants} aria-label="About DIKSHI JEWELLERY">
            <Link to="/" className="footer-logo" aria-label="DIKSHI JEWELLERY home">
              <span className="footer-logo-name">DIKSHI</span>
              <span className="footer-logo-subtitle">JEWELLERY</span>
            </Link>
            <p className="footer-description">
              Crafting timeless elegance with jewellery made to celebrate every moment.
            </p>
            <div className="footer-socials" aria-label="Social media">
              <SocialLink name="instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle className="footer-social-dot" cx="17.7" cy="6.5" r="1" />
                </svg>
              </SocialLink>
              <SocialLink name="facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.2 20v-7.3h2.5l.4-3h-2.9V7.8c0-.9.3-1.5 1.5-1.5h1.6V3.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8.5v3h2.6V20z" />
                </svg>
              </SocialLink>
              <SocialLink name="pinterest">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3.5a8.5 8.5 0 0 0-3.1 16.4c0-.7 0-1.5.2-2.2l1.1-4.6s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.6-.3 1.1.5 2 1.6 2 1.9 0 3.3-2 3.3-4.9 0-2.5-1.8-4.2-4.3-4.2-2.9 0-4.6 2.2-4.6 4.5 0 .9.3 1.9.8 2.4.1.2.2.3.1.5l-.3 1c0 .2-.2.3-.4.2-1.4-.6-2.2-2.4-2.2-3.9 0-3.2 2.3-6.1 6.7-6.1 3.5 0 6.2 2.5 6.2 5.8 0 3.5-2.2 6.4-5.2 6.4-1 0-2-.6-2.4-1.2l-.7 2.7c-.3 1-.9 1.9-1.3 2.6A8.5 8.5 0 1 0 12 3.5z" />
                </svg>
              </SocialLink>
            </div>
          </motion.section>

          {footerColumns.map((column) => (
            <motion.nav
              key={column.heading}
              className="footer-column"
              variants={itemVariants}
              aria-label={column.heading}
            >
              <h2 className="footer-heading">{column.heading}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link className="footer-link" to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}

          <motion.section className="footer-column footer-contact" variants={itemVariants}>
            <h2 className="footer-heading">Contact</h2>
            <address>
              <p>{STORE_ADDRESS}</p>
              <a className="footer-link" href="tel:+917894567880">+91 78945 67880</a>
              <a className="footer-link" href="tel:+919993456689">+91 99934 56689</a>
              <a className="footer-link" href="mailto:hello@dikshijewellery.com">hello@dikshijewellery.com</a>
              <a className="footer-link" href="mailto:support@dikshijewellery.com">support@dikshijewellery.com</a>
              <p>Mon–Sat: 10:00 AM–8:00 PM<br />Sunday: 11:00 AM–6:00 PM</p>
              <a className="footer-link footer-directions" href={DIRECTIONS_URL} target="_blank" rel="noreferrer">
                Get Directions <span aria-hidden="true">↗</span>
              </a>
            </address>
          </motion.section>
        </div>

        <div className="footer-bottom">
          <p>Copyright © 2026 DIKSHI JEWELLERY. All rights reserved.</p>
          <nav className="footer-legal" aria-label="Legal">
            {legalLinks.map((link) => (
              <Link key={link.label} className="footer-link" to={link.to}>{link.label}</Link>
            ))}
          </nav>
        </div>
      </motion.div>
    </motion.footer>
  );
}
