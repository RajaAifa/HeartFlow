import dotenv from "dotenv";
dotenv.config();

export const getChatResponse = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
           body: JSON.stringify({
    model: "llama-3.3-70b-versatile", 
    messages: [
        { 
            role: "system", 
            content: "You are a medical assistant for HeartFlow. You must respond strictly in English. Keep your answers professional, empathetic, and concise." 
        },
        { role: "user", content: message }
    ],
    temperature: 0.7,
    max_tokens: 500
}),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Groq API Error:", result);
            return res.status(response.status).json({ 
                success: false, 
                message: "The AI service is currently unavailable. Please try again later." 
            });
        }

        const aiReply = result.choices[0].message.content;

        res.json({ 
            success: true, 
            reply: aiReply.trim() 
        });

    } catch (err) {
        console.error("Backend Chat Error:", err.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error. Check your connection." 
        });
    }
};