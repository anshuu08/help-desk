import { useMemo, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const HelpBotWidget = () => {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I am your IT Help Bot. Tell me your issue and I will guide you step by step.",
    },
  ]);

  const payloadHistory = useMemo(
    () =>
      messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    [messages]
  );

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await api.post(
        "/bot/chat",
        { message: text, history: payloadHistory.slice(-10) },
        token
      );

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (_error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I could not process that right now. Please try again, or create a support ticket.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="helpbot-wrap">
      {open ? (
        <section className="helpbot-panel fade-in">
          <header>
            <div>
              <h4>Help Bot</h4>
              <span>Gemini-powered assistant</span>
            </div>
            <button type="button" className="link-btn" onClick={() => setOpen(false)}>
              Close
            </button>
          </header>

          <div className="helpbot-messages">
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={`helpbot-msg ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading ? <div className="helpbot-msg assistant">Typing...</div> : null}
          </div>

          <form onSubmit={sendMessage} className="helpbot-input">
            <input
              placeholder="Describe your issue..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn" type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </section>
      ) : null}

      <button type="button" className="helpbot-fab" onClick={() => setOpen((v) => !v)}>
        Help Bot
      </button>
    </div>
  );
};

export default HelpBotWidget;
