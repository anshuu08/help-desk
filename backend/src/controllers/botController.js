const { GoogleGenerativeAI } = require("@google/generative-ai");

const fallbackReply = (message) => {
  const text = message.toLowerCase();

  if (text.includes("wifi") || text.includes("wi-fi")) {
    return "Try this: 1) Toggle Wi-Fi off/on, 2) Forget and reconnect to the network, 3) Restart router/laptop, 4) Run Windows network troubleshooter. If still failing, I can help you create a Network ticket.";
  }

  if (text.includes("printer")) {
    return "For printer issues: 1) Check cable/power, 2) Set as default printer, 3) Clear print queue, 4) Reinstall printer driver. If it still fails, please create a Printer ticket with screenshot/error code.";
  }

  if (text.includes("password") || text.includes("login")) {
    return "For login/password issues: 1) Check CAPS/keyboard layout, 2) Use forgot-password flow, 3) Confirm account is not locked. If lockout persists, raise a Login/Password ticket and include your username.";
  }

  if (text.includes("laptop") || text.includes("slow") || text.includes("hang")) {
    return "For slow laptop: 1) Restart device, 2) Check Task Manager for high CPU/RAM apps, 3) Free storage space, 4) Run antivirus quick scan. If performance is still poor, create a Laptop ticket with recent symptoms.";
  }

  return "I can help with Wi-Fi, printer, login/password, laptop performance, software, hardware, and network issues. Share the exact error and what you already tried, and I will suggest next steps.";
};

const getModel = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const client = new GoogleGenerativeAI(key);
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  return client.getGenerativeModel({ model: modelName });
};

const chatWithBot = async (req, res, next) => {
  try {
    const message = `${req.body.message || ""}`.trim();
    const history = Array.isArray(req.body.history) ? req.body.history : [];

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const model = getModel();

    if (!model) {
      return res.status(200).json({
        reply: fallbackReply(message),
        mode: "fallback",
      });
    }

    const systemText = [
      "You are an IT Help Desk assistant for an internal help desk app.",
      "Keep responses short and practical.",
      "Prefer step-by-step troubleshooting.",
      "If issue is unresolved after steps, recommend creating a support ticket with category and priority suggestion.",
      "Do not claim actions were performed unless user confirms.",
      `Current user role: ${req.user.role}.`,
    ].join(" ");

    const formattedHistory = history.slice(-8).map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: `${item.content || ""}` }],
    }));

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemText }] },
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] },
      ],
    });

    const reply = result?.response?.text?.() || fallbackReply(message);

    return res.status(200).json({ reply, mode: "gemini" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  chatWithBot,
};
