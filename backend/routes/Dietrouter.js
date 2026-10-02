import express from "express";
import authUser from "../middleware/authUser.js";

const router = express.Router();


router.post("/diet-plan", authUser, async (req, res) => {
  try {
    const { age, weight, conditions, activityLevel } = req.body;

    if (!age || !weight || !activityLevel) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: age, weight, activityLevel",
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a clinical nutritionist specializing in cardiovascular health. 
You MUST respond with ONLY a valid raw JSON object — no markdown, no backticks, no explanation, no extra text. 
Just the JSON object starting with { and ending with }.`
          },
          {
            role: "user",
            content: `Generate a personalized daily meal plan for:
- Age: ${age} years
- Weight: ${weight} kg
- Activity Level: ${activityLevel}
- Medical Conditions: ${conditions || "None"}

Return ONLY this JSON structure with no extra text:
{
  "calories": "2100 kcal",
  "breakfast": "detailed breakfast with specific foods and gram amounts",
  "morningSnack": "mid-morning snack with specific foods",
  "lunch": "detailed lunch with specific foods and gram amounts",
  "afternoonSnack": "afternoon snack with specific foods",
  "dinner": "detailed dinner with specific foods and gram amounts",
  "hydration": "daily water and fluid intake recommendation",
  "tips": ["personalized tip 1", "personalized tip 2", "personalized tip 3"],
  "avoid": ["food to avoid 1", "food to avoid 2", "food to avoid 3"]
}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Groq API Error:", result);
      return res.status(response.status).json({
        success: false,
        message: "AI service unavailable. Please try again later.",
      });
    }

    let raw = result.choices[0].message.content;
    console.log("🥗 Groq raw response:", raw);

    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");

    const plan = JSON.parse(jsonMatch[0]);

    const safePlan = {
      calories:       plan.calories       || "~2000 kcal",
      breakfast:      plan.breakfast      || "Oatmeal with berries and flaxseeds",
      morningSnack:   plan.morningSnack   || plan.morning_snack   || "Handful of almonds and an apple",
      lunch:          plan.lunch          || "Grilled chicken with steamed vegetables",
      afternoonSnack: plan.afternoonSnack || plan.afternoon_snack || "Greek yogurt with honey",
      dinner:         plan.dinner         || "Baked salmon with quinoa and broccoli",
      hydration:      plan.hydration      || "8–10 glasses of water daily",
      tips:           Array.isArray(plan.tips)  ? plan.tips  : ["Eat at consistent times", "Chew slowly", "Prep meals in advance"],
      avoid:          Array.isArray(plan.avoid) ? plan.avoid : ["Processed foods", "Excess salt", "Sugary drinks"],
    };

    return res.json({ success: true, plan: safePlan });

  } catch (error) {
    console.error("❌ Diet Plan Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate diet plan: " + error.message,
    });
  }
});

export default router;