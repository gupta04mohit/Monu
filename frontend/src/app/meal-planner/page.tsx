"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Utensils, CheckCircle, Flame, Droplets, Wind, Calendar, Loader2 } from "lucide-react";

const mockMealPlan = [
  {
    day: "Monday",
    meals: [
      { type: "Breakfast", name: "Warm Spiced Oatmeal with Stewed Apples", calories: 350, dosha: "VATA", desc: "Warm, grounding, and easy to digest to settle morning Vata.", ingredients: ["1/2 cup rolled oats", "1 cup water or milk", "1 small apple, diced", "1/2 tsp cinnamon", "1 tsp ghee"], instructions: ["Heat ghee in a pot.", "Sauté apples and cinnamon for 2 mins.", "Add oats and liquid, simmer until cooked."] },
      { type: "Lunch", name: "Kitchari with Ghee and Roasted Root Vegetables", calories: 550, dosha: "TRIDOSHA", desc: "The ultimate Ayurvedic healing meal. Perfect for balancing Agni (digestive fire).", ingredients: ["1/2 cup basmati rice", "1/4 cup yellow mung dal", "1 tbsp ghee", "Spices (cumin, coriander, turmeric)", "Mixed root veg"], instructions: ["Wash rice and dal.", "Toast spices in ghee.", "Add rice, dal, veg and water. Simmer for 25 mins."] },
      { type: "Dinner", name: "Creamy Butternut Squash Soup", calories: 400, dosha: "VATA", desc: "Light yet nourishing, ensuring you don't overwhelm digestion before sleep.", ingredients: ["2 cups diced butternut squash", "1/2 cup coconut milk", "1/2 tsp ginger powder"], instructions: ["Boil squash until tender.", "Blend with coconut milk and ginger.", "Heat gently before serving."] }
    ]
  },
  {
    day: "Tuesday",
    meals: [
      { type: "Breakfast", name: "Almond Milk Rice Porridge with Cardamom", calories: 380, dosha: "PITTA", desc: "Cooling and sweet, perfect for reducing Pitta heat.", ingredients: ["1/2 cup basmati rice", "1.5 cups almond milk", "Pinch of cardamom", "1 tsp maple syrup"], instructions: ["Simmer rice in almond milk.", "Stir in cardamom and cook until creamy.", "Sweeten with maple syrup."] },
      { type: "Lunch", name: "Quinoa Bowl with Steamed Greens and Mung Dal", calories: 520, dosha: "KAPHA", desc: "Light, astringent, and protein-packed to stimulate Kapha.", ingredients: ["1/2 cup quinoa", "1 cup steamed kale", "1/2 cup cooked mung dal", "Squeeze of lemon"], instructions: ["Cook quinoa.", "Top with warm dal and steamed greens.", "Drizzle with lemon juice."] },
      { type: "Dinner", name: "Spiced Lentil Stew (Dal) with Asparagus", calories: 350, dosha: "TRIDOSHA", desc: "High protein, light on the stomach.", ingredients: ["1 cup red lentils", "1 bunch asparagus, chopped", "1 tsp cumin", "1 tbsp ghee"], instructions: ["Boil lentils until soft.", "In a pan, toast cumin in ghee, sauté asparagus.", "Mix together and serve warm."] }
    ]
  }
];

