// src/services/chatService.js
const PROD_DEFAULT_API = "https://ai-chat-hbt3.onrender.com/chat";
const isLocalhost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

export const API_URL =
  (import.meta?.env?.VITE_API_URL && String(import.meta.env.VITE_API_URL)) ||
  (isLocalhost ? "/chat" : PROD_DEFAULT_API);
let LOGGED_API_ONCE = false;

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

    // one-time env log
  /* if (!LOGGED_API_ONCE) {
    console.info(
      "[chatService] API_URL =", API_URL,
      "| VITE_API_URL =", import.meta?.env?.VITE_API_URL ?? "(unset)"
    );
    LOGGED_API_ONCE = true;
  } */

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
