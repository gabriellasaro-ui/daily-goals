import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Tag } from "lucide-react";

const CATEGORIES = [
  { id: "trabalho", label: "Trabalho", color: "bg-blue-500 hover:bg-blue-600", text: "text-blue-500" },
  { id: "saude", label: "Saúde", color: "bg-green-500 hover:bg-green-600", text: "text-green-500" },
  { id: "estudos", label: "Estudos", color: "bg-purple-500 hover:bg-purple-600", text: "text-purple-500" },
  { id: "outros", label: "Outros", color: "bg-gray-500 hover:bg-gray-600", text: "text-gray-500" },
];

interface AddMissionFormProps {
  onAdd: (title: string, category: string) => void;
}

export const AddMissionForm = ({ onAdd }: AddMissionFormProps) => {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[3].id); // Começa com "Outros"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), selectedCategory);
      setTitle("");
      setSelectedCategory("outros");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Nova missão do dia..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 h-12 text-base border-2 focus-visible:ring-primary"
        />
        <Button
          type="submit"
          size="lg"
          className="h-12 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar
        </Button>
      </div>

      {/* Botões de Categoria */}
      <div className="flex gap-2 items-center overflow-x-auto pb-1">
        <span className="text-sm text-gray-500 flex items-center mr-2">
          <Tag className="w-4 h-4 mr-1" /> Tipo:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              px-3 py-1 rounded-full text-xs font-semibold transition-all border
              ${
                selectedCategory === cat.id
                  ? `${cat.color} text-white border-transparent shadow-md scale-105`
                  : `bg-white ${cat.text} border-gray-200 hover:bg-gray-50`
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </form>
  );
};
