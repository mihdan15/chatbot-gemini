import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ApiResponse = {
  success: boolean;
  data?: { reply?: string };
  error?: string;
  timestamp: string;
};

type ChatMsg = { role: "user" | "assistant"; text: string };

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function App() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", text: "Halo! Aku asisten AI. Tanyakan apa saja 😊" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(msg?: string) {
    const content = (msg ?? input).trim();
    if (!content || loading) return;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: content }]);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) {
        const err = data.error || "Gagal memproses pesan.";
        setMessages((prev) => [...prev, { role: "assistant", text: `⚠️ ${err}` }]);
      } else {
        const reply = data.data?.reply || "(tidak ada balasan)";
        setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Terjadi kesalahan jaringan." }]);
    } finally {
      setLoading(false);
    }
  }

  async function resetChat() {
    try {
      await fetch(`${API_BASE}/api/reset`, { method: "POST" });
    } catch {}
    setMessages([{ role: "assistant", text: "Memori direset. Mulai percakapan baru ✨" }]);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="title">🤖 Chatbot</div>
        <div className="actions">
          <button
            className="ghost"
            onClick={resetChat}
            title="Reset percakapan"
          >
            Reset
          </button>
          <a
            className="ghost"
            href="http://localhost:3001/api/health"
            target="_blank"
          >
            Health
          </a>
        </div>
      </header>

      <div className="chat" ref={listRef}>
        {messages.map((m, i) => (
          <div key={i} className={`row ${m.role}`}>
            <div className="bubble">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="row assistant">
            <div className="bubble typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </div>

      <div className="composer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ketik pesan dan tekan Enter..."
        />
        <button
          className="send"
          onClick={() => send()}
          disabled={loading || !input.trim()}
        >
          {loading ? "..." : "Kirim"}
        </button>
      </div>
    </div>
  );
}
