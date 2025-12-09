import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, AlertTriangle, Minus, ChevronDown } from "lucide-react";

const CATEGORIES = [
  { id: "trabalho", label: "Trabalho", color: "bg-blue-500 hover:bg-blue-600", text: "text-blue-500" },
  { id: "saude", label: "Saúde", color: "bg-green-500 hover:bg-green-600", text: "text-green-500" },
  { id: "estudos", label: "Estudos", color: "bg-purple-500 hover:bg-purple-600", text: "text-purple-500" },
  { id: "outros", label: "Outros", color: "bg-gray-500 hover:bg-gray-600", text: "text-gray-500" },
];

const PRIORITIES = [
  { id: "alta", label: "Alta", color: "bg-red-500 hover:bg-red-600", text: "text-red-500", icon: AlertTriangle },
  { id: "media", label: "Média", color: "bg-yellow-500 hover:bg-yellow-600", text: "text-yellow-500", icon: Minus },
  { id: "baixa", label: "Baixa", color: "bg-emerald-500 hover:bg-emerald-600", text: "text-emerald-500", icon: ChevronDown },
];

interface AddMissionFormProps {
  onAdd: (title: string, category: string, date: string, priority: "alta" | "media" | "baixa") => void;
}

export const AddMissionForm = ({ onAdd }: AddMissionFormProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[3].id);
  const [selectedPriority, setSelectedPriority] = useState<"alta" | "media" | "baixa">("media");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const missionDate = date || new Date().toISOString().split('T')[0];
      onAdd(title.trim(), selectedCategory, missionDate, selectedPriority);
      setTitle("");
      setDate("");
      setSelectedCategory("outros");
      setSelectedPriority("media");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-card p-4 rounded-xl border shadow-sm">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Nova missão..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 h-10"
        />
        <div className="relative">
            <Input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-auto h-10"
            />
        </div>
        <Button type="submit" size="icon" className="h-10 w-10 bg-primary hover:bg-primary/90">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex gap-2 items-center overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              px-3 py-1 rounded-full text-xs font-semibold transition-all border flex-shrink-0
              ${
                selectedCategory === cat.id
                  ? `${cat.color} text-white border-transparent shadow-sm`
                  : `bg-white ${cat.text} border-gray-200 hover:bg-gray-50`
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-xs text-muted-foreground">Prioridade:</span>
        {PRIORITIES.map((pri) => {
          const Icon = pri.icon;
          return (
            <button
              key={pri.id}
              type="button"
              onClick={() => setSelectedPriority(pri.id as "alta" | "media" | "baixa")}
              className={`
                px-3 py-1 rounded-full text-xs font-semibold transition-all border flex-shrink-0 flex items-center gap-1
                ${
                  selectedPriority === pri.id
                    ? `${pri.color} text-white border-transparent shadow-sm`
                    : `bg-white ${pri.text} border-gray-200 hover:bg-gray-50`
                }
              `}
            >
              <Icon className="w-3 h-3" />
              {pri.label}
            </button>
          );
        })}
      </div>
    </form>
  );
};
