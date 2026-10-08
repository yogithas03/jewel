import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [tab, setTab] = useState("login"); // "login" | "register"

  return (
    <div className="min-h-screen flex pt-[100px] lg:pt-[116px]" style={{ backgroundColor: "#092328" }}>

      {/* ── LEFT — Jewellery image panel ── */}
      <div className="hidden sm:flex sm:w-1/2 relative overflow-hidden">
        <img
          src="/images/temple-jewellery-account.jpg"
          alt="Dikshi Jewellery"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(1.1) saturate(1.2)" }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(9,35,40,0.15) 0%, rgba(9,35,40,0.05) 60%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(9,35,40,0.7) 0%, transparent 50%)",
          }}
        />

        {/* Brand overlay text */}
        <div className="absolute bottom-12 left-10 right-10 z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ backgroundColor: "#F5DF92" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#F5DF92" }}>
              Since 1992
            </span>
          </div>
          <h2
            className="text-3xl font-semibold leading-snug mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F0F7F2" }}
          >
            Timeless Elegance,<br />Crafted for You
          </h2>
          <p className="text-sm" style={{ color: "rgba(240,247,242,0.7)" }}>
            Discover jewellery designed to celebrate every beautiful moment.
          </p>
        </div>

      </div>

      {/* ── RIGHT — Auth form panel ── */}
      <div className="w-full sm:w-1/2 flex flex-col items-center justify-center px-6 py-12 sm:px-8 lg:px-12">

        {/* Mobile logo */}
        <div className="sm:hidden mb-10 text-center">
          <Link to="/" className="inline-flex flex-col items-center">
            <span
              className="text-3xl font-bold tracking-wider"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F0F7F2" }}
            >
              DIKSHI
            </span>
            <span className="text-xs tracking-[0.3em] mt-1" style={{ color: "#D79B01" }}>
              JEWELLERY
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#F5DF92" }}>
              Welcome
            </p>
            <h1
              className="text-3xl font-semibold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F0F7F2" }}
            >
              {tab === "login" ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-sm mt-2" style={{ color: "rgba(240,247,242,0.55)" }}>
              {tab === "login"
                ? "Welcome back to Dikshi Jewellery"
                : "Join us for an exclusive jewellery experience"}
            </p>
          </div>

          {/* Tab switcher */}
          <div
            className="flex rounded-xl p-1 mb-8"
            style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
          >
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 capitalize tracking-wide"
                style={
                  tab === t
                    ? { backgroundColor: "#F5DF92", color: "#092328" }
                    : { color: "rgba(240,247,242,0.55)" }
                }
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {tab === "login" ? <LoginForm /> : <RegisterForm onSuccess={() => setTab("login")} />}

          {/* Back to site */}
          <p className="text-center mt-8 text-xs" style={{ color: "rgba(240,247,242,0.35)" }}>
            <Link to="/" className="hover:underline" style={{ color: "rgba(240,247,242,0.55)" }}>
              ← Back to Dikshi Jewellery
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Login form ─────────────────────────────────────────── */
function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4" style={{ color: "#F5DF92" }}>✓</div>
        <p className="text-base font-semibold" style={{ color: "#F0F7F2" }}>Signed in successfully!</p>
        <p className="text-sm mt-2" style={{ color: "rgba(240,247,242,0.55)" }}>
          Redirecting to your account…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <AuthField label="Email Address" error={errors.email}>
        <input
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: "" })); }}
          className={authInput(errors.email)}
        />
      </AuthField>

      <AuthField label="Password" error={errors.password}>
        <input
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: "" })); }}
          className={authInput(errors.password)}
        />
      </AuthField>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(e) => setForm(f => ({ ...f, remember: e.target.checked }))}
            className="w-4 h-4 rounded accent-[#F5DF92]"
          />
          <span className="text-xs" style={{ color: "rgba(240,247,242,0.6)" }}>Remember me</span>
        </label>
        <button type="button" className="text-xs hover:underline" style={{ color: "#F5DF92" }}>
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded-xl font-semibold text-sm tracking-wider transition-all hover:opacity-90 active:scale-95"
        style={{ backgroundColor: "#F5DF92", color: "#092328" }}
      >
        SIGN IN
      </button>

      <Divider />
      <SocialButtons />
    </form>
  );
}

/* ── Register form ──────────────────────────────────────── */
function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  const update = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <AuthField label="Full Name *" error={errors.name}>
        <input type="text" placeholder="Your full name" value={form.name} onChange={e => update("name", e.target.value)} className={authInput(errors.name)} />
      </AuthField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AuthField label="Email *" error={errors.email}>
          <input type="email" placeholder="your@email.com" value={form.email} onChange={e => update("email", e.target.value)} className={authInput(errors.email)} />
        </AuthField>
        <AuthField label="Phone *" error={errors.phone}>
          <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => update("phone", e.target.value)} className={authInput(errors.phone)} />
        </AuthField>
      </div>

      <AuthField label="Password *" error={errors.password}>
        <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => update("password", e.target.value)} className={authInput(errors.password)} />
      </AuthField>

      <AuthField label="Confirm Password *" error={errors.confirm}>
        <input type="password" placeholder="Re-enter password" value={form.confirm} onChange={e => update("confirm", e.target.value)} className={authInput(errors.confirm)} />
      </AuthField>

      <p className="text-xs" style={{ color: "rgba(240,247,242,0.45)" }}>
        By creating an account you agree to our{" "}
        <Link to="/terms" className="underline" style={{ color: "#F5DF92" }}>Terms</Link> &{" "}
        <Link to="/privacy" className="underline" style={{ color: "#F5DF92" }}>Privacy Policy</Link>.
      </p>

      <button
        type="submit"
        className="w-full py-4 rounded-xl font-semibold text-sm tracking-wider transition-all hover:opacity-90 active:scale-95"
        style={{ backgroundColor: "#F5DF92", color: "#092328" }}
      >
        CREATE ACCOUNT
      </button>

      <Divider />
      <SocialButtons />
    </form>
  );
}

/* ── Shared UI helpers ──────────────────────────────────── */
function AuthField({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "rgba(240,247,242,0.6)" }}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function authInput(error) {
  return [
    "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all auth-input",
    error
      ? "border border-red-400 focus:border-red-400"
      : "border border-white/10 focus:border-[#F5DF92]",
  ].join(" ");
}

function Divider() {
  return (
    <div className="relative flex items-center gap-3 my-2">
      <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
      <span className="text-xs shrink-0" style={{ color: "rgba(240,247,242,0.35)" }}>or continue with</span>
      <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: "Google", icon: "G" },
        { label: "Facebook", icon: "f" },
      ].map((s) => (
        <button
          key={s.label}
          type="button"
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all hover:bg-white/10"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "#F0F7F2" }}
        >
          <span className="font-bold" style={{ color: "#F5DF92" }}>{s.icon}</span>
          {s.label}
        </button>
      ))}
    </div>
  );
}
