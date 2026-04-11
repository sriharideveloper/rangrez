"use client";

import { motion } from "framer-motion";
import ScrollFloat from "../../components/ScrollFloat";

export default function TermsAndConditions() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: (
        <>
          By accessing or using the Rangrez Henna platform, website, and
          services, you agree to be bound by these Terms and Conditions. If you
          disagree with any part of these terms, you may not access the service.
          These Terms apply to all visitors, users, and others who access or use
          the Service.
        </>
      ),
    },
    {
      title: "2. Intellectual Property Rights",
      content: (
        <>
          The platform, its original content, features, stencils designs, and
          functionality are and will remain the exclusive property of Rangrez
          Henna and its licensors. Our designs, trademarks, and trade dress may
          not be used in connection with any product or service without the
          prior written consent of Rangrez Henna. Unauthorized reproduction or
          resale of our stencil designs will result in immediate legal action to
          protect our business and creators.
        </>
      ),
    },
    {
      title: "3. User Accounts & Responsibilities",
      content: (
        <>
          When you create an account with us, you must provide accurate,
          complete, and current information. You are responsible for
          safeguarding the password that you use to access the service and for
          any activities or actions under your password. You agree not to
          disclose your password to any third party and must notify us
          immediately upon becoming aware of any breach of security or
          unauthorized use of your account.
        </>
      ),
    },
    {
      title: "4. Products & Pricing",
      content: (
        <>
          We strive to provide accurate descriptions of our reusable henna
          stencils. However, we do not warrant that product descriptions,
          colors, or other content are fully accurate, complete, reliable,
          current, or error-free. Prices for our products are subject to change
          without notice. We reserve the right at any time to modify or
          discontinue the Service (or any part or content thereof) without
          notice at any time.
        </>
      ),
    },
    {
      title: "5. Shipping & Delivery",
      content: (
        <>
          We are committed to delivering your orders as swiftly as possible. Our
          standard delivery timelines are as follows:
          <br />
          <br />
          <ul
            style={{
              listStyleType: "disc",
              marginLeft: "1.5rem",
              marginTop: "0.5rem",
            }}
          >
            <li>
              <strong>Kerala:</strong> 2-3 business days
            </li>
            <li>
              <strong>South India:</strong> 3-6 business days
            </li>
            <li>
              <strong>North India:</strong> 7-10 business days
            </li>
          </ul>
          <br />
          Delivery times are estimates and commence from the date of shipping,
          rather than the date of order. We are not liable for delayed
          deliveries caused by third-party logistics partners, natural
          disasters, or situations beyond our control.
        </>
      ),
    },
    {
      title: "6. Returns, Refunds & Cancellations",
      content: (
        <>
          Customer satisfaction is our priority. Due to the hygienic nature of
          our products, returns or exchanges are only accepted in the case of
          manufacturing defects or incorrect items shipped. You must report any
          such issues within 48 hours of delivery with photographic evidence.
          Approved refunds will be processed to the original payment method
          within 5-7 business days. We reserve the right to refuse returns that
          do not meet these criteria.
        </>
      ),
    },
    {
      title: "7. Limitation of Liability",
      content: (
        <>
          In no event shall Rangrez Henna, nor its directors, employees,
          partners, agents, suppliers, or affiliates, be liable for any
          indirect, incidental, special, consequential or punitive damages,
          including without limitation, loss of profits, data, use, goodwill, or
          other intangible losses, resulting from (i) your access to or use of
          or inability to access or use the Service; (ii) any conduct or content
          of any third party on the Service; (iii) any content obtained from the
          Service; and (iv) unauthorized access, use or alteration of your
          transmissions or content.
        </>
      ),
    },
    {
      title: "8. Platform Protections & Indemnification",
      content: (
        <>
          You agree to defend, indemnify and hold harmless Rangrez Henna and its
          licensee and licensors, and their employees, contractors, agents,
          officers and directors, from and against any and all claims, damages,
          obligations, losses, liabilities, costs or debt, and expenses
          (including but not limited to attorney&apos;s fees), resulting from or
          arising out of a) your use and access of the Service, by you or any
          person using your account and password; b) a breach of these Terms, or
          c) Content posted on the Service.
        </>
      ),
    },
    {
      title: "9. Governing Law",
      content: (
        <>
          These Terms shall be governed and construed in accordance with the
          laws of India, specifically the jurisdiction of Kerala, without regard
          to its conflict of law provisions. Our failure to enforce any right or
          provision of these Terms will not be considered a waiver of those
          rights.
        </>
      ),
    },
    {
      title: "10. Contact Us",
      content: (
        <>
          If you have any questions about these Terms, the practices of this
          platform, or your dealings with this website, please contact us at:{" "}
          <strong>rangrezstencils@gmail.com</strong>.
        </>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--cl-bg)",
        color: "var(--cl-text)",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          background: "var(--cl-primary)",
          color: "var(--cl-bg)",
          padding: "8rem 2rem 4rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "10%",
            left: "20%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,168,83,0.15), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <h1
          className="title-massive"
          style={{ position: "relative", zIndex: 2, marginBottom: "1rem" }}
        >
          Terms & Conditions
        </h1>
        <p
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: "1.2rem",
            maxWidth: "600px",
            margin: "0 auto",
            opacity: 0.9,
          }}
        >
          Please read these terms carefully before using our platform.
        </p>
      </section>

      {/* Content Section */}
      <section
        style={{
          padding: "5rem 2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "4rem",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
          {/* Sidebar / TOC */}
          <aside
            style={{
              flex: "1 1 250px",
              position: "sticky",
              top: "120px",
              height: "fit-content",
              padding: "2rem",
              background: "var(--cl-surface)",
              borderRadius: "var(--radius-md)",
              border: "var(--border-thin)",
              boxShadow: "var(--shadow-brutal-sm)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.8rem",
                color: "var(--cl-primary)",
                marginBottom: "1.5rem",
                borderBottom: "1px solid var(--cl-muted)",
                paddingBottom: "0.5rem",
              }}
            >
              Contents
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              {sections.map((section, index) => (
                <li key={index}>
                  <a
                    href={`#section-${index}`}
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: "var(--cl-text)",
                      opacity: 0.7,
                      textDecoration: "none",
                      transition: "var(--transition-snap)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = "1";
                      e.target.style.color = "var(--cl-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = "0.7";
                      e.target.style.color = "var(--cl-text)";
                    }}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <div
            style={{
              flex: "3 1 600px",
              padding: "3rem",
              background: "var(--cl-surface)",
              border: "var(--border-thick)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-brutal)",
            }}
          >
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.8,
                marginBottom: "3rem",
                opacity: 0.6,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "3rem",
              }}
            >
              {sections.map((section, index) => (
                <div
                  key={index}
                  id={`section-${index}`}
                  style={{ scrollMarginTop: "120px" }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "2.5rem",
                      marginBottom: "1rem",
                      color: "var(--cl-primary)",
                      letterSpacing: "-0.02em",
                      lineHeight: "1.1",
                    }}
                  >
                    {section.title}
                  </h2>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      fontWeight: 400,
                      color: "var(--cl-text)",
                      opacity: 0.85,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "5rem",
                paddingTop: "2rem",
                borderTop: "var(--border-thin)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  opacity: 0.8,
                }}
              >
                By using Rangrez Henna, you acknowledge that you have read,
                understood, and agree to be bound by these Legal Terms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
