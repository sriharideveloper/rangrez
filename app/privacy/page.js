"use client";

import { motion } from "framer-motion";
import ScrollFloat from "../../components/ScrollFloat";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Introduction",
      content: (
        <>
          Welcome to Rangrez Henna. We respect your privacy and are committed to
          protecting your personal data. This privacy policy will inform you as
          to how we look after your personal data when you visit our website
          (regardless of where you visit it from) and tell you about your
          privacy rights and how the law protects you and our business.
        </>
      ),
    },
    {
      title: "2. The Data We Collect About You",
      content: (
        <>
          Personal data, or personal information, means any information about an
          individual from which that person can be identified. We may collect,
          use, store and transfer different kinds of personal data about you
          which we have grouped together follows:
          <br />
          <br />
          <ul style={{ listStyleType: "disc", marginLeft: "1.5rem" }}>
            <li>
              <strong>Identity Data:</strong> includes first name, last name,
              username or similar identifier.
            </li>
            <li>
              <strong>Contact Data:</strong> includes billing address, delivery
              address, email address and telephone numbers.
            </li>
            <li>
              <strong>Financial Data:</strong> includes payment card details
              (processed securely via our third-party payment gateways like
              Razorpay; we do not store this data on our servers).
            </li>
            <li>
              <strong>Transaction Data:</strong> includes details about payments
              to and from you and other details of products you have purchased
              from us.
            </li>
            <li>
              <strong>Technical & Usage Data:</strong> includes internet
              protocol (IP) address, browser type and version, time zone
              setting, operating system and platform, and information about how
              you use our website.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "3. How We Use Your Personal Data",
      content: (
        <>
          We will only use your personal data when the law allows us to. Most
          commonly, we will use your personal data in the following
          circumstances:
          <br />
          <br />
          <ul style={{ listStyleType: "disc", marginLeft: "1.5rem" }}>
            <li>
              Where we need to perform the contract we are about to enter into
              or have entered into with you (e.g., processing and delivering
              your orders).
            </li>
            <li>
              Where it is necessary for our legitimate interests (or those of a
              third party) and your interests and fundamental rights do not
              override those interests (e.g., to keep our website updated and
              relevant, to study how customers use our products).
            </li>
            <li>
              Where we need to comply with a legal or regulatory obligation.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Data Sharing & Third-Party Protections",
      content: (
        <>
          We may have to share your personal data with the parties set out below
          for the purposes set out in Section 3:
          <br />
          <br />
          <ul style={{ listStyleType: "disc", marginLeft: "1.5rem" }}>
            <li>
              <strong>Service Providers:</strong> Acting as processors who
              provide IT and system administration services, delivery logistics,
              and secure payment processing (e.g., Razorpay, Supabase).
            </li>
            <li>
              <strong>Professional Advisers:</strong> Including lawyers,
              bankers, auditors, and insurers who provide necessary consultancy
              and legal services.
            </li>
            <li>
              <strong>Regulatory Authorities:</strong> Who require reporting of
              processing activities in certain circumstances to protect our
              business operations.
            </li>
          </ul>
          <br />
          We require all third parties to respect the security of your personal
          data and to treat it in accordance with the law.
        </>
      ),
    },
    {
      title: "5. Data Security",
      content: (
        <>
          We have put in place appropriate security measures to prevent your
          personal data from being accidentally lost, used, or accessed in an
          unauthorized way, altered, or disclosed. In addition, we limit access
          to your personal data to those employees, agents, contractors, and
          other third parties who have a business need to know. They will only
          process your personal data on our instructions and they are subject to
          a duty of confidentiality.
        </>
      ),
    },
    {
      title: "6. Data Retention",
      content: (
        <>
          We will only retain your personal data for as long as necessary to
          fulfill the purposes we collected it for, including for the purposes
          of satisfying any legal, accounting, or reporting requirements. To
          determine the appropriate retention period for personal data, we
          consider the amount, nature, and sensitivity of the personal data, the
          potential risk of harm from unauthorized use or disclosure, and
          whether we can achieve our purposes through other means.
        </>
      ),
    },
    {
      title: "7. Your Legal Rights",
      content: (
        <>
          Under certain circumstances, you have rights under data protection
          laws in relation to your personal data. These include the right to
          request access to your personal data, request correction, request
          erasure, object to processing, request restriction of processing, and
          request transfer of your personal data.
          <br />
          <br />
          If you wish to exercise any of the rights set out above, please
          contact us. Please note that we may need to request specific
          information from you to help us confirm your identity and ensure your
          right to access your personal data (or to exercise any of your other
          rights).
        </>
      ),
    },
    {
      title: "8. Cookies",
      content: (
        <>
          You can set your browser to refuse all or some browser cookies, or to
          alert you when websites set or access cookies. If you disable or
          refuse cookies, please note that some parts of this website may become
          inaccessible or not function properly.
        </>
      ),
    },
    {
      title: "9. Contact Us",
      content: (
        <>
          If you have any questions about this Privacy Policy, including any
          requests to exercise your legal rights, please contact our data
          grievance officer using the details set out below:
          <br />
          <br />
          <strong>Email Address:</strong> rangrezstencils@gmail.com
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
          background: "var(--cl-secondary)",
          color: "var(--cl-surface)",
          padding: "8rem 2rem 4rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -40, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "20%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <h1
          className="title-massive"
          style={{
            position: "relative",
            zIndex: 2,
            marginBottom: "1rem",
            color: "var(--cl-surface)",
          }}
        >
          Privacy Policy
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
          How we handle, protect, and respect your data.
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
                color: "var(--cl-secondary)",
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
                    href={`#privacy-section-${index}`}
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
                      e.target.style.color = "var(--cl-secondary)";
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
              Effective Date:{" "}
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
                gap: "4rem",
              }}
            >
              {sections.map((section, index) => (
                <div
                  key={index}
                  id={`privacy-section-${index}`}
                  style={{ scrollMarginTop: "120px" }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "2.5rem",
                      marginBottom: "1.2rem",
                      color: "var(--cl-secondary)",
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
                Your privacy is fundamentally important to us.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
