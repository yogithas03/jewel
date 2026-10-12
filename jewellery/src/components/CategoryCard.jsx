import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={category.route}
      className="group relative overflow-hidden rounded-2xl aspect-square block cursor-pointer"
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#064E3B]/90 via-[#064E3B]/30 to-transparent transition-opacity duration-300 group-hover:from-[#064E3B]/95" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3
          className="text-sm font-semibold text-white mb-1 group-hover:text-[#E8C96C] transition-colors"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {category.name}
        </h3>
        <p className="text-xs text-white/60 mb-2 hidden group-hover:block transition-all">
          {category.description}
        </p>
        <span
          className="text-xs tracking-wider font-medium"
          style={{ color: "#E8C96C" }}
        >
          EXPLORE →
        </span>
      </div>
    </Link>
  );
}
