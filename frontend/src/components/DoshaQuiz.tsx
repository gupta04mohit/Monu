"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Activity } from "lucide-react";

type Question = {
  id: number;
  text: string;
  options: { text: string; dosha: "VATA" | "PITTA" | "KAPHA" }[];
};

const questions: Question[] = [
  {
    id: 1,
    text: "How would you describe your body frame?",
    options: [
      { text: "Thin, slender, prominent joints", dosha: "VATA" },
      { text: "Medium, well-proportioned, muscular", dosha: "PITTA" },
      { text: "Broad, sturdy, heavy bone structure", dosha: "KAPHA" },
    ],
  },
  {
    id: 2,
    text: "How is your skin type generally?",
    options: [
      { text: "Dry, rough, thin, prone to cracking", dosha: "VATA" },
      { text: "Warm, oily, prone to acne or freckles", dosha: "PITTA" },
      { text: "Thick, smooth, oily, pale", dosha: "KAPHA" },
    ],
  },
  {
    id: 3,
    text: "How would you describe your metabolism and digestion?",
    options: [
      { text: "Irregular, prone to gas or constipation", dosha: "VATA" },
      { text: "Strong, sharp, prone to acidity or heartburn", dosha: "PITTA" },
      { text: "Slow, steady, prone to sluggishness", dosha: "KAPHA" },
    ],
  },
  {
    id: 4,
    text: "How do you handle stress?",
    options: [
      { text: "Anxiety, worry, fear", dosha: "VATA" },
      { text: "Anger, frustration, irritability", dosha: "PITTA" },
      { text: "Withdrawal, depression, lethargy", dosha: "KAPHA" },
    ],
  },
  {
    id: 5,
    text: "What is your sleep pattern like?",
    options: [
      { text: "Light, easily disturbed, irregular", dosha: "VATA" },
      { text: "Sound, moderate length, easy to wake up", dosha: "PITTA" },
      { text: "Deep, long, hard to wake up", dosha: "KAPHA" },
    ],
  }
];

export default function DoshaQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ VATA: 0, PITTA: 0, KAPHA: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [primaryDosha, setPrimaryDosha] = useState<string | null>(null);

  const handleSelect = (dosha: "VATA" | "PITTA" | "KAPHA") => {
    const newScores = { ...scores, [dosha]: scores[dosha] + 1 };
    setScores(newScores);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate Result
      const highest = Object.keys(newScores).reduce((a, b) => 
        newScores[a as keyof typeof newScores] > newScores[b as keyof typeof newScores] ? a : b
      );
      setPrimaryDosha(highest);
      setIsFinished(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
      <div className="bg-primary/5 p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Know Your Dosha
        </h2>
        {!isFinished && (
          <div className="w-full bg-muted rounded-full h-2.5 mt-4">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${((currentStep) / questions.length) * 100}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="p-8 min-h-[300px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-medium text-foreground mb-6">
                {questions[currentStep].text}
              </h3>
              <div className="space-y-3">
                {questions[currentStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(option.dosha as any)}
                    className="w-full text-left p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group flex items-center justify-between"
                  >
                    <span className="text-foreground group-hover:text-primary transition-colors">
                      {option.text}
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-foreground mb-2">
                Your Primary Dosha is <span className="text-primary">{primaryDosha}</span>
              </h3>
              <p className="text-muted-foreground mb-8">
                Based on your answers, you have a dominant {primaryDosha} constitution. 
              </p>
              
              <div className="flex justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{scores.VATA}</div>
                  <div className="text-sm text-muted-foreground">Vata</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{scores.PITTA}</div>
                  <div className="text-sm text-muted-foreground">Pitta</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{scores.KAPHA}</div>
                  <div className="text-sm text-muted-foreground">Kapha</div>
                </div>
              </div>

              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-all shadow-md">
                View Full Analysis & Recommendations
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
