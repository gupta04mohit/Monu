import DoshaQuiz from "@/components/DoshaQuiz";

export const metadata = {
  title: "Dosha Assessment - VedaAI",
  description: "Discover your Ayurvedic body constitution (Dosha) with our comprehensive AI-driven assessment.",
};

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Discover Your Prakriti</h1>
        <p className="text-xl text-muted-foreground">
          Answer a few questions to help our AI determine your unique mind-body constitution. 
          This forms the foundation of all your personalized health recommendations.
        </p>
      </div>
      
      <DoshaQuiz />
    </div>
  );
}
