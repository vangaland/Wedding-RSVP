import { useState, useEffect } from "react";

const PALETTE = {
  primary: "#D0A0A3",
  secondary: "#E0C5C4",
  light: "#F5E2E3",
  cream: "#fdf8f4",
  dark: "#3d2314",
  muted: "#A67C7A",
  bg: "#f0ebe3",
};
const SHEET_URL = "https://script.google.com/macros/s/AKfycbwsFoeQig1O6ridWFxHxJKstaFRLFklAG10xazTHWsY1Ior8eee7WXNH7oNZPb6Da06/exec";

const initialForm = {
  name: "", email: "", phone: "", attending: "",
  guests: 1, dietary: "", city: "", events: "", message: "",
};

export default function App() {
  const [view, setView] = useState("rsvp");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("admin")) setIsAdminMode(true);
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.attending) { setError("Please fill in your name and RSVP response."); return; }
    if (!form.email && !form.phone) { setError("Please provide at least an email or phone number."); return; }
    if (form.attending === "yes" && !form.events) { setError("Please select which events you'll be attending."); return; }
    setError("");
    setLoading(true);
    try {
      await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    border: `1px solid ${PALETTE.secondary}`,
    background: "#fff", fontFamily: "Georgia, serif",
    fontSize: 14, color: PALETTE.dark,
    outline: "none", borderRadius: 2, boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: 11, letterSpacing: 2,
    color: PALETTE.muted, textTransform: "uppercase", marginBottom: 6,
  };

  const eventOptions = [
    { val: "morning", label: "🌅 Morning Ceremony", sub: "Starts at 7:30 AM" },
    { val: "reception", label: "🥂 Reception Dinner", sub: "Starts at 5:30 PM" },
    { val: "both", label: "✨ Both Events", sub: "Full day celebration" },
  ];

  return (
    <div style={{ fontFamily: "Georgia, serif", minHeight: "100vh", background: PALETTE.bg, paddingBottom: 60 }}>

      {/* HEADER */}
      <div style={{ background: PALETTE.cream, borderBottom: `3px solid ${PALETTE.primary}`, textAlign: "center", padding: "36px 20px 28px" }}>
        <div style={{ fontSize: 11, letterSpacing: 5, color: PALETTE.muted, textTransform: "uppercase", marginBottom: 10 }}>You're invited</div>
        <div style={{ fontSize: 42, color: PALETTE.dark, fontWeight: 300, lineHeight: 1.15 }}>
          Ruchita <span style={{ color: PALETTE.primary, fontStyle: "italic", fontSize: 26 }}>&</span> Shivang
        </div>
        <div style={{ fontSize: 13, color: PALETTE.muted, letterSpacing: 3, textTransform: "uppercase", marginTop: 10 }}>
          14 December 2026 · Valura, Bangalore
        </div>
        {isAdminMode && (
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 12 }}>
            {["rsvp", "admin"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "7px 22px",
                background: view === v ? PALETTE.primary : "transparent",
                color: view === v ? "#fff" : PALETTE.muted,
                border: `1px solid ${PALETTE.primary}`, borderRadius: 2,
                cursor: "pointer", fontSize: 12, letterSpacing: 2,
                textTransform: "uppercase", fontFamily: "Georgia, serif",
              }}>
                {v === "rsvp" ? "RSVP" : "Admin"}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px 0" }}>

        {/* RSVP FORM */}
        {view === "rsvp" && !submitted && (
          <div style={{ background: PALETTE.cream, border: `1px solid ${PALETTE.secondary}`, padding: "40px 36px", borderRadius: 4 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 22, color: PALETTE.dark, marginBottom: 6 }}>Kindly RSVP</div>
              <div style={{ fontSize: 13, color: PALETTE.muted, fontStyle: "italic" }}>Please respond by 1st November 2026</div>
            </div>

            {[
              { label: "Full Name *", key: "name", type: "text", placeholder: "Your full name" },
              { label: "Email", key: "email", type: "email", placeholder: "your@email.com" },
              { label: "Phone", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
              { label: "City you're travelling from", key: "city", type: "text", placeholder: "e.g. Mumbai, Delhi..." },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: 20 }}>
                <label style={labelStyle}>{label}</label>
                <input type={type} placeholder={placeholder} value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle} />
              </div>
            ))}

            {/* Attending */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Will you be attending? *</label>
              <div style={{ display: "flex", gap: 12 }}>
                {[{ val: "yes", label: "Joyfully accepts" }, { val: "no", label: "Regretfully declines" }].map(({ val, label }) => (
                  <button key={val} onClick={() => setForm({ ...form, attending: val, events: "" })} style={{
                    flex: 1, padding: "12px 10px",
                    background: form.attending === val ? PALETTE.primary : "#fff",
                    color: form.attending === val ? "#fff" : PALETTE.muted,
                    border: `1px solid ${form.attending === val ? PALETTE.primary : PALETTE.secondary}`,
                    cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif",
                    fontStyle: "italic", borderRadius: 2,
                  }}>{label}</button>
                ))}
              </div>
            </div>

            {form.attending === "yes" && (
              <>
                {/* Events */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Which events will you be attending? *</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {eventOptions.map(({ val, label, sub }) => (
                      <button key={val} onClick={() => setForm({ ...form, events: val })} style={{
                        padding: "14px 18px",
                        background: form.events === val ? PALETTE.light : "#fff",
                        color: PALETTE.dark,
                        border: `1px solid ${form.events === val ? PALETTE.primary : PALETTE.secondary}`,
                        cursor: "pointer", fontFamily: "Georgia, serif",
                        borderRadius: 2, textAlign: "left",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}>
                        <span style={{ fontSize: 14 }}>{label}</span>
                        <span style={{ fontSize: 11, color: PALETTE.muted, fontStyle: "italic" }}>{sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guests */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Number of guests (including yourself)</label>
                  <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} style={inputStyle}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {/* Dietary */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Dietary preferences / restrictions</label>
                  <input type="text" placeholder="e.g. Vegetarian, Vegan, Nut allergy..."
                    value={form.dietary} onChange={e => setForm({ ...form, dietary: e.target.value })} style={inputStyle} />
                </div>
              </>
            )}

            {/* Message */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>A message for the couple (optional)</label>
              <textarea placeholder="Share your wishes..." value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            {error && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 16, textAlign: "center" }}>{error}</div>}

            <button onClick={handleSubmit} disabled={loading} style={{
              width: "100%", padding: "14px", background: PALETTE.primary, color: "#fff",
              border: "none", cursor: "pointer", fontSize: 12, letterSpacing: 3,
              textTransform: "uppercase", fontFamily: "Georgia, serif", borderRadius: 2,
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Submitting..." : "Submit RSVP"}
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {view === "rsvp" && submitted && (
          <div style={{ background: PALETTE.cream, border: `1px solid ${PALETTE.secondary}`, padding: "60px 36px", borderRadius: 4, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🤍</div>
            <div style={{ fontSize: 24, color: PALETTE.dark, marginBottom: 12 }}>
              {form.attending === "yes" ? "See you there!" : "We'll miss you!"}
            </div>
            <div style={{ fontSize: 14, color: PALETTE.muted, fontStyle: "italic", lineHeight: 1.8 }}>
              {form.attending === "yes"
                ? `Thank you ${form.name}! We're so excited to celebrate with you on December 14th at Valura, Bangalore.`
                : `Thank you ${form.name} for letting us know. We'll be thinking of you on our special day.`}
            </div>
            {form.attending === "yes" && form.events && (
              <div style={{ marginTop: 16, padding: "12px 20px", background: PALETTE.light, borderRadius: 2, fontSize: 13, color: PALETTE.dark }}>
                You're joining us for: <strong>
                  {form.events === "morning" ? "Morning Ceremony 🌅" :
                   form.events === "reception" ? "Reception Dinner 🥂" :
                   "Both Events ✨"}
                </strong>
              </div>
            )}
            <div style={{ marginTop: 28, fontSize: 13, color: PALETTE.primary, fontStyle: "italic" }}>— Ruchita & Shivang</div>
            <button onClick={() => { setSubmitted(false); setForm(initialForm); }} style={{
              marginTop: 28, padding: "10px 24px", background: "transparent", color: PALETTE.muted,
              border: `1px solid ${PALETTE.secondary}`, cursor: "pointer", fontSize: 11,
              letterSpacing: 2, textTransform: "uppercase", fontFamily: "Georgia, serif", borderRadius: 2,
            }}>
              Submit another RSVP
            </button>
          </div>
        )}

        {/* ADMIN - points to Google Sheet */}
        {view === "admin" && (
          <div style={{ background: PALETTE.cream, border: `1px solid ${PALETTE.secondary}`, padding: "50px 36px", borderRadius: 4, textAlign: "center" }}>
            <div style={{ fontSize: 18, color: PALETTE.dark, marginBottom: 8 }}>Admin Dashboard</div>
            <div style={{ fontSize: 13, color: PALETTE.muted, fontStyle: "italic", marginBottom: 28 }}>All RSVPs are collected in your Google Sheet</div>
            <a href="https://docs.google.com/spreadsheets" target="_blank" rel="noreferrer" style={{
              display: "inline-block", padding: "14px 32px",
              background: PALETTE.primary, color: "#fff",
              textDecoration: "none", fontSize: 12, letterSpacing: 3,
              textTransform: "uppercase", fontFamily: "Georgia, serif", borderRadius: 2,
            }}>
              Open Google Sheet →
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
