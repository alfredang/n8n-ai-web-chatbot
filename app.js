// Webhook URL priority:
// 1) ?webhook=... query param
// 2) localStorage.webhookUrl
// 3) local n8n default
const queryWebhook = new URLSearchParams(window.location.search).get("webhook");
const WEBHOOK_URL =
  queryWebhook ||
  localStorage.getItem("webhookUrl") ||
  "https://n8n.srv923061.hstgr.cloud/webhook/ai-chatbot";

const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");

function addMessage(text, who) {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function askBot(message) {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  // If your webhook returns non-JSON error, read it safely
  const raw = await res.text();

  if (!res.ok) {
    throw new Error(`Webhook error ${res.status}: ${raw}`);
  }

  // Try parse JSON
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    // If webhook returns plain text
    return raw || "No response received from webhook.";
  }

  // Expecting { reply: "..." } from Respond to Webhook node
  return data.reply || data.response || data.answer || JSON.stringify(data) || "No response received from webhook.";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  // typing placeholder
  addMessage("Typing...", "bot");

  try {
    const reply = await askBot(msg);
    chat.lastChild.textContent = reply; // replace "Typing..."
  } catch (err) {
    chat.lastChild.textContent = `Error: ${err.message}`;
  }
});
