"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { signIn, signUp, signInWithGoogle } from "../actions/auth";

function LoginForm() {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(e.target);
    formData.set("redirect", redirectTo);

    try {
      const result = mode === "signin"
        ? await signIn(formData)
        : await signUp(formData);

      if (result?.error) {
        setError(result.error);
      }
      if (result?.success) {
        setSuccess(result.success);
      }
    } catch (err) {
      // redirect throws — this is expected on success
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      // redirect — expected
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left: Form */}
      <section className="border-r" style={{ flex: "1 1 500px", padding: "3rem 2rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: "100%", maxWidth: "420px" }}
        >
          <h1 style={{ fontSize: "3.5rem", fontFamily: "var(--font-heading)", textTransform: "uppercase", marginBottom: "0.5rem", lineHeight: 0.9 }}>
            {mode === "signin" ? "Welcome Back" : "Join Rangrez"}
          </h1>
          <p style={{ fontSize: "1rem", opacity: 0.6, marginBottom: "2rem" }}>
            {mode === "signin" ? "Sign in to your account" : "Create your account to get started"}
          </p>

          {/* Mode Toggle */}
          <div style={{ display: "flex", border: "var(--border-thick)", marginBottom: "2rem" }}>
            {["signin", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                style={{
                  flex: 1, padding: "0.8rem", fontSize: "0.85rem", fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  background: mode === m ? "var(--cl-text)" : "var(--cl-bg)",
                  color: mode === m ? "var(--cl-bg)" : "var(--cl-text)",
                  transition: "var(--transition-snap)",
                }}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignIn}
            style={{
              width: "100%", padding: "0.9rem", border: "var(--border-thick)",
              background: "var(--cl-bg)", fontSize: "0.9rem", fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
              marginBottom: "1.5rem", transition: "var(--transition-snap)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--cl-muted)" }} />
            <span style={{ fontSize: "0.8rem", opacity: 0.5, textTransform: "uppercase" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "var(--cl-muted)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <label className="input-label" htmlFor="fullName">Full Name</label>
                  <input id="fullName" name="fullName" type="text" className="input-field" placeholder="Your name" />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="input-label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className="input-field" placeholder="rangrezstencils@gmail.com" />
            </div>

            <div>
              <label className="input-label" htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-field"
                  placeholder="Min 6 characters"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: "0.75rem 1rem", background: "rgba(192,57,43,0.1)", border: "2px solid var(--cl-danger)", fontSize: "0.85rem", color: "var(--cl-danger)", fontWeight: 500 }}
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: "0.75rem 1rem", background: "rgba(39,174,96,0.1)", border: "2px solid var(--cl-success)", fontSize: "0.85rem", color: "var(--cl-success)", fontWeight: 500 }}
              >
                {success}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="brutalist-button brutalist-button--full"
              style={{ padding: "1rem", fontSize: "1rem", marginTop: "0.5rem", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </motion.div>
      </section>

      {/* Right: Visual */}
      <section style={{ flex: "1 1 500px", background: "var(--cl-primary)", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "3rem" }}>
        {/* Animated orbs (Aurora-inspired) */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          style={{ position: "absolute", top: "15%", left: "20%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,83,0.3), transparent 70%)", filter: "blur(60px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
          style={{ position: "absolute", bottom: "20%", right: "15%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(140,154,142,0.3), transparent 70%)", filter: "blur(50px)" }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          style={{ position: "absolute", top: "50%", left: "50%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(164,74,63,0.2), transparent 60%)", filter: "blur(80px)", transform: "translate(-50%, -50%)" }}
        />

        <div style={{ position: "relative", zIndex: 2, color: "var(--cl-bg)", textAlign: "right" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "4rem", lineHeight: 0.9 }}>RANGREZ</h2>
          <p style={{ fontSize: "1rem", fontWeight: 300, letterSpacing: "3px", textTransform: "uppercase", marginTop: "0.5rem", opacity: 0.8 }}>
            Premium Artistry
          </p>
        </div>
      </section>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="loading-fallback">Loading experience...</div>}>
      <LoginForm />
    </Suspense>
  );
}
