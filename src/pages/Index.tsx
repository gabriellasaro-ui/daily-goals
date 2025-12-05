import { useState } from "react";
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
}

const Index = () => {
  const [missions, setMissions] = useState<Mission[]>([
    { id: "1", title: "Fazer exercícios pela manhã", completed: false, category: "saude" },
    { id: "2", title: "Ler 30 páginas de um livro", completed: false, category: "estudos" },
    { id: "3", title: "Trabalhar no projeto pessoal", completed: false, category: "trabalho" },
  ]);

  const handleToggleMission = (id: string) => {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === id
          ? { ...mission, completed: !mission.completed }
          : mission
      )
    );
  };

  // Função que remove a missão da lista
  const handleDeleteMission = (id: string) => {
    setMissions((prev) => prev.filter((mission) => mission.id !== id));
    toast.success("Missão removida com sucesso!");
  };

  const handleAddMission = (title: string, category: string) => {
    const newMission: Mission = {
      id: Date.now().toString(),
      title,
      completed: false,
      category,
    };
    setMissions((prev) => [...prev, newMission]);
    toast.success("Nova missão adicionada!");
  };

  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
            <Target className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Missões do Dia
            </h1>
            <p className="text-lg text-muted-foreground">
              Transforme seus objetivos em conquistas diárias
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="animate-in fade-in slide-in-from-top duration-700 delay-100">
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
            <ProgressBar completed={completedCount} total={missions.length} />
          </div>
        </div>

        {/* Add Mission Form */}
        <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <AddMissionForm onAdd={handleAddMission} />
        </div>

        {/* Missions List */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          {missions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhuma missão pendente. Adicione uma para começar!
              </p>
            </div>
          ) : (
            missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onToggle={handleToggleMission}
                onDelete={handleDeleteMission} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
