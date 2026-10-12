import confetti from "canvas-confetti";

/**
 * Fires an explosion of vibrant, festive colored paper confetti across the screen.
 * Simulates fluttering colored paper ribbons and strips.
 */
export function fireColorPaperConfetti() {
  const festivePaperColors = [
    "#FF1493", // Vibrant Pink Paper
    "#FF4500", // Tangerine Orange Paper
    "#FFD700", // Bright Gold Foil
    "#E8C96C", // Dikshi Royal Gold Paper
    "#064E3B", // Emerald Green Paper
    "#00F5D4", // Bright Cyan Paper
    "#7B2CBF", // Royal Purple Paper
    "#06D6A0", // Mint Jade Paper
    "#FF0054", // Hot Rose Paper
    "#3A86FF", // Royal Blue Paper
    "#FFBE0B", // Marigold Yellow Paper
    "#8338EC", // Violet Paper
  ];

  // 1. Instant Center Firework Blast
  confetti({
    particleCount: 100,
    spread: 90,
    startVelocity: 50,
    origin: { x: 0.5, y: 0.65 },
    colors: festivePaperColors,
    shapes: ["square"], // Flat colored paper rectangles
    scalar: 1.35, // Larger paper strips
    ticks: 280,
    gravity: 0.85,
    drift: 0.05,
    zIndex: 99999,
  });

  // 2. Left Cannon shoots upwards & towards right
  setTimeout(() => {
    confetti({
      particleCount: 75,
      angle: 60,
      spread: 75,
      startVelocity: 60,
      origin: { x: 0.05, y: 0.8 },
      colors: festivePaperColors,
      shapes: ["square"],
      scalar: 1.4,
      ticks: 320,
      gravity: 0.8,
      zIndex: 99999,
    });
  }, 180);

  // 3. Right Cannon shoots upwards & towards left
  setTimeout(() => {
    confetti({
      particleCount: 75,
      angle: 120,
      spread: 75,
      startVelocity: 60,
      origin: { x: 0.95, y: 0.8 },
      colors: festivePaperColors,
      shapes: ["square"],
      scalar: 1.4,
      ticks: 320,
      gravity: 0.8,
      zIndex: 99999,
    });
  }, 360);

  // 4. Grand Cascade: Fluttering colored paper shower from the sky
  setTimeout(() => {
    confetti({
      particleCount: 90,
      spread: 130,
      startVelocity: 30,
      origin: { x: 0.5, y: 0.15 },
      colors: festivePaperColors,
      shapes: ["square"],
      scalar: 1.25,
      ticks: 400,
      gravity: 0.65,
      drift: 0.15,
      zIndex: 99999,
    });
  }, 550);
}
