import { useState, useEffect } from "react";
import { MissionCard } from "@/components/MissionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { AddMissionForm } from "@/components/AddMissionForm";
import { Target, Filter } from "lucide-react";
import { Button } from "@/components/ui/button"; // Botão para os filtros
import { toast } from "sonner";

interface Mission {
  id: string;
  title: string;
  completed: boolean;
  category?: string;
  date?: string;
}

const Index = () => {
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem("minhas-missoes");
    if (saved) {
      return JSON.parse(saved);
    }
    return []; 
  });

  // Estado para controlar qual filtro está ativo
  const [activeFilter, setActiveFilter] = useState("todas");

  useEffect(() => {
    localStorage.setItem("minhas-missoes", JSON.stringify(missions));
  }, [missions]);

  // Lógica de filtragem: decide quais missões aparecem na tela
  const filteredMissions = missions.filter((mission) => {
    if (activeFilter === "todas") return true;
    const category = mission.category || "outros";
    return category === activeFilter;
  });

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
    setActiveFilter("todas"); // Volta para "todas" para você ver a missão nova
  };

  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
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

        {/* Barra de Progresso */}
        <div className="animate-in fade-in slide-in-from-top duration-700 delay-100">
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
            <ProgressBar completed={completedCount} total={missions.length} />
          </div>
        </div>

        {/* Formulário */}
        <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <AddMissionForm onAdd={handleAddMission} />
        </div>

        {/* --- FILTROS DE CATEGORIA (NOVO) --- */}
        <div className="flex flex-wrap gap-2 items-center justify-center animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <span className="text-sm text-muted-foreground flex items-center mr-2">
            <Filter className="w-4 h-4 mr-1" /> Filtrar:
          </span>
          {[
            { id: "todas", label: "Todas" },
            { id: "trabalho", label: "Trabalho" },
            { id: "saude", label: "Saúde" },
            { id: "estudos", label: "Estudos" },
            { id: "outros", label: "Outros" },
          ].map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className="rounded-full h-8 text-xs px-4"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Lista Filtrada */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          {missions.length === 0 ? (
            <div className="text-center py-12 bg-card/50 rounded-xl border border-dashed border-muted-foreground/25">
              <p className="text-muted-foreground text-lg">
                Sua lista está vazia. <br/>
                <span className="text-sm">Adicione uma nova missão acima para começar! 🚀</span>
              </p>
            </div>
          ) : filteredMissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhuma missão encontrada nesta categoria.
              </p>
            </div>
          ) : (
            filteredMissions.map((mission) => (
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
