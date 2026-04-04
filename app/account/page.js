"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Account() {
  const [activeTab, setActiveTab] = useState("Details");

  const tabs = ["Details", "Orders", "Settings"];

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
          My Account
        </h1>
      </div>

      <div
        className="container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          flex: 1,
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {/* Sidebar Nav */}
        <aside
          style={{
            flex: "0 0 250px",
            padding: "4rem 2rem 4rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                textAlign: "left",
                padding: "1rem",
                fontSize: "1.2rem",
                textTransform: "uppercase",
                fontWeight: activeTab === tab ? "700" : "400",
                backgroundColor:
                  activeTab === tab ? "var(--cl-primary)" : "transparent",
                color: activeTab === tab ? "var(--cl-bg)" : "var(--cl-text)",
                border: activeTab === tab ? "var(--border-thick)" : "none",
                borderLeft:
                  activeTab !== tab
                    ? "3px solid transparent"
                    : "var(--border-thick)",
                transition: "all 0.2s",
              }}
            >
              {tab}
            </button>
          ))}
          <button
            style={{
              textAlign: "left",
              padding: "1rem",
              fontSize: "1.2rem",
              textTransform: "uppercase",
              marginTop: "auto",
              opacity: 0.6,
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            }}
          >
            Log Out
          </button>
        </aside>

        {/* Content Area */}
        <main
          className="border-l"
          style={{
            flex: "1 1 500px",
            padding: "4rem",
            backgroundColor: "var(--cl-bg)",
          }}
        >
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2
              style={{
                fontSize: "3rem",
                marginBottom: "3rem",
                textTransform: "uppercase",
              }}
            >
              {activeTab}
            </h2>

            {/* DETAILS TAB */}
            {activeTab === "Details" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3rem",
                  maxWidth: "600px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: "0.85rem",
                        opacity: 0.7,
                        textTransform: "uppercase",
                        fontWeight: "600",
                      }}
                    >
                      First Name
                    </label>
                    <p
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "500",
                        marginTop: "0.25rem",
                      }}
                    >
                      Jane
                    </p>
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "0.85rem",
                        opacity: 0.7,
                        textTransform: "uppercase",
                        fontWeight: "600",
                      }}
                    >
                      Last Name
                    </label>
                    <p
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "500",
                        marginTop: "0.25rem",
                      }}
                    >
                      Doe
                    </p>
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "0.85rem",
                      opacity: 0.7,
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    Email
                  </label>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "500",
                      marginTop: "0.25rem",
                    }}
                  >
                    jane.doe@example.com
                  </p>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "0.85rem",
                      opacity: 0.7,
                      textTransform: "uppercase",
                      fontWeight: "600",
                    }}
                  >
                    Shipping Address
                  </label>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "500",
                      marginTop: "0.25rem",
                      lineHeight: "1.5",
                    }}
                  >
                    123 Malabar Street, Apt 4B
                    <br />
                    Brooklyn, NY 11201
                  </p>
                </div>
                <button
                  className="btn-primary"
                  style={{ alignSelf: "flex-start", marginTop: "1rem" }}
                >
                  Edit Details
                </button>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "Orders" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                {[
                  {
                    id: "#20491",
                    date: "April 2, 2026",
                    total: "₹1499",
                    status: "Delivered",
                  },
                  {
                    id: "#20388",
                    date: "March 15, 2026",
                    total: "₹2450",
                    status: "Delivered",
                  },
                  {
                    id: "#19842",
                    date: "Jan 10, 2026",
                    total: "₹499",
                    status: "Processing",
                  },
                ].map((order, idx) => (
                  <div
                    key={idx}
                    className="border-t border-b border-l border-r"
                    style={{
                      padding: "2rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor:
                        idx % 2 === 0 ? "var(--cl-bg)" : "var(--cl-secondary)",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                        Order {order.id}
                      </h3>
                      <p style={{ opacity: 0.8, marginTop: "0.5rem" }}>
                        {order.date}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                        {order.total}
                      </p>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "0.5rem",
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.85rem",
                          textTransform: "uppercase",
                          backgroundColor:
                            order.status === "Delivered"
                              ? "var(--cl-text)"
                              : "var(--cl-primary)",
                          color: "var(--cl-bg)",
                          fontWeight: "600",
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "Settings" && (
              <div
                style={{
                  maxWidth: "600px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "3rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                    Change Password
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <input
                      type="password"
                      placeholder="Current Password"
                      style={{
                        padding: "1rem",
                        fontSize: "1rem",
                        border: "var(--border-thick)",
                        backgroundColor: "transparent",
                        color: "var(--cl-text)",
                        fontFamily: "var(--font-body)",
                      }}
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      style={{
                        padding: "1rem",
                        fontSize: "1rem",
                        border: "var(--border-thick)",
                        backgroundColor: "transparent",
                        color: "var(--cl-text)",
                        fontFamily: "var(--font-body)",
                      }}
                    />
                    <button
                      className="btn-primary"
                      style={{ alignSelf: "flex-start", marginTop: "1rem" }}
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="border-t" style={{ paddingTop: "2rem" }}>
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                    Email Preferences
                  </h3>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      cursor: "pointer",
                      marginBottom: "1rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      style={{
                        accentColor: "var(--cl-primary)",
                        width: "1.2rem",
                        height: "1.2rem",
                        border: "var(--border-thick)",
                      }}
                    />
                    <span style={{ fontSize: "1rem", fontWeight: "400" }}>
                      Receive marketing and promotional emails
                    </span>
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      style={{
                        accentColor: "var(--cl-primary)",
                        width: "1.2rem",
                        height: "1.2rem",
                        border: "var(--border-thick)",
                      }}
                    />
                    <span style={{ fontSize: "1rem", fontWeight: "400" }}>
                      Receive order status updates via SMS
                    </span>
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
