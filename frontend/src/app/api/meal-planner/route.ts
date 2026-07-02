import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(req: NextRequest) {
  try {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY;
    
    // Hardcoded fallback data if API key is missing (for local testing without a key)
    if (!key) {
      console.log("No Gemini API key, using mock meal planner fallback");
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({
        day: "AI Custom Day",
        meals: [
          { type: "Breakfast", name: "Spiced Quinoa Porridge", calories: 320, dosha: "VATA", desc: "Warm, grounding, and easy to digest to settle morning Vata.", ingredients: ["1/2 cup quinoa", "1 cup almond milk", "Pinch of cardamom and cinnamon", "1 tsp ghee"], instructions: ["Rinse quinoa.", "Simmer with almond milk and spices for 15 mins.", "Stir in ghee before serving."] },
          { type: "Lunch", name: "Mung Bean Soup with Steamed Greens", calories: 450, dosha: "TRIDOSHA", desc: "The ultimate Ayurvedic healing meal. Perfect for balancing Agni.", ingredients: ["1/2 cup split yellow mung dal", "2 cups water", "1 tsp cumin seeds", "1/2 tsp turmeric", "Handful of spinach"], instructions: ["Wash dal.", "Boil dal with water and turmeric until soft.", "In a separate pan, toast cumin in ghee and pour over dal. Fold in spinach."] },
          { type: "Dinner", name: "Roasted Root Veggies with Ghee", calories: 380, dosha: "PITTA", desc: "Cooling and nourishing, ensuring you don't overwhelm digestion before sleep.", ingredients: ["1 sweet potato, cubed", "1 carrot, chopped", "1 tbsp melted ghee", "Pinch of coriander powder"], instructions: ["Preheat oven to 400°F.", "Toss veggies with ghee and coriander.", "Roast for 25-30 minutes until tender."] }
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert Ayurvedic nutritionist. 
    Generate a 1-day Ayurvedic meal plan (Breakfast, Lunch, Dinner).
    Respond strictly in the following JSON format, with no markdown formatting, no backticks, just the raw JSON:
    {
      "day": "AI Custom Day",
      "meals": [
        { 
          "type": "Breakfast", "name": "...", "calories": 300, "dosha": "VATA", "desc": "...",
          "ingredients": ["item 1", "item 2"],
          "instructions": ["step 1", "step 2"]
        },
        { 
          "type": "Lunch", "name": "...", "calories": 500, "dosha": "TRIDOSHA", "desc": "...",
          "ingredients": ["item 1", "item 2"],
          "instructions": ["step 1", "step 2"]
        },
        { 
          "type": "Dinner", "name": "...", "calories": 400, "dosha": "PITTA", "desc": "...",
          "ingredients": ["item 1", "item 2"],
          "instructions": ["step 1", "step 2"]
        }
      ]
    }
    The "dosha" field MUST be one of: "VATA", "PITTA", "KAPHA", or "TRIDOSHA".`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting from Gemini
    const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const plan = JSON.parse(cleanedJson);

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Meal Planner API Error:", error);
    return NextResponse.json({ error: "Failed to generate meal plan" }, { status: 500 });
  }
}
