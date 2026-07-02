import { NextRequest, NextResponse } from "next/server";

const JOURNAL_SYSTEM_PROMPT = `You are Veda Guru, a deeply wise Ayurvedic AI health analyst.

A user has just submitted their daily health journal entry. Analyze it through an Ayurvedic lens and provide structured, personalized insights.

Your response MUST follow this exact format (use these exact section headers):

**🔍 Today's Health Analysis**
[2-3 sentences analyzing their overall health state from today's entry]

**⚡ Dosha Pattern Detected**
[Identify which Dosha imbalance (Vata/Pitta/Kapha) is reflected in their mood, energy, and symptoms. Be specific.]

**🌿 Ayurvedic Recommendations for Tonight**
[3-4 bullet points with specific actionable advice — herbs, foods, routine]

**🧘 One Practice for Right Now**
[One immediate, simple thing they can do in the next 10 minutes]

**📈 Pattern Insight**
[Identify any pattern based on what they described — connect cause and effect in an Ayurvedic way]

Keep the tone warm, insightful, and empowering. Be specific to what THEY wrote, not generic.`;

function generateJournalInsight(mood: string, energy: number, symptoms: string, note: string): string {
  const lowEnergy = energy <= 4;
  const midEnergy = energy >= 5 && energy <= 7;
  const highEnergy = energy >= 8;

  const moodLow = mood === "Low";
  const moodOkay = mood === "Okay";
  const moodGreat = mood === "Great";

  const hasSymptoms = symptoms.trim().length > 0;
  const hasNote = note.trim().length > 0;

  // Build Dosha analysis
  let dosha = "Vata";
  let doshaDesc = "dryness, irregularity, and anxiety";
  if (moodLow || (hasSymptoms && /inflam|acne|anger|heat|burn|acid|heartburn|pitta/i.test(symptoms))) {
    dosha = "Pitta"; doshaDesc = "excess heat, inflammation, and irritability";
  } else if (!lowEnergy && /heavy|congest|weight|mucus|slow|kapha/i.test(symptoms + note)) {
    dosha = "Kapha"; doshaDesc = "heaviness, congestion, and lethargy";
  }

  const recommendations: Record<string, string[]> = {
    "Vata": [
      "Take **500mg Ashwagandha** with warm milk before bed to calm Vata's overactive nervous system",
      "Eat a warm, grounding dinner — khichdi, sweet potato soup, or oatmeal with ghee",
      "Apply **warm sesame oil** to your feet before sleeping (Pada Abhyanga) — deeply grounding for Vata",
      "Avoid screens 1 hour before bed; play soft instrumental music instead",
    ],
    "Pitta": [
      "Drink **coconut water** or pomegranate juice to cool Pitta's fire",
      "Take **Brahmi** (300mg) tonight — it specifically cools an overactive Pitta mind",
      "Apply **Sandalwood paste** or aloe vera gel on your forehead if you feel hot",
      "Avoid spicy, fermented, or acidic foods for dinner — choose cooling foods like cucumber raita",
    ],
    "Kapha": [
      "Drink warm **ginger + honey + lemon water** right now to kindle sluggish Agni",
      "Take a **15-minute brisk walk** after dinner — Kapha requires movement to shift energy",
      "Add **black pepper and turmeric** to your next meal to stimulate metabolism",
      "Do **Kapalbhati Pranayama** for 5 minutes before bed to clear stagnant Kapha",
    ],
  };

  const practices: Record<string, string> = {
    "Vata": "Sit comfortably, close your eyes, and practice **Anulom Vilom** (Alternate Nostril Breathing) for 5 minutes. Inhale left, exhale right. This instantly calms an agitated Vata nervous system.",
    "Pitta": "Fill a bowl with cool water, add 2 drops of rose water. Splash your face 10 times slowly. Then place cool palms over closed eyes for 1 minute. This extinguishes excess Pitta heat immediately.",
    "Kapha": "Stand up, put on your favorite energetic music, and do 20 jumping jacks or a short dance. Physical movement is the fastest Kapha remedy — you'll feel the stagnant energy shift within minutes.",
  };

  const energyContext = lowEnergy
    ? "Your low energy today signals depleted Ojas (vital life essence)."
    : midEnergy
    ? "Your moderate energy suggests your Agni (digestive fire) is functioning, but not optimally."
    : "Your high energy today indicates strong Ojas and balanced Agni — excellent!";

  const symptomContext = hasSymptoms
    ? `The symptoms you noted — **${symptoms}** — are a classic sign of **${dosha}** aggravation, specifically ${doshaDesc}.`
    : "No notable physical symptoms today is a good sign. However, energy and mood patterns still reveal the underlying Dosha state.";

  const patternInsight = hasNote && note.length > 10
    ? `Based on your journal note, I can see a clear connection: ${
        /late|dinner|night|sleep/i.test(note)
          ? "late eating is disrupting your body's natural Pitta cycle (10 PM-2 AM), which regenerates the liver and digestive system. This directly causes next-morning fatigue."
          : /stress|work|busy|meeting/i.test(note)
          ? "mental overload from your day is aggravating Vata in the nervous system. Vata thrives on routine — try to create more predictable daily rhythms."
          : /exercise|yoga|walk|gym/i.test(note)
          ? "your movement practice is actively balancing your doshas. Keep this up — consistency is the cornerstone of Ayurvedic wellness."
          : "your emotional state and physical symptoms are interconnected. In Ayurveda, the mind (Manas) and body (Sharira) are inseparable — improving one always improves the other."
      }`
    : "Consistent daily journaling helps your Digital Twin detect patterns over time. The more you log, the more precise the AI insights become.";

  return `**🔍 Today's Health Analysis**
${energyContext} ${symptomContext} Overall, today's entry paints a picture of mild **${dosha} imbalance** — which is completely addressable with targeted Ayurvedic interventions tonight.

**⚡ Dosha Pattern Detected**
**${dosha} Imbalance** — characterized by ${doshaDesc}. Your mood (${mood}) combined with energy level ${energy}/10 and the symptoms you described are textbook indicators. ${dosha === "Vata" ? "Vata is the king of all diseases — when it's imbalanced, it can disrupt both Pitta and Kapha over time." : dosha === "Pitta" ? "Unchecked Pitta can lead to inflammation, acidity, and burnout if not cooled promptly." : "Kapha stagnation slows metabolism and dampens mental clarity if not regularly stimulated."}

**🌿 Ayurvedic Recommendations for Tonight**
${recommendations[dosha].map(r => `- ${r}`).join("\n")}

**🧘 One Practice for Right Now**
${practices[dosha]}

**📈 Pattern Insight**
${patternInsight} Your VedaAI Digital Twin has logged this entry and will correlate it with future patterns to give you even sharper insights as the days progress.`;
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { mood, energy, symptoms, note } = body;

  if (!mood) {
    return NextResponse.json({ error: "Please select your mood before saving." }, { status: 400 });
  }

  // Build user message for the AI
  const userMessage = `Here is my health journal entry for today:

Mood: ${mood}
Energy Level: ${energy}/10
Symptoms: ${symptoms || "None reported"}
Journal Note: ${note || "No additional notes"}

Please analyze this and give me personalized Ayurvedic insights.`;

  try {
    // Save to real database (Express Backend) in the background
    const saveToDatabase = async (aiAnalysisText: string) => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/journal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood, energy, symptoms, note, aiAnalysis: aiAnalysisText })
        });
      } catch (e) {
        console.error("Failed to save to express backend:", e);
      }
    };

    // 1. Try Gemini
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (geminiKey) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: JOURNAL_SYSTEM_PROMPT,
      });
      const result = await model.generateContent(userMessage);
      const text = result.response.text();
      if (text) {
        saveToDatabase(text);
        return NextResponse.json({ analysis: text, savedAt: new Date().toISOString() });
      }
    }

    // 2. Try OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: JOURNAL_SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          max_tokens: 700,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          saveToDatabase(text);
          return NextResponse.json({ analysis: text, savedAt: new Date().toISOString() });
        }
      }
    }

    // 3. Smart rule-based fallback — always works
    const analysis = generateJournalInsight(mood, energy, symptoms, note);
    saveToDatabase(analysis);
    return NextResponse.json({ analysis, savedAt: new Date().toISOString() });

  } catch (err) {
    console.error("Journal analysis error:", err);
    const analysis = generateJournalInsight(mood, energy, symptoms, note);
    
    // Attempt save even on error
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/journal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, energy, symptoms, note, aiAnalysis: analysis })
      });
    } catch(e) {}

    return NextResponse.json({ analysis, savedAt: new Date().toISOString() });
  }
}
