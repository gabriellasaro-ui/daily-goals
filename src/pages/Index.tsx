import { useState, useEffect } from "react";
import { SortableMissionCard } from "@/components/SortableMissionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { AddMissionForm } from "@/components/AddMissionForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNotifications } from "@/hooks/useNotifications";
import { Target, Filter, ArrowUpDown, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Mission {
  id: string;
  title: string;
  completed: boolean;
  category?: string;
  date?: string;
  time?: string;
  priority?: "alta" | "media" | "baixa";
}

const PRIORITY_ORDER = { alta: 0, media: 1, baixa: 2 };

const Index = () => {
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem("minhas-missoes");
    if (saved) {
      return JSON.parse(saved);
    }
    return []; 
  });

  const [activeFilter, setActiveFilter] = useState("todas");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted"
  );

  const { requestPermission } = useNotifications(missions);

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      toast.success("Notificações ativadas! Você receberá lembretes.");
    } else {
      toast.error("Permissão para notificações negada.");
    }
  };

  useEffect(() => {
    localStorage.setItem("minhas-missoes", JSON.stringify(missions));
  }, [missions]);

  const filteredMissions = missions.filter((mission) => {
    if (activeFilter === "todas") return true;
    const category = mission.category || "outros";
    return category === activeFilter;
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMissions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSortByPriority = () => {
    setMissions((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const priorityA = PRIORITY_ORDER[a.priority || "media"];
        const priorityB = PRIORITY_ORDER[b.priority || "media"];
        return priorityA - priorityB;
      });
      return sorted;
    });
    toast.success("Missões ordenadas por prioridade!");
  };

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

  const handleEditMission = (id: string, newTitle: string, newCategory: string, newDate: string, newTime: string) => {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === id
          ? { ...mission, title: newTitle, category: newCategory, date: newDate, time: newTime }
          : mission
      )
    );
    toast.success("Missão atualizada!");
  };

  const handleAddMission = (title: string, category: string, date: string, time: string, priority: "alta" | "media" | "baixa") => {
    const newMission: Mission = {
      id: Date.now().toString(),
      title,
      completed: false,
      category,
      date,
      time,
      priority,
    };
    setMissions((prev) => [...prev, newMission]);
    toast.success("Missão criada!");
    setActiveFilter("todas");
  };

  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="min-h-screen bg-background py-8 px-4 relative">
      {/* Theme Toggle & Notifications */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleEnableNotifications}
          className={`rounded-full h-10 w-10 bg-card border-border shadow-sm ${
            notificationsEnabled ? "text-green-500" : "text-muted-foreground"
          }`}
          title={notificationsEnabled ? "Notificações ativadas" : "Ativar notificações"}
        >
          {notificationsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
        </Button>
        <ThemeToggle />
      </div>
      
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

        {/* Filtros e Ordenação */}
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
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSortByPriority}
            className="rounded-full h-8 text-xs px-4 ml-2"
          >
            <ArrowUpDown className="w-3 h-3 mr-1" />
            Ordenar por Prioridade
          </Button>
        </div>

        {/* Lista com Drag and Drop */}
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredMissions.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredMissions.map((mission) => (
                  <SortableMissionCard
                    key={mission.id}
                    mission={mission}
                    onToggle={handleToggleMission}
                    onDelete={handleDeleteMission}
                    onEdit={handleEditMission}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
