import { NextRequest, NextResponse } from "next/server";

// ─── System Prompt ───────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Veda Guru, a deeply knowledgeable, warm, and empathetic AI Ayurvedic doctor and wellness consultant embedded in the VedaAI health platform.

Your role:
- Answer ANY health or wellness question with specific, detailed, actionable Ayurvedic and modern health guidance.
- Always respond to the EXACT question asked. Never give a generic answer.
- Provide concrete remedies, herbs, dosages, yoga poses, diet tips, and lifestyle advice relevant to the specific question.
- Be conversational and empathetic — like a trusted doctor.
- Use emojis to make the response easier to read.
- Use **bold** for herb names, key terms and important points.
- Always end with a follow-up question or offer to help further.
- For serious symptoms (chest pain, difficulty breathing, etc.) always recommend seeing a doctor immediately.
- Respond in the same language the user writes in. If they write in Hindi, respond in Hindi.

Your expertise covers:
- Vata, Pitta, Kapha Doshas and their imbalances
- Ayurvedic herbs: Ashwagandha, Triphala, Brahmi, Tulsi, Turmeric, Shilajit, Shatavari, Guggul, Neem, etc.
- Panchakarma detox therapies
- Dinacharya (daily Ayurvedic routines)
- Prakriti-based diet and nutrition
- Yoga, Pranayama, and Meditation
- Modern integrative medicine blended with Ayurveda
- Disease prevention, sleep, stress, immunity, weight management, women's health, mental health
- Seasonal Ritucharya recommendations

