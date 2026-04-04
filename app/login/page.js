"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--cl-bg)",
      }}
    >
      {/* Left: Form Flow */}
      <section
        className="border-r"
        style={{
          flex: "1 1 500px",
          padding: "4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%", maxWidth: "450px" }}
        >
          <h1
            className="title-massive"
            style={{ fontSize: "5rem", marginBottom: "0.5rem" }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              fontWeight: "300",
              opacity: 0.8,
              marginBottom: "4rem",
            }}
          >
            Sign in to continue to your account.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Signed in!");
            }}
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                htmlFor="email"
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                style={{
                  padding: "1rem",
                  fontSize: "1.1rem",
                  border: "var(--border-thick)",
                  backgroundColor: "transparent",
                  color: "var(--cl-text)",
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                htmlFor="password"
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Password
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  style={{
                    padding: "1rem",
                    width: "100%",
                    fontSize: "1.1rem",
                    border: "var(--border-thick)",
                    backgroundColor: "transparent",
                    color: "var(--cl-text)",
                    fontFamily: "var(--font-body)",
                    paddingRight: "3rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "1rem", opacity: 0.5 }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "0.5rem",
                }}
              >
                <a
                  href="#"
                  style={{
                    fontSize: "0.85rem",
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                  }}
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: "1.2rem",
                fontSize: "1.1rem",
                marginTop: "2rem",
              }}
            >
              Sign In
            </button>
          </form>

          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <span style={{ opacity: 0.7 }}>Don't have an account? </span>
            <Link
              href="#"
              style={{
                fontWeight: "600",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              Sign up here
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Right: Illustration/Image */}
      <section
        style={{
          flex: "1 1 600px",
          backgroundColor: "var(--cl-primary)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542171120-745a907fe23f?auto=format&fit=crop&q=80&w=2000')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
            mixBlendMode: "multiply",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "3rem",
            right: "3rem",
            color: "var(--cl-bg)",
            textAlign: "right",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "4rem",
              lineHeight: "1",
            }}
          >
            RANGREZ
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              fontWeight: "300",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Premium Artistry
          </p>
        </div>
      </section>
    </div>
  );
}
