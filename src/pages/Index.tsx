import { useState, useEffect } from "react";
import { MissionCard } from "@/components/MissionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { AddMissionForm } from "@/components/AddMissionForm";
import { Target } from "lucide-react";
import { toast } from "sonner"; 

interface Mission {
  id: string;
  title: string;
  completed: boolean;
  category?: string;
  date?: string; // Novo campo de data
}

const Index = () => {
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem("minhas-missoes");
    if (saved) {
      return JSON.parse(saved);
    }
    return []; 
  });

  useEffect(() => {
    localStorage.setItem("minhas-missoes", JSON.stringify(missions));
  }, [missions]);

  const handleToggleMission = (id: string) => {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === id
          ? { ...mission, completed: !mission.completed }
          : mission
      )
    );
  };

  const handleDeleteMission = (id: string) => {
    setMissions((prev) => prev.filter((mission) => mission.id !== id));
    toast.success("Missão removida!");
  };

  const handleEditMission = (id: string, newTitle: string, newCategory: string, newDate: string) => {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === id
          ? { ...mission, title: newTitle, category: newCategory, date: newDate }
          : mission
      )
    );
    toast.success("Missão atualizada!");
  };

  const handleAddMission = (title: string, category: string, date: string) => {
    const newMission: Mission = {
      id: Date.now().toString(),
      title,
      completed: false,
      category,
      date,
    };
    setMissions((prev) => [...prev, newMission]);
    toast.success("Missão criada!");
  };

  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
            <Target className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Missões do Dia
            </h1>
            <p className="text-lg text-muted-foreground">
              Defina suas próprias metas e conquiste o dia!
            </p>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-top duration-700 delay-100">
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
            <ProgressBar completed={completedCount} total={missions.length} />
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <AddMissionForm onAdd={handleAddMission} />
        </div>

        <div className="space-y-3 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          {missions.length === 0 ? (
            <div className="text-center py-12 bg-card/50 rounded-xl border border-dashed border-muted-foreground/25">
              <p className="text-muted-foreground text-lg">
                Sua lista está vazia. <br/>
                <span className="text-sm">Adicione uma nova missão acima para começar! 🚀</span>
              </p>
            </div>
          ) : (
            missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onToggle={handleToggleMission}
                onDelete={handleDeleteMission} 
                onEdit={handleEditMission}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
