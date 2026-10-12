import { useReducedMotion } from "motion/react";
import "./HeartConfetti.css";

const hearts = [
  { x: 0, y: -34, rotate: -12 },
  { x: 24, y: -27, rotate: 14 },
  { x: 35, y: -4, rotate: 25 },
  { x: 24, y: 20, rotate: 8 },
  { x: 0, y: 31, rotate: -14 },
  { x: -24, y: 20, rotate: 16 },
  { x: -35, y: -4, rotate: -25 },
  { x: -24, y: -27, rotate: -8 },
];

export default function HeartConfetti({ trigger }) {
  const reduceMotion = useReducedMotion();

  if (!trigger || reduceMotion) return null;

  return (
    <span className="heart-confetti" aria-hidden="true">
      {hearts.map((heart, index) => (
        <span
          key={`${trigger}-${index}`}
          className="heart-confetti-piece"
          style={{
            "--heart-x": `${heart.x}px`,
            "--heart-y": `${heart.y}px`,
            "--heart-rotate": `${heart.rotate}deg`,
            "--heart-delay": `${index * 18}ms`,
          }}
        >
          ♥
        </span>
      ))}
    </span>
  );
}
