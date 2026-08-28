// =============================================
// KNOWLEDGE BASE — HM Fitness Gym
// =============================================
const SYSTEM_PROMPT = `You are a friendly, motivating, and helpful AI assistant for HM Fitness, a premier gym located in Pratap Nagar, Jaipur. Answer member and visitor queries conversationally, concisely, and accurately.

Gym Details:
- Name: HM Fitness (HM Fitness Gym)
- Location: HM FITNESS GYM, Pratap Nagar, Jaipur, Rajasthan, India
- Phone: +91 70452 92099 / +91 75979 78719
- Email: info@hmfitness.in / hmfitness@gmail.com
- Google Maps Location: Pratap Nagar, Jaipur

Gym Hours:
- Monday to Saturday: 5:30 AM – 12:00 PM & 4:30 PM – 10:00 PM
- Sunday: 7:00 AM – 12:00 PM

Membership Plans & Pricing:
1. 1 Month Plan: ₹2,000 per month (Full gym access, basic fitness assessment)
2. 3 Month Plan: ₹5,000 (₹1,667/mo, Full gym access, 1 free PT session, save 17%)
3. 6 Month Plan (Most Popular): ₹8,000 (₹1,333/mo, Full gym access, 3 free PT sessions, diet consultation, save 33%)
4. 1 Year Plan (Best Value): ₹13,000 (₹1,083/mo, Full gym access, 6 free PT sessions, diet & workout plan, save 46%)

Training Styles & Programs:
- Weight Training: Barbells, dumbbells, squat racks, plate loaded equipment for strength & muscle building
- Cardio: Treadmills, spin bikes, rowers, and ellipticals to boost stamina & burn calories
- Zumba: High-energy dance-driven cardio workouts
- Calisthenics: Bodyweight mastery with pull-ups, dips, and core exercises
- Functional Training: Kettlebells, battle ropes, plyometric boxes, resistance bands, TRX
- Yoga: Guided sessions for flexibility, balance, and breath control
- HIIT: High-intensity interval training for fast conditioning and calorie torching

Special Offers:
- Free Trial available for new visitors (contact via form or call)
- Certified personal trainers available on the floor

Rules:
- Only answer questions related to HM Fitness gym, memberships, equipment, training, and fitness services
- Keep replies short, encouraging, and clear
- For joining or booking a free trial, direct them to call +91 70452 92099 or fill out the contact form
- Do not make up any pricing or details not listed above`;

// =============================================
// MODELS — fallback chain for reliability
// =============================================
const MODELS = [
  "gemini-2.5-flash"
];

// =============================================
// CHATBOT LOGIC
// =============================================
const history = [];
const defaultChips = ["Plans & Pricing", "Gym Timings", "Training Styles", "Free Trial", "Location"];

function isChatOpen() {
  const popup = document.getElementById("chat-popup");
  return popup && popup.classList.contains("active");
}

function toggleChat() {
  const popup = document.getElementById("chat-popup");
  const toggleBtn = document.getElementById("chat-toggle-btn");
  const chatToolTip = document.getElementById("chat-tooltip");
  if (!popup) return;

  const willOpen = !popup.classList.contains("active");

  if (willOpen) {
    popup.classList.add("active");
    popup.setAttribute("aria-hidden", "false");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "true");
    window.history.pushState({ modalType: "chat" }, "");
    const input = document.getElementById("chat-input");
    if (input) setTimeout(() => input.focus(), 150);
  } else {
    popup.classList.remove("active");
    popup.setAttribute("aria-hidden", "true");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
  }

  // Hide chat tooltip when opened or clicked
  if (chatToolTip) {
    chatToolTip.classList.add("fadeout");
    setTimeout(() => {
      chatToolTip.style.display = "none";
    }, 400);
  }
}

function closeChat() {
  const popup = document.getElementById("chat-popup");
  const toggleBtn = document.getElementById("chat-toggle-btn");
  if (!popup) return;
  popup.classList.remove("active");
  popup.setAttribute("aria-hidden", "true");
  if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
}

function addMsg(text, sender) {
  const win = document.getElementById("chat-window");
  if (!win) return;
  const div = document.createElement("div");
  div.className = `chat-msg ${sender}`;
  div.textContent = text;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

function showTyping() {
  const win = document.getElementById("chat-window");
  if (!win) return;
  const div = document.createElement("div");
  div.className = "chat-msg bot typing-indicator-msg";
  div.id = "typing-indicator";
  div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById("typing-indicator");
  if (t) t.remove();
}

function setChips(arr) {
  const c = document.getElementById("chat-chips");
  if (!c) return;
  c.innerHTML = "";
  arr.forEach(label => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = label;
    btn.onclick = () => sendMessage(label);
    c.appendChild(btn);
  });
}

async function callGemini(payload) {
  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://loquacious-alpaca-d88409.netlify.app//api/chat?model=${model}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      // Don't retry on auth errors
      if (res.status === 400 || res.status === 401 || res.status === 403) {
        throw new Error(`Auth error ${res.status}`);
      }

      // On 429 or 5xx, try the next model
      if (!res.ok) {
        console.warn(`${model} failed with ${res.status}, trying next...`);
        continue;
      }

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) return reply;

    } catch (err) {
      if (err.message && err.message.startsWith("Auth error")) throw err;
      console.warn(`${model} threw an error, trying next...`, err);
    }
  }
  return null;
}

async function sendMessage(text) {
  if (!text || !text.trim()) return;

  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");
  const chipsContainer = document.getElementById("chat-chips");

  if (input) input.value = "";
  if (sendBtn) sendBtn.disabled = true;
  if (chipsContainer) chipsContainer.innerHTML = "";

  addMsg(text, "user");
  history.push({ role: "user", content: text });
  showTyping();

  try {
    const reply = await callGemini({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: history.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }))
    });

    removeTyping();
    const finalReply = reply || "Sorry, I couldn't reach the server right now. Please call us at +91 70452 92099 or message us on WhatsApp!";
    addMsg(finalReply, "bot");
    if (reply) history.push({ role: "assistant", content: reply });

  } catch (err) {
    removeTyping();
    console.error("Chat error:", err);
    addMsg("Something went wrong. Please call us directly at +91 70452 92099.", "bot");
  }

  if (sendBtn) sendBtn.disabled = false;
  setChips(defaultChips);
}

function handleSend() {
  const input = document.getElementById("chat-input");
  if (!input) return;
  const val = input.value.trim();
  if (val) sendMessage(val);
}

function showChatTooltip() {
  const tooltip = document.getElementById("chat-tooltip");
  if (!tooltip) return;
  tooltip.classList.add("visible");
  window.setTimeout(() => {
    tooltip.classList.add("fadeout");
    window.setTimeout(() => {
      tooltip.style.display = "none";
    }, 400);
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");
  const toggleBtn = document.getElementById("chat-toggle-btn");
  const closeBtn = document.getElementById("chat-close-btn");

  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", handleSend);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleChat);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeChat);
  }

  // Handle popstate for mobile back button
  window.addEventListener("popstate", e => {
    if (isChatOpen()) {
      closeChat();
    }
  });

  // Handle escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && isChatOpen()) {
      closeChat();
    }
  });

  addMsg("Hi! I'm your HM Fitness assistant. Ask me anything about our membership plans, gym timings, training styles, or free trials!", "bot");
  setChips(defaultChips);
  showChatTooltip();
});
