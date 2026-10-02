const GROQ_MODEL = process.env.GROQ_VISION_MODEL || "qwen/qwen3.6-27b";

export const groqProxy = async (req, res) => {
  try {
    const { messages, temperature, max_tokens } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature,
        max_tokens: Math.min(max_tokens || 4096, 4096),
      }),
    });

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};