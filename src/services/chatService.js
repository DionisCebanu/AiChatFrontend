// src/services/chatService.js
export const API_URL = import.meta?.env?.VITE_API_URL || "/chat";

const LS_API_SESSION = "api_session_id";

function getApiSessionId() {
  try {
    return localStorage.getItem(LS_API_SESSION) || "";
  } catch {
    return "";
  }
}
function setApiSessionId(id) {
  try {
    if (id) localStorage.setItem(LS_API_SESSION, id);
  } catch {}
}

// Backward-compatible signature: sendMessage("hi") OR sendMessage({ message, sessionId })
export async function sendMessage(input) {
  const payload = typeof input === "string" ? { message: input } : input || {};
  const message = (payload.message || "").trim();
  if (!message) throw new Error("Message is empty.");

  const sid = payload.sessionId || getApiSessionId();

  // 20s timeout
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 20_000);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sid || undefined }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `HTTP ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`
      );
    }

    const data = await res.json(); // { session_id, message, reply }
    if (data?.session_id) setApiSessionId(data.session_id);
    return data;
  } finally {
    clearTimeout(t);
  }
}