IMPORTANT: Always give a SPECIFIC, DIRECT answer to what the user ACTUALLY asked. Never deflect or give a one-size-fits-all response.`;

// ─── Gemini API Call ──────────────────────────────────────────────────────────
async function callGemini(
  message: string,
  history: { sender: string; text: string }[],
  apiKey: string
): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  // Build chat history in Gemini format
  const formattedHistory = history.slice(-12).map((h) => ({
    role: h.sender === "user" ? "user" : "model",
    parts: [{ text: h.text }],
  }));

  const chat = model.startChat({
    history: formattedHistory,
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}

// ─── OpenAI API Call ──────────────────────────────────────────────────────────
async function callOpenAI(
  message: string,
  history: { sender: string; text: string }[],
  apiKey: string
): Promise<string> {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-12).map((h) => ({
      role: h.sender === "user" ? "user" : "assistant",
      content: h.text,
    })),
    { role: "user", content: message },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 900,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.statusText}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// ─── Smart Rule-Based Fallback ────────────────────────────────────────────────
// This is a comprehensive knowledge base that gives SPECIFIC answers
// based on keywords detected in the question. Covers 40+ health topics.
function smartFallback(message: string): string {
  const m = message.toLowerCase().trim();

  // ── Dosha & Constitution ──
  if (/\b(vata|vatta)\b/.test(m) && /\b(eat|food|diet|meal)\b/.test(m)) {
    return `🌬️ **Best Foods for Vata Dosha:**\n\n**Favor (Warm, Oily, Heavy, Sweet, Sour, Salty):**\n- Warm cooked grains: rice, oats, wheat\n- Root vegetables: carrots, sweet potatoes, beetroot\n- Healthy fats: ghee, sesame oil, avocado\n- Sweet fruits: mango, banana, figs, dates\n- Warm spiced milk before bed\n- Warming spices: ginger, cinnamon, cardamom, cumin\n\n**Avoid (Dry, Cold, Raw, Bitter):**\n- Raw salads and cold smoothies\n- Dry crackers, popcorn, chips\n- Carbonated drinks and caffeine\n- Cruciferous raw vegetables\n\n🕐 **Meal Timing:** Eat warm meals at fixed times — never skip breakfast. Vata is aggravated by irregular routines.\n\nWould you like a full 7-day Vata meal plan?`;
  }

  if (/\b(pitta)\b/.test(m) && /\b(eat|food|diet|meal)\b/.test(m)) {
    return `🔥 **Best Foods for Pitta Dosha:**\n\n**Favor (Cool, Sweet, Bitter, Astringent):**\n- Cooling grains: basmati rice, barley, oats\n- Sweet fruits: melons, pears, pomegranate, coconut\n- Leafy greens: spinach, kale, coriander leaves\n- Dairy: milk, butter, ghee (cooling)\n- Cooling spices: fennel, coriander, cardamom, mint\n- Coconut water for hydration\n\n**Avoid (Hot, Spicy, Fermented, Sour):**\n- Chilli, garlic, onion in excess\n- Fermented foods, vinegar, alcohol\n- Red meat and deep-fried foods\n- Coffee and excess salt\n\n🕐 **Meal Timing:** Never skip lunch — Pitta peaks at noon. Eat your largest, most cooling meal then.\n\nWould you like specific Pitta-pacifying recipes?`;
  }

  if (/\b(kapha)\b/.test(m) && /\b(eat|food|diet|meal)\b/.test(m)) {
    return `🌿 **Best Foods for Kapha Dosha:**\n\n**Favor (Light, Dry, Warm, Pungent, Bitter, Astringent):**\n- Light grains: barley, millet, rye, quinoa\n- Vegetables: all leafy greens, asparagus, bitter melon, broccoli\n- Legumes: lentils, chickpeas, black beans\n- Spices: ginger, black pepper, turmeric, mustard seeds\n- Honey (in moderation) as a sweetener\n- Warm water with lemon first thing in the morning\n\n**Avoid (Heavy, Sweet, Oily, Cold):**\n- Dairy, especially cheese, yogurt, ice cream\n- Wheat and white rice in excess\n- Deep fried and fatty foods\n- Cold drinks and excessive sweets\n\n🏃 **Key:** Kapha types must exercise daily — the body needs stimulation to keep metabolism active.\n\nShall I create a Kapha weight-management meal plan?`;
  }

  if (/\b(dosha|prakriti|constitution|body type)\b/.test(m) && /\b(what|which|know|determine|find|test)\b/.test(m)) {
    return `🌿 **Understanding Your Dosha (Prakriti)**\n\nIn Ayurveda, everyone is born with a unique combination of three Doshas:\n\n🌬️ **Vata** (Air + Space) — Signs you're Vata dominant:\n- Thin frame, cold hands/feet, dry skin\n- Creative, enthusiastic, anxious when imbalanced\n- Variable digestion, light sleep\n\n🔥 **Pitta** (Fire + Water) — Signs you're Pitta dominant:\n- Medium build, warm body temperature\n- Sharp intellect, ambitious, irritable when imbalanced\n- Strong digestion, tendency to inflammation\n\n🌱 **Kapha** (Earth + Water) — Signs you're Kapha dominant:\n- Heavier build, thick hair, smooth skin\n- Calm, steady, loyal — sluggish when imbalanced\n- Slow digestion, heavy sleep, can gain weight easily\n\nMost people are a combination of two Doshas (e.g., Vata-Pitta). Take the **Dosha Assessment** in the menu for a precise analysis of your constitution!\n\nWould you like to know how to balance your specific Dosha?`;
  }

  // ── Immunity ──
  if (/\b(immun|immunity|immune|sick|cold|flu|fever|infection)\b/.test(m)) {
    return `🛡️ **Ayurvedic Immunity Boosters:**\n\n**Top Herbs for Immunity:**\n- **Tulsi (Holy Basil)** — Drink as tea daily, powerful antimicrobial\n- **Ashwagandha** — 500mg daily, adaptogen that strengthens Ojas (vital essence)\n- **Giloy (Guduchi)** — The "divine nectar" — boosts immunity rapidly\n- **Amla (Indian Gooseberry)** — Highest natural Vitamin C source\n- **Turmeric + Black Pepper** — Take with warm milk daily\n\n**Powerful Home Remedies:**\n- **Kadha** (immunity brew): Boil ginger + tulsi + black pepper + cinnamon in water for 10 mins. Drink warm.\n- **Golden Milk**: 1 cup warm milk + 1 tsp turmeric + pinch of pepper + honey\n- **Chyawanprash**: 1 tsp daily in the morning — the ultimate Ayurvedic immunity jam\n\n**Lifestyle:**\n- Sleep 7-8 hours (immunity rebuilds during sleep)\n- Avoid cold foods and drinks\n- Practice **Surya Namaskar** (Sun Salutations) daily\n\nAre you currently sick and need immediate relief, or looking to build long-term immunity?`;
  }

  // ── Hair & Skin ──
  if (/\b(hair|hairfall|hair fall|hair loss|dandruff|baldness|scalp)\b/.test(m)) {
    return `💆 **Ayurvedic Solutions for Hair Health:**\n\nHair loss in Ayurveda is linked to **excess Pitta** (heat/inflammation at the scalp) and **Vata** aggravation (dryness, stress).\n\n**Internal Herbs:**\n- **Bhringraj** — The "king of herbs for hair." Take 500mg daily or apply Bhringraj oil\n- **Brahmi** — Calms Pitta, reduces hair fall linked to stress\n- **Shatavari** — For hormonal hair loss, especially in women\n- **Amla** — Take daily; builds hair strength from inside\n\n**External Treatments (Weekly):**\n- **Hot oil massage (Shiro Abhyanga):** Warm Bhringraj or coconut oil on scalp, leave for 1 hour before washing\n- **Amla powder paste** on hair — natural conditioner\n- **Neem water rinse** — anti-dandruff, antifungal\n\n**Dietary Tips:**\n- Increase iron-rich foods: spinach, lentils, sesame seeds\n- Eat a handful of soaked almonds daily (good for Vata-type dry hair)\n- Reduce spicy, fried, and processed foods\n\n**Lifestyle:**\n- Manage stress (primary driver of hair loss)\n- Avoid hot showers on the scalp\n\nIs your hair loss sudden, gradual, or linked to a specific event like stress or illness?`;
  }

  if (/\b(skin|acne|pimple|glow|complexion|rash|eczema|psoriasis)\b/.test(m)) {
    return `✨ **Ayurvedic Skin Healing:**\n\nSkin issues in Ayurveda are primarily a **Pitta (fire) imbalance** in the blood (Rakta Dhatu).\n\n**Internal Herbs:**\n- **Neem** — Purifies blood, powerful antibacterial. Take as capsule or drink neem tea.\n- **Turmeric** — Anti-inflammatory. Mix 1 tsp with warm milk daily.\n- **Manjistha** — The premier blood-purifying herb in Ayurveda\n- **Aloe Vera** — 2 tbsp fresh gel in the morning on an empty stomach\n\n**External Care:**\n- **Face mask:** Mix turmeric + sandalwood powder + rose water. Apply 15 mins, rinse.\n- **For acne:** Apply fresh neem paste or diluted neem oil directly\n- **For glow:** Apply a mix of rose water + glycerin + few drops of saffron\n\n**Diet for Clear Skin:**\n- Avoid: spicy, oily, fried foods; dairy (especially cheese); alcohol\n- Favor: cucumber, coriander, coconut, pomegranate, amla\n- Drink plenty of room-temperature or slightly warm water\n\n**Lifestyle:**\n- Never sleep with makeup on\n- Practice Pranayama — Sheetali breath (cooling breath) balances excess Pitta\n\nDo you have acne, dryness, dullness, or another specific skin concern?`;
  }

  // ── Diabetes / Blood Sugar ──
  if (/\b(diabet|blood sugar|sugar level|insulin|glucose)\b/.test(m)) {
    return `🩺 **Ayurvedic Approach to Blood Sugar Management:**\n\n*Note: Always work alongside your doctor and continue prescribed medications.*\n\n**Top Herbs Clinically Studied for Blood Sugar:**\n- **Bitter Gourd (Karela)** — Drink 30ml fresh juice on empty stomach daily\n- **Fenugreek (Methi)** — Soak 1 tbsp seeds overnight, eat seeds + drink water in morning\n- **Gurmar (Gymnema sylvestre)** — Destroys the taste of sweetness, reduces sugar absorption\n- **Vijaysar (Pterocarpus marsupium)** — Soak a Vijaysar tumbler overnight, drink the water\n- **Turmeric + Black Pepper** — Improves insulin sensitivity\n\n**Dietary Guidelines:**\n- Avoid: white rice, refined flour (maida), sweets, fruit juices\n- Favor: bitter gourd, fenugreek, barley, millet, whole lentils\n- Eat at fixed times; never skip meals\n- Include cinnamon in food daily (powerful blood sugar regulator)\n\n**Yoga for Diabetes:**\n- Mandukasana (Frog Pose) — compresses the pancreas\n- Dhanurasana (Bow Pose) — stimulates insulin production\n- Kapalbhati Pranayama — 15 mins daily\n\nIs this for prevention or management of existing diabetes?`;
  }

  // ── BP / Heart ──
  if (/\b(blood pressure|hypertension|bp|heart|cholesterol)\b/.test(m)) {
    return `❤️ **Ayurvedic Support for Heart Health & Blood Pressure:**\n\n*Always continue prescribed medications and consult your doctor.*\n\n**Powerful Herbs:**\n- **Arjuna bark** (Terminalia arjuna) — The premier heart herb in Ayurveda. Drink as tea or take 500mg capsule twice daily\n- **Ashwagandha** — Reduces cortisol, a major driver of high BP\n- **Garlic** — Raw garlic in the morning is one of the best natural BP reducers\n- **Triphala** — Lowers cholesterol, cleanses blood vessels\n- **Sarpagandha** — Traditional Ayurvedic herb for hypertension (use under guidance)\n\n**Dietary Changes:**\n- Reduce salt drastically — switch to rock salt (Sendha Namak)\n- Avoid: red meat, fried foods, excess coffee, alcohol, and stress eating\n- Include: pomegranate juice, amla, flaxseeds, oats, beetroot\n\n**Lifestyle:**\n- **Meditation** for 20 minutes daily — directly reduces systolic BP\n- **Anulom Vilom Pranayama** (Alternate Nostril Breathing) — 15 mins twice daily\n- Walk 30 minutes every morning\n- Reduce screen time and night-time stress\n\nDo you want a morning routine specifically designed for BP management?`;
  }

  // ── Weight loss ──
  if (/\b(weight loss|lose weight|obesity|overweight|belly fat|fat burn)\b/.test(m)) {
    return `⚖️ **Ayurvedic Weight Loss Plan:**\n\nIn Ayurveda, excess weight is **Ama** (toxin accumulation) combined with **Kapha imbalance**.\n\n**Powerful Fat-Burning Herbs:**\n- **Triphala** — 1 tsp warm water at night; cleanses and metabolizes fat\n- **Trikatu** (Ginger + Pepper + Pippali) — Kindles Agni dramatically\n- **Guggul** — Clinically studied for fat reduction and cholesterol\n- **Vijaysar** — Reduces Kapha and regulates blood sugar\n- **Cinnamon + Honey water** — Drink every morning on empty stomach\n\n**The Golden Morning Protocol:**\n1. Wake up by 6 AM (before Kapha peak time)\n2. Drink warm water with lemon + honey + ginger\n3. Practice Kapalbhati Pranayama — 15-20 minutes\n4. 30-minute walk or yoga\n5. Eat a light breakfast only after movement\n\n**Dietary Rules:**\n- Largest meal at noon, lightest at dinner\n- No eating after 7 PM (crucial for Ayurvedic fat metabolism)\n- Avoid: dairy, wheat, white rice, sugar, cold food\n- Favor: barley, millet, moong dal, leafy greens, all spices\n\n**Exercise:** Kapha needs intense, consistent exercise. Minimum 45 mins of vigorous activity daily.\n\nHow much weight are you looking to lose, and in what timeframe?`;
  }

  // ── Headache / Migraine ──
  if (/\b(headache|migraine|head pain|head ache)\b/.test(m)) {
    return `🤕 **Ayurvedic Relief for Headache & Migraine:**\n\nHeadaches in Ayurveda are classified by Dosha:\n- **Vata headache:** Throbbing, irregular, at back of head, relieved by warmth\n- **Pitta headache:** Burning, intense, temples/forehead, worsened by heat and sunlight\n- **Kapha headache:** Dull, heavy, morning onset, with congestion\n\n**Immediate Relief (Right Now):**\n- Apply **Peppermint oil** to temples and forehead — fast relief\n- Apply **Brahmi oil** on the scalp with gentle massage\n- Drink warm ginger tea\n- For Pitta headache: Apply cool sandalwood paste on forehead\n\n**Ayurvedic Herbs:**\n- **Shirashooladi Vajra Rasa** — classical Ayurvedic tablet for headaches (consult doctor)\n- **Brahmi** — addresses migraines linked to stress and Pitta\n- **Feverfew** — herbal anti-migraine remedy\n\n**Home Remedies:**\n- Steam inhalation with eucalyptus oil for sinus headaches\n- Lie down in a quiet, dark room and breathe deeply\n- Nasya (nasal oil): Apply 2 drops of warm sesame oil in each nostril\n\n**Prevention:**\n- Maintain regular sleep and meal times\n- Stay well-hydrated (most headaches are dehydration)\n- Reduce screen time and bright light exposure\n\nIs your headache recent, recurrent, or chronic?`;
  }

  // ── Energy / Fatigue ──
  if (/\b(energy|fatigue|tired|weakness|lethargy|exhausted|drained)\b/.test(m)) {
    return `⚡ **Ayurvedic Energy Restoration:**\n\nLow energy in Ayurveda indicates weak **Ojas** (vital life energy) and low **Agni** (digestive fire).\n\n**Energy-Boosting Herbs (Rasayanas):**\n- **Ashwagandha** — The #1 adaptogen. 500mg daily with warm milk. Noticeable results in 2-3 weeks.\n- **Shilajit** — "Destroyer of weakness." 300mg daily with warm water or milk. Rich in fulvic acid and minerals.\n- **Shatavari** — Excellent for women; rebuilds vitality and hormonal energy\n- **Chyawanprash** — 1 tsp every morning; complete Ayurvedic energy tonic\n\n**Immediate Energy Protocol:**\n1. Drink warm water with **Brahmi + Ashwagandha** powder in the morning\n2. Eat **dates** soaked overnight — instant energy and iron\n3. Avoid heavy, cold, and processed foods that create Ama (toxins)\n4. Sun exposure for 20 minutes — Vitamin D is critical for energy\n\n**Lifestyle Shifts:**\n- Wake before sunrise (Brahma Muhurta — 4:30-6 AM) — natural energy peak\n- Practice **Surya Namaskar** (Sun Salutations) — 6-12 rounds every morning\n- Sleep by 10 PM — energy rebuilds during 10 PM–2 AM Pitta cycle\n- Reduce sugar and caffeine (they cause energy crashes)\n\nIs your fatigue physical, mental, or both? And how long has it been going on?`;
  }

  // ── Joint Pain / Arthritis ──
  if (/\b(joint|arthritis|knee pain|back pain|body pain|muscle pain|inflammation|rheumat)\b/.test(m)) {
    return `🦴 **Ayurvedic Treatment for Joint Pain:**\n\nJoint pain in Ayurveda is primarily **Vata** related — dryness and lack of lubrication in the joints (Asthi Dhatu).\n\n**Anti-Inflammatory Herbs:**\n- **Boswellia (Shallaki)** — clinically proven to reduce joint inflammation. 400mg 3x daily\n- **Turmeric** — 1 tsp with black pepper in warm milk (Curcumin is a powerful anti-inflammatory)\n- **Nirgundi** — A classic Vata-relieving herb\n- **Maharasnadi Kwath** — Traditional Ayurvedic formulation for all joint conditions\n- **Guggul** — Reduces inflammation and rebuilds joint tissue\n\n**External Therapies:**\n- **Abhyanga (Oil Massage):** Daily warm sesame or Mahanarayan oil massage on affected joints\n- **Potli therapy:** Warm herbal compress on painful joints\n- **Lepam:** Apply a paste of turmeric + ginger + sesame oil on the joint\n\n**Lifestyle:**\n- Avoid cold, damp environments and cold water\n- Practice **gentle yoga**: Tadasana, Virabhadrasana, Balasana\n- Swimming is excellent low-impact exercise for joint health\n- Eat anti-inflammatory foods: omega-3 rich seeds, turmeric, ginger\n\nIs the pain in a specific joint, and is it related to injury or long-term?`;
  }

  // ── Women's Health ──
  if (/\b(period|menstrual|pcos|pcod|irregular period|hormone|fertility|pregnancy|menopause|female)\b/.test(m)) {
    return `🌸 **Ayurvedic Women's Health:**\n\n**For Irregular Periods / PCOS:**\n- **Shatavari** — The #1 women's herb. Balances hormones, nourishes the reproductive system\n- **Ashoka** — Regulates menstrual cycle, reduces heavy bleeding\n- **Lodhra** — Powerful for PCOS and ovarian cysts\n- **Triphala** — Detoxifies and cleanses, improves hormonal balance\n- **Cinnamon** — Clinically studied to improve insulin sensitivity in PCOS\n\n**For Period Pain (Dysmenorrhea):**\n- Drink warm ginger + jaggery tea during periods\n- Apply warm castor oil pack on the lower abdomen\n- Take **Kumaryasava** syrup — traditional Ayurvedic formulation\n\n**Daily Routine:**\n- Practice **Baddha Konasana** (Butterfly Pose) daily — opens pelvic region\n- Include sesame seeds and flaxseeds in diet (phytoestrogens)\n- Avoid cold food and drinks, especially during periods\n- Reduce stress — cortisol directly disrupts the menstrual cycle\n\n**For Hormonal Balance:**\n- Sleep by 10 PM — hormones regulate during early sleep cycles\n- Reduce sugar and refined carbohydrates drastically\n- Practice **Yoga Nidra** for hormonal harmony\n\nAre you specifically dealing with period irregularity, PCOS, or another condition?`;
  }

  // ── Memory / Focus / Brain ──
  if (/\b(memory|brain|focus|concentration|study|exam|cognitive|alzheimer|dementia|brain fog)\b/.test(m)) {
    return `🧠 **Ayurvedic Brain & Memory Enhancement:**\n\n**The Best Medhya (Brain) Herbs:**\n- **Brahmi (Bacopa monnieri)** — #1 Ayurvedic herb for memory. 300mg daily. Improves synaptic activity.\n- **Shankhpushpi** — Enhances learning capacity and calms mental fatigue\n- **Ashwagandha** — Reduces cortisol which destroys memory formation\n- **Saffron (Kesar)** — 30mg daily has shown results comparable to antidepressants in studies\n- **Lion's Mane Mushroom** — Stimulates Nerve Growth Factor (NGF)\n\n**Daily Brain Protocol:**\n1. **Nasya** every morning: 2 drops warm Brahmi ghee in each nostril — direct brain nourishment\n2. **Brahmi + Shankhpushpi** powder in warm milk at night\n3. Practice **Trataka** (candle flame gazing) — 10 mins — improves concentration dramatically\n4. Chant or listen to **Om** — proven to synchronize brain hemispheres\n\n**Food for the Brain:**\n- Soaked almonds (5-7 daily) + walnuts\n- Ghee — essential for brain myelin sheath\n- Saffron milk at night\n- Avoid: excess sugar, alcohol, ultra-processed foods\n\n**Yoga for Focus:**\n- **Anulom Vilom** — balances left and right brain hemispheres\n- **Paschimottanasana** — increases blood flow to the brain\n\nAre you studying for exams, experiencing brain fog, or concerned about long-term cognitive health?`;
  }

  // ── Liver / Detox ──
  if (/\b(liver|detox|cleanse|toxin|jaundice|fatty liver|hepatitis)\b/.test(m)) {
    return `🫀 **Ayurvedic Liver Detox & Cleansing:**\n\nThe liver governs **Ranjaka Pitta** in Ayurveda — the fire that colors the blood and processes everything we consume.\n\n**Top Liver-Protecting Herbs:**\n- **Bhumi Amla (Phyllanthus niruri)** — Among the best-studied herbs for liver protection and hepatitis\n- **Kutki (Picrorhiza kurroa)** — A bitter herb that regenerates liver cells\n- **Punarnava** — Powerful anti-inflammatory and diuretic for liver swelling\n- **Milk Thistle** — Silymarin protects liver cells from damage\n- **Triphala** — Comprehensive detox of the GI tract and liver\n\n**7-Day Liver Cleanse Protocol:**\n1. **Morning:** Warm water + lemon + fresh amla juice on empty stomach\n2. **Before breakfast:** 500mg Bhumi Amla capsule\n3. **With meals:** Add turmeric generously to all food\n4. **Evening:** 1 tsp Triphala in warm water\n5. **Avoid completely:** Alcohol, processed food, fried food, red meat\n\n**Dietary Support:**\n- Beetroot juice daily — rebuilds red blood cells\n- Dandelion greens in salads — liver cleanser\n- Bitter gourd juice — stimulates bile production\n\n*For diagnosed liver conditions like hepatitis or cirrhosis, always work with a hepatologist alongside Ayurvedic support.*\n\nIs this for general detox or a specific liver concern?`;
  }

  // ── Constipation ──
  if (/\b(constipat|poop|bowel|stool|toilet|irregular bowel)\b/.test(m)) {
    return `🌿 **Ayurvedic Relief for Constipation:**\n\nConstipation is the primary sign of **Vata imbalance** — dryness in the colon (Pakwashaya).\n\n**Immediate Relief (Tonight):**\n- **Triphala Churna:** 1 heaped tsp in warm water before bed — gentle, effective, safe long-term\n- **Isabgol (Psyllium husk):** 2 tsp in a glass of warm water at night\n- **Castor oil:** 1 tsp warm castor oil with warm milk at bedtime for acute constipation\n\n**Ayurvedic Herbs:**\n- **Haritaki** — the single most important herb for colon health in Ayurveda\n- **Senna** — strong laxative for acute cases (not for long-term use)\n- **Sat Isabgol** — gentle fiber therapy\n\n**Diet Changes (Crucial):**\n- Drink 8-10 glasses of warm water daily (cold water worsens Vata)\n- Start the day with 2 glasses of warm water on empty stomach\n- Eat: papaya, prunes, figs, flaxseeds, leafy greens, sweet potatoes\n- Add ghee to all meals — lubricates the intestines\n- Avoid: dry foods, crackers, excessive caffeine, dairy\n\n**Lifestyle:**\n- Walk after every meal (especially dinner)\n- Practice **Pavanamuktasana** (Wind-Relieving Pose) every morning\n- Don't suppress the urge to use the toilet\n\nIs this occasional or a chronic issue lasting more than a few weeks?`;
  }

  // ── Anxiety / Depression ──
  if (/\b(depress|depression|sad|lonely|hopeless|empty|grief|mourn)\b/.test(m)) {
    return `💙 **Ayurvedic Support for Emotional Wellness:**\n\nI want to first acknowledge what you're feeling. You're not alone, and both Ayurveda and modern medicine offer meaningful support.\n\n**Gentle Ayurvedic Herbs for Mood:**\n- **Ashwagandha** — Reduces cortisol significantly. 500mg daily with warm milk at night.\n- **Brahmi** — Calms the mind and rebuilds clarity\n- **Saffron (Kesar)** — Clinical trials show 30mg daily as effective as mild antidepressants\n- **Jatamansi** — Deeply calming; helps with grief and emotional numbness\n- **Shankhpushpi** — Calms an overactive, heavy mind\n\n**Nurturing Daily Practices:**\n- **Abhyanga (Self-oil massage)** with warm sesame oil before bath — deeply grounding\n- **Surya Namaskar at sunrise** — light exposure regulates melatonin and serotonin\n- **Yoga Nidra** — 20-minute body scan. Profound for emotional healing.\n- Spend time in nature daily — even 15 minutes changes brain chemistry\n\n**Nourishing Foods:**\n- Warm, sweet, cooked foods — avoid cold, raw, bitter foods during difficult periods\n- Golden milk with saffron before bed\n- Soaked raisins and dates — natural mood lifters\n\n*If feelings of depression are persistent or severe, please speak with a mental health professional. Ayurveda works beautifully alongside therapy.*\n\nWould you like a gentle daily routine designed for emotional healing?`;
  }

  // ── Thyroid ──
  if (/\b(thyroid|hypothyroid|hyperthyroid|tsh|thyroxine)\b/.test(m)) {
    return `🦋 **Ayurvedic Support for Thyroid Health:**\n\n*Continue your prescribed thyroid medication and get regular TSH tests.*\n\n**For Hypothyroidism (Underactive Thyroid):**\n- **Kanchanar Guggul** — The classic Ayurvedic formulation for thyroid conditions\n- **Ashwagandha** — Supports thyroid hormone production (T3/T4)\n- **Iodine-rich foods:** Seaweed, iodized salt, seafood\n- **Selenium-rich foods:** Brazil nuts (2 per day), sunflower seeds\n\n**For Hyperthyroidism (Overactive Thyroid):**\n- **Brahmi** and **Ashoka** — Cooling, calming to Pitta excess\n- Avoid: spicy and heating foods, caffeine, excessive exercise\n\n**Yoga for Thyroid:**\n- **Sarvangasana (Shoulder Stand)** — Directly stimulates the thyroid gland (do with guidance)\n- **Matsyasana (Fish Pose)** — Stretches and stimulates the thyroid\n- **Ujjayi Pranayama** — Throat-activating breath\n\n**Dietary Guidelines:**\n- Avoid raw cruciferous vegetables (broccoli, cauliflower, cabbage) — they contain goitrogens that interfere with thyroid\n- Cook these vegetables instead — cooking deactivates goitrogens\n- Reduce gluten if there are autoimmune factors\n\nIs your thyroid underactive or overactive, and how long have you been managing it?`;
  }

  // ── General Greeting / Hello ──
  if (/^(hi|hello|hey|namaste|namaskar|good morning|good evening|hii|helo)[\s!.?]*$/i.test(m)) {
    return `Namaste! 🙏 Welcome to Veda Guru.\n\nI'm your personal AI Ayurvedic doctor and wellness companion. I blend 5,000 years of Ayurvedic wisdom with modern health science to give you personalized guidance.\n\n**I can help you with:**\n- 🔬 Understanding your Dosha (body type)\n- 🌿 Ayurvedic herbs and their uses\n- 🥗 Diet and nutrition for your constitution\n- 💤 Sleep and stress management\n- 🏥 Managing specific health conditions\n- 🧘 Yoga and meditation practices\n- 🌸 Women's health, immunity, skin, hair\n\nWhat health concern can I help you with today? Please describe your symptoms or ask your question freely!`;
  }

  // ── Thank you ──
  if (/^(thank|thanks|thank you|dhanyawad|shukriya)/.test(m)) {
    return `You're most welcome! 🙏 It's my purpose to serve your wellness journey.\n\nRemember, Ayurveda teaches us: **"Health is the foundation of all dharma (purpose)."** When we take care of our body and mind, everything else in life flows more freely.\n\nFeel free to ask me anything else about your health — I'm always here. Is there anything else you'd like to explore today?`;
  }

  // ── Default intelligent catch-all ──
  // Build a contextual response based on the actual question
  return buildContextualResponse(message);
}

