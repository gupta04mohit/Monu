import { NextResponse } from "next/server";

export async function GET() {
  try {
    // New Delhi coordinates as default
    const lat = 28.6139;
    const lon = 77.2090;
    
    // Fetch real-world weather data from Open-Meteo API (Free, no key required)
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`);
    
    if (!res.ok) {
      throw new Error("Failed to fetch real world weather data");
    }

    const data = await res.json();
    const { temperature_2m: temp, relative_humidity_2m: humidity, wind_speed_10m: wind } = data.current;

    // Calculate Ayurvedic Dosha Impact based on real-world environment
    let vataImpact = 0;
    let pittaImpact = 0;
    let kaphaImpact = 0;
    let primaryAggravation = "Balanced";
    let recommendation = "Environment is balanced. Maintain normal routine.";

    // High wind increases Vata
    if (wind > 15) {
      vataImpact += 30;
      primaryAggravation = "Vata (High Wind)";
      recommendation = "High winds detected. Protect ears/head, use warm grounding foods.";
    }
    
    // High heat increases Pitta
    if (temp > 30) {
      pittaImpact += 30;
      primaryAggravation = "Pitta (High Heat)";
      recommendation = "High heat detected. Favor cooling drinks like coconut water and avoid spicy foods.";
    }

    // High humidity increases Kapha
    if (humidity > 70) {
      kaphaImpact += 30;
      primaryAggravation = "Kapha (High Humidity)";
      recommendation = "High humidity detected. Keep digestion strong with ginger tea and avoid heavy, cold foods.";
    }

    // Combined extremes
    if (temp < 15 && wind > 10) {
      vataImpact += 40;
      primaryAggravation = "Vata (Cold & Windy)";
      recommendation = "Cold and windy conditions strongly aggravate Vata. Keep warm and use sesame oil massage.";
    }

    return NextResponse.json({
      location: "New Delhi (Local)",
      temperature: temp,
      humidity: humidity,
      windSpeed: wind,
      doshaImpact: {
        vata: vataImpact,
        pitta: pittaImpact,
        kapha: kaphaImpact,
        primary: primaryAggravation,
        recommendation
      }
    });

  } catch (error) {
    console.error("Environment API Error:", error);
    return NextResponse.json({ error: "Failed to fetch real-world environmental data" }, { status: 500 });
  }
}