export default function MealPlannerPage() {
  const [selectedDay, setSelectedDay] = useState<any>(mockMealPlan[0]);
  const [generating, setGenerating] = useState(false);
  const [eatenMeals, setEatenMeals] = useState<string[]>([]);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/meal-planner");
      const data = await res.json();
      if (res.ok) {
        setSelectedDay(data);
        setEatenMeals([]); // Reset eaten meals for new plan
      }
    } catch (error) {
      console.error("Failed to generate AI meal plan", error);
    } finally {
      setGenerating(false);
    }
  };

  const toggleEaten = (mealName: string) => {
    if (eatenMeals.includes(mealName)) {
      setEatenMeals(eatenMeals.filter(m => m !== mealName));
    } else {
      setEatenMeals([...eatenMeals, mealName]);
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Smart Ayurvedic Meal Planner</h1>
          <p className="text-xl text-muted-foreground">
            AI-generated recipes based on your Dosha, current health score, and allergies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="font-semibold mb-4 text-lg">Your Profile Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Target Dosha Balance</label>
                  <div className="flex items-center gap-2 mt-1 bg-primary/10 px-3 py-2 rounded-lg text-primary text-sm font-medium">
                    <Wind className="w-4 h-4" /> Vata Pacifying
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Calorie Goal</label>
                  <div className="font-medium">2,200 kcal/day</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Dietary Preference</label>
                  <div className="font-medium">Vegetarian</div>
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Utensils className="w-4 h-4" />}
                  {generating ? "Generating AI Plan..." : "Regenerate Plan"}
                </button>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="font-semibold mb-4 text-lg flex items-center gap-2"><Calendar className="w-5 h-5"/> Select Day</h3>
              <div className="space-y-2">
                {mockMealPlan.map((dayPlan) => (
                  <button
                    key={dayPlan.day}
                    onClick={() => setSelectedDay(dayPlan)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                      selectedDay.day === dayPlan.day 
                        ? "bg-secondary text-secondary-foreground" 
                        : "hover:bg-muted"
                    }`}
                  >
                    {dayPlan.day}
                  </button>
                ))}
                {selectedDay.day === "AI Custom Day" && (
                  <button className="w-full text-left px-4 py-2 rounded-lg transition-colors font-medium bg-secondary text-secondary-foreground">
                    AI Custom Day
                  </button>
                )}
                <button className="w-full text-left px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors opacity-50 cursor-not-allowed">
                  Wednesday (Locked)
                </button>
              </div>
            </div>
          </div>

          {/* Main Content / Meal Display */}
          <div className="lg:col-span-3">
            <motion.div
              key={selectedDay.day}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold border-b border-border pb-4">{selectedDay.day}'s Menu</h2>
              
              <div className="space-y-6">
                {selectedDay.meals.map((meal: any, idx: number) => {
                  const isEaten = eatenMeals.includes(meal.name);
                  
                  return (
                    <div key={idx} className={`bg-card rounded-2xl border ${isEaten ? 'border-green-500/50 bg-green-500/5' : 'border-border'} p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}>
                      <div className="absolute top-0 right-0 p-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          meal.dosha === 'VATA' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                          meal.dosha === 'PITTA' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                          meal.dosha === 'KAPHA' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                          'bg-purple-100 text-purple-700 dark:bg-purple-900/30'
                        }`}>
                          {meal.dosha} Balancing
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">{meal.type}</h4>
                      <h3 className={`text-xl font-bold mb-2 pr-24 ${isEaten ? 'text-green-600 dark:text-green-400 line-through' : 'text-foreground'}`}>{meal.name}</h3>
                      <p className="text-muted-foreground mb-4 max-w-2xl">{meal.desc}</p>
                      
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-sm font-medium">
                          <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500"/> {meal.calories} kcal</span>
                          <span 
                            onClick={() => setExpandedRecipe(expandedRecipe === meal.name ? null : meal.name)}
                            className="flex items-center gap-1 text-primary cursor-pointer hover:underline"
                          >
                            {expandedRecipe === meal.name ? "Hide Recipe" : "View Recipe & Instructions"}
                          </span>
                        </div>
                        <button 
                          onClick={() => toggleEaten(meal.name)}
                          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isEaten ? 'text-green-500' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          <CheckCircle className={`w-5 h-5 ${isEaten ? 'fill-green-500/20' : ''}`} /> 
                          {isEaten ? 'Eaten' : 'Mark as Eaten'}
                        </button>
                      </div>
                      
                      {expandedRecipe === meal.name && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-6 pt-6 border-t border-border overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-blue-500" /> Ingredients
                              </h5>
                              <ul className="space-y-2">
                                {(meal.ingredients || []).map((ing: string, i: number) => (
                                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 flex-shrink-0" />
                                    {ing}
                                  </li>
                                ))}
                                {(!meal.ingredients || meal.ingredients.length === 0) && (
                                  <li className="text-sm text-muted-foreground italic">No ingredients provided.</li>
                                )}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-orange-500" /> Instructions
                              </h5>
                              <ol className="space-y-3">
                                {(meal.instructions || []).map((inst: string, i: number) => (
                                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                                    <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                                      {i + 1}
                                    </span>
                                    <span>{inst}</span>
                                  </li>
                                ))}
                                {(!meal.instructions || meal.instructions.length === 0) && (
                                  <li className="text-sm text-muted-foreground italic">No instructions provided.</li>
                                )}
                              </ol>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
