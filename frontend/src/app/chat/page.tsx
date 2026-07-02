import ChatInterface from "@/components/ChatInterface";

export const metadata = {
  title: "Veda Guru - AI Ayurvedic Consultant",
  description: "Chat with Veda Guru for personalized Ayurvedic recommendations and symptom analysis.",
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Consult Veda Guru</h1>
        <p className="text-muted-foreground">
          Your personal Ayurvedic orchestrator. Describe your symptoms or ask about healthy lifestyle habits.
        </p>
      </div>
      
      <ChatInterface />
    </div>
  );
}
