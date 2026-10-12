import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl animate-fade-up"
      style={{
        backgroundColor: type === "success" ? "#064E3B" : "#dc2626",
        color: "#F2DEAA",
        minWidth: "220px",
      }}
    >
      <span className="text-base">{type === "success" ? "✓" : "✕"}</span>
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-auto opacity-60 hover:opacity-100 text-sm">✕</button>
    </div>
  );
}
