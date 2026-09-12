// App.jsx - Paste this into src/App.jsx in your GitHub repo

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

const SHEET_URL = "https://script.google.com/macros/s/AKfycbwWkB-CnBQu0WVkGMHdSLJyVZmZmNWDs1Yc8sSQwFMTH4Ffc79RmDdlu5ZbF2q4utLh/exec";

const initialForm = {
  name: "", email: "", phone: "", attending: "",
  guests: 1, dietary: "", city: "", message: "",
};

export default function App() {
  const [view, setView] = useState("rsvp");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rsvps, setRsvps] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [adminCode, setAdminCode] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const ADMIN_CODE = "shivli2026"; // Change this to whatever you want

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("admin")) setIsAdminMode(true);
  }, []);

  useEffect(() => {}, []);

  const handleSubmit = async () => {
    if (!form.name || !form.attending) { setError("Please fill in your name and RSVP response."); return; }
    if (!form.email && !form.phone) { setError("Please provide at least an email or phone number."); return; }
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

  const attending = rsvps.filter(r => r.attending === "yes");
  const notAttending = rsvps.filter(r => r.attending === "no");
  const totalGuests = attending.reduce((s, r) => s + Number(r.guests || 1), 0);
  const filtered = filter === "all" ? rsvps : filter === "yes" ? attending : notAttending;

  const exportCSV = () => {
    const headers = ["Name","Email","Phone","Attending","Guests","Dietary","City","Message","Submitted"];
    const rows = rsvps.map(r => [r.name,r.email,r.phone,r.attending,r.guests,r.dietary,r.city,r.message,new Date(r.timestamp).toLocaleString()]);
    const csv = [headers,...rows].map(r => r.map(c => `"${c||""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "rsvps.csv"; a.click();
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

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Will you be attending? *</label>
              <div style={{ display: "flex", gap: 12 }}>
                {[{ val: "yes", label: "Joyfully accepts" }, { val: "no", label: "Regretfully declines" }].map(({ val, label }) => (
                  <button key={val} onClick={() => setForm({ ...form, attending: val })} style={{
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
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Number of guests (including yourself)</label>
                  <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} style={inputStyle}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Dietary preferences / restrictions</label>
                  <input type="text" placeholder="e.g. Vegetarian, Vegan, Nut allergy..."
                    value={form.dietary} onChange={e => setForm({ ...form, dietary: e.target.value })} style={inputStyle} />
                </div>
              </>
            )}

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

        {/* ADMIN LOGIN */}
        {view === "admin" && !adminUnlocked && (
          <div style={{ background: PALETTE.cream, border: `1px solid ${PALETTE.secondary}`, padding: "50px 36px", borderRadius: 4, textAlign: "center" }}>
            <div style={{ fontSize: 18, color: PALETTE.dark, marginBottom: 8 }}>Admin Access</div>
            <div style={{ fontSize: 13, color: PALETTE.muted, fontStyle: "italic", marginBottom: 24 }}>Enter the admin code to view RSVPs</div>
            <input type="password" placeholder="Admin code" value={adminCode}
              onChange={e => setAdminCode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && adminCode === ADMIN_CODE && setAdminUnlocked(true)}
              style={{ ...inputStyle, marginBottom: 16 }} />
            <button onClick={() => { if (adminCode === ADMIN_CODE) { setAdminUnlocked(true); setError(""); } else setError("Wrong code."); }} style={{
              width: "100%", padding: "12px", background: PALETTE.primary, color: "#fff",
              border: "none", cursor: "pointer", fontSize: 12, letterSpacing: 3,
              textTransform: "uppercase", fontFamily: "Georgia, serif", borderRadius: 2,
            }}>Enter</button>
            {error && <div style={{ color: "#c0392b", fontSize: 13, marginTop: 12 }}>{error}</div>}
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {view === "admin" && adminUnlocked && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Total RSVPs", value: rsvps.length },
                { label: "Attending", value: attending.length },
                { label: "Total Guests", value: totalGuests },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: PALETTE.cream, border: `1px solid ${PALETTE.secondary}`, padding: "20px 16px", borderRadius: 4, textAlign: "center" }}>
                  <div style={{ fontSize: 32, color: PALETTE.primary, fontWeight: 600 }}>{value}</div>
                  <div style={{ fontSize: 10, color: PALETTE.muted, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              {["all","yes","no"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: "7px 18px",
                  background: filter === f ? PALETTE.primary : "transparent",
                  color: filter === f ? "#fff" : PALETTE.muted,
                  border: `1px solid ${PALETTE.primary}`, cursor: "pointer",
                  fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                  fontFamily: "Georgia, serif", borderRadius: 2,
                }}>
                  {f === "all" ? "All" : f === "yes" ? "Attending" : "Not Attending"}
                </button>
              ))}
              <button onClick={exportCSV} style={{
                marginLeft: "auto", padding: "7px 18px", background: PALETTE.dark, color: "#fff",
                border: "none", cursor: "pointer", fontSize: 11, letterSpacing: 2,
                textTransform: "uppercase", fontFamily: "Georgia, serif", borderRadius: 2,
              }}>Export CSV</button>
              <button onClick={loadRsvps} style={{
                padding: "7px 18px", background: "transparent", color: PALETTE.muted,
                border: `1px solid ${PALETTE.secondary}`, cursor: "pointer", fontSize: 11,
                letterSpacing: 2, textTransform: "uppercase", fontFamily: "Georgia, serif", borderRadius: 2,
              }}>Refresh</button>
            </div>

            {adminLoading ? (
              <div style={{ textAlign: "center", color: PALETTE.muted, padding: 40, fontStyle: "italic" }}>Loading RSVPs...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", color: PALETTE.muted, padding: 40, fontStyle: "italic" }}>No RSVPs yet.</div>
            ) : filtered.map(r => (
              <div key={r.id} style={{
                background: PALETTE.cream, border: `1px solid ${PALETTE.secondary}`,
                borderLeft: `4px solid ${r.attending === "yes" ? PALETTE.primary : "#ccc"}`,
                padding: "20px 24px", borderRadius: 4, marginBottom: 12,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 18, color: PALETTE.dark, marginBottom: 4 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: PALETTE.muted }}>
                      {r.email && <span style={{ marginRight: 12 }}>✉ {r.email}</span>}
                      {r.phone && <span>📞 {r.phone}</span>}
                    </div>
                  </div>
                  <div style={{
                    padding: "4px 14px", borderRadius: 20, fontSize: 11, letterSpacing: 1,
                    textTransform: "uppercase", fontFamily: "Georgia, serif",
                    background: r.attending === "yes" ? PALETTE.light : "#f0f0f0",
                    color: r.attending === "yes" ? PALETTE.primary : "#999",
                    border: `1px solid ${r.attending === "yes" ? PALETTE.primary : "#ddd"}`,
                  }}>
                    {r.attending === "yes" ? "✓ Attending" : "✗ Not Attending"}
                  </div>
                </div>
                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
                  {r.attending === "yes" && <div style={{ fontSize: 12, color: PALETTE.muted }}><span style={{ color: PALETTE.dark }}>Guests:</span> {r.guests}</div>}
                  {r.city && <div style={{ fontSize: 12, color: PALETTE.muted }}><span style={{ color: PALETTE.dark }}>From:</span> {r.city}</div>}
                  {r.dietary && <div style={{ fontSize: 12, color: PALETTE.muted }}><span style={{ color: PALETTE.dark }}>Dietary:</span> {r.dietary}</div>}
                  <div style={{ fontSize: 11, color: "#bbb" }}>{new Date(r.timestamp).toLocaleString("en-IN")}</div>
                </div>
                {r.message && (
                  <div style={{
                    marginTop: 12, padding: "10px 14px", background: PALETTE.light, borderRadius: 2,
                    fontSize: 13, color: PALETTE.dark, fontStyle: "italic",
                    borderLeft: `2px solid ${PALETTE.primary}`,
                  }}>
                    "{r.message}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
