"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { createClient } from "../../lib/supabase/client";
import { sendSupportMessage } from "../../lib/supabase/engagement";
import ScrollFloat from "../../components/ScrollFloat";

export default function Contact() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputData, setInputData] = useState({ email: "", message: "" });
  const scrollRef = useRef(null);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setInputData(prev => ({ ...prev, email: data.user.email }));
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputData.message.trim() || !inputData.email) return;

    setSending(true);
    
    // Optimistic UI
    const optimisticMsg = { id: Date.now(), text: inputData.message, isUser: true };
    setMessages(prev => [...prev, optimisticMsg]);
    const cachedMessage = inputData.message;
    setInputData(prev => ({ ...prev, message: "" }));

    const res = await sendSupportMessage({ email: inputData.email, message: cachedMessage });
    
    if (res.error) {
      alert("Failed to send: " + res.error);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now()+1, text: "Thanks for reaching out! A human will reply to your email shortly.", isUser: false }]);
      }, 1000);
    }
    setSending(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="border-b" style={{ padding: "3rem 2rem", textAlign: "center", background: "var(--cl-secondary)" }}>
        <h1 className="title-massive">Support Hub</h1>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", flex: 1 }}>
        {/* Info Sidebar */}
        <section className="border-r" style={{ flex: "1 1 400px", padding: "4rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <ScrollFloat>
            <h2 className="title-section" style={{ marginBottom: "2.5rem" }}>Get In Touch</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {[
                { icon: <Mail size={20} />, label: "Email", value: "rangrezstencils@gmail.com" },
                { icon: <Camera size={20} />, label: "Instagram", value: "@rangrez_henna_stencils" },
                { icon: <MapPin size={20} />, label: "Location", value: "Kochi, Kerala, India" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", border: "var(--border-thick)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-label">{item.label}</p>
                    <p style={{ fontSize: "1.15rem", marginTop: "0.2rem" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollFloat>
        </section>

        {/* Chat UI */}
        <section style={{ flex: "1 1 400px", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "var(--cl-surface)" }}>
          <div style={{ 
            width: "100%", maxWidth: "450px", height: "600px", border: "var(--border-thick)", 
            background: "var(--cl-bg)", display: "flex", flexDirection: "column",
            boxShadow: "var(--shadow-brutal)"
          }}>
            {/* Header */}
            <div style={{ padding: "1.2rem", borderBottom: "var(--border-thick)", display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--cl-primary)", color: "var(--cl-bg)", fontWeight: 700 }}>
              <MessageCircle size={24} />
              <span>Live Support</span>
            </div>

            {/* Chat Body */}
            <div data-lenis-prevent="true"  style={{}}>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", opacity: 0.5, marginTop: "2rem" }}>
                  <MessageCircle size={40} style={{ margin: "0 auto 1rem" }} />
                  <p>Send us a message and we'll reply to your email as soon as possible.</p>
                </div>
              ) : (
                messages.map((m) => (
                  <motion.div 
                    key={m.id} 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{
                      alignSelf: m.isUser ? "flex-end" : "flex-start",
                      background: m.isUser ? "var(--cl-secondary)" : "var(--cl-text)",
                      color: m.isUser ? "var(--cl-text)" : "var(--cl-bg)",
                      padding: "0.75rem 1.25rem",
                      borderRadius: "1rem",
                      borderBottomRightRadius: m.isUser ? "0" : "1rem",
                      borderBottomLeftRadius: !m.isUser ? "0" : "1rem",
                      maxWidth: "85%",
                      border: m.isUser ? "1px solid var(--cl-muted)" : "none",
                      fontSize: "0.95rem"
                    }}
                  >
                    {m.text}
                  </motion.div>
                ))
              )}
            </div>

            {/* Input Form */}
            <div style={{ padding: "1rem", borderTop: "var(--border-thick)", background: "var(--cl-secondary)" }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {!user && (
                  <input 
                    type="email" 
                    required 
                    placeholder="Your Email Address" 
                    className="input-field" 
                    style={{ padding: "0.6rem 1rem", fontSize: "0.9rem" }}
                    value={inputData.email}
                    onChange={e => setInputData({...inputData, email: e.target.value})}
                  />
                )}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input 
                    type="text" 
                    required 
                    placeholder="Type your message..." 
                    className="input-field" 
                    style={{ flex: 1, padding: "0.6rem 1rem" }}
                    value={inputData.message}
                    onChange={e => setInputData({...inputData, message: e.target.value})}
                  />
                  <button type="submit" disabled={sending} className="brutalist-button" style={{ padding: "0 1rem", minWidth: "50px" }}>
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
