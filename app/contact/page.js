"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "var(--cl-bg)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        className="border-b"
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          backgroundColor: "var(--cl-secondary)",
        }}
      >
        <h1 className="title-massive" style={{ textTransform: "uppercase" }}>
          Contact Us
        </h1>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", flex: 1 }}>
        {/* Left: Info */}
        <section
          className="border-r"
          style={{
            flex: "1 1 500px",
            padding: "6rem 4rem",
            backgroundColor: "var(--cl-bg)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2
              style={{
                fontSize: "3.5rem",
                marginBottom: "3rem",
                textTransform: "uppercase",
              }}
            >
              Get In Touch
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2.5rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    opacity: 0.6,
                    letterSpacing: "1px",
                  }}
                >
                  Email
                </span>
                <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
                  hello@rangrezhenna.com
                </p>
              </div>

              <div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    opacity: 0.6,
                    letterSpacing: "1px",
                  }}
                >
                  Instagram
                </span>
                <p style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
                  @rangrez.henna
                </p>
              </div>

              <div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    opacity: 0.6,
                    letterSpacing: "1px",
                  }}
                >
                  Studio Location
                </span>
                <p
                  style={{
                    fontSize: "1.5rem",
                    marginTop: "0.5rem",
                    lineHeight: "1.4",
                  }}
                >
                  124 Brutalist Ave,
                  <br />
                  Brooklyn, NY 11201
                  <br />
                  (By Appointment Only)
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Right: Form */}
        <section
          style={{
            flex: "1 1 500px",
            padding: "6rem 4rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              maxWidth: "600px",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent!");
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                htmlFor="name"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
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
                htmlFor="email"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                Email
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
                htmlFor="message"
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                Message
              </label>
              <textarea
                id="message"
                rows="6"
                required
                style={{
                  padding: "1rem",
                  fontSize: "1.1rem",
                  border: "var(--border-thick)",
                  backgroundColor: "transparent",
                  color: "var(--cl-text)",
                  fontFamily: "var(--font-body)",
                  resize: "vertical",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: "1.5rem",
                fontSize: "1.2rem",
                marginTop: "1rem",
              }}
            >
              Submit Inquiry
            </button>
          </motion.form>
        </section>
      </div>
    </div>
  );
}