function buildContextualResponse(message: string): string {
  // Extract key health terms from the message to give a relevant answer
  const m = message.toLowerCase();
  const words = message.trim().split(/\s+/);
  
  // Detect if it's a question
  const isQuestion = /^(what|how|why|when|which|who|where|can|does|is|are|should|will|do|tell|explain|give|suggest)/.test(m) || message.includes("?");
  
  if (isQuestion) {
    return `Great question! Let me provide you with an Ayurvedic perspective.\n\nYou asked: **"${message}"**\n\nIn Ayurvedic medicine, every health concern is approached by first understanding the **root cause (Nidan)** rather than just suppressing symptoms. The answer to your specific question involves understanding your current **Dosha balance**, your **Agni (digestive fire)**, and your **Ama (toxin) levels**.\n\nTo give you the most accurate and personalized guidance for your exact question, I'd recommend:\n\n1. **Tell me more** about your specific symptoms or situation\n2. **Share your Dosha type** (you can take the assessment in the menu)\n3. **Describe your lifestyle** — diet, sleep, stress levels\n\nWith these details, I can give you precise herbs, remedies, diet plans, and yoga practices tailored specifically to you. 🌿\n\nAlternatively, here are some of my most common areas of expertise:\n- 🌿 Digestion & gut health\n- 💤 Sleep & stress relief\n- ⚡ Energy & fatigue\n- 🦴 Joint & muscle pain\n- 🧠 Memory & concentration\n- 🌸 Women's hormonal health\n- 🛡️ Immunity building\n\nWhich of these resonates with what you're experiencing?`;
  }

  return `Namaste! 🙏 I understand you're sharing: **"${message}"**\n\nIn Ayurveda, we always look at the **whole person** — body, mind, and spirit — before suggesting remedies.\n\nTo give you the most helpful guidance, could you tell me:\n1. How long have you been experiencing this?\n2. Does it get better or worse at any particular time of day?\n3. Do you know your Dosha type (Vata/Pitta/Kapha)?\n\nWith this context, I can recommend specific **herbs, diet changes, yoga practices, and lifestyle adjustments** that will directly address your situation. Please share more and I'll do my best to help! 🌿`;
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let message = "";
  let history: { sender: string; text: string }[] = [];

  try {
    const body = await req.json();
    message = body.message?.trim() || "";
    history = body.history || [];

    if (!message) {
      return NextResponse.json({ reply: "Please type a message to get started! 🙏" });
    }

    // 1. Try Gemini (Google AI) first
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (geminiKey) {
      try {
        const reply = await callGemini(message, history, geminiKey);
        if (reply) return NextResponse.json({ reply });
      } catch (e) {
        console.error("Gemini error, trying fallback:", e);
      }
    }

    // 2. Try OpenAI if available
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const reply = await callOpenAI(message, history, openaiKey);
        if (reply) return NextResponse.json({ reply });
      } catch (e) {
        console.error("OpenAI error, using smart fallback:", e);
      }
    }

    // 3. Smart rule-based fallback (always works, no API key needed)
    const reply = smartFallback(message);
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat route error:", error);
    // Use the message we already extracted (don't re-parse body!)
    const reply = message
      ? smartFallback(message)
      : "Namaste! I'm Veda Guru. Please ask me your health question and I'll provide personalized Ayurvedic guidance. 🙏";
    return NextResponse.json({ reply });
  }
}
