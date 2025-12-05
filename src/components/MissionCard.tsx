import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BadgeCheck, // Ícone de verificado
  Circle, // Ícone de não feito
  Trash2, // Ícone de lixeira
  Briefcase, 
  Heart, 
  BookOpen, 
  Tag 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Configuração visual das categorias
const CATEGORY_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  trabalho: { label: "Trabalho", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-100" },
  saude: { label: "Saúde", icon: Heart, color: "text-green-500", bg: "bg-green-100" },
  estudos: { label: "Estudos", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-100" },
  outros: { label: "Geral", icon: Tag, color: "text-gray-500", bg: "bg-gray-100" },
};

interface MissionCardProps {
  mission: {
    id: string;
    title: string;
    completed: boolean;
    category?: string; // Agora aceita a categoria (opcional para evitar erros com dados antigos)
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void; // Nova função para deletar
}

export const MissionCard = ({ mission, onToggle, onDelete }: MissionCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Pega a configuração da categoria ou usa "outros" como padrão
  const categoryStyle = CATEGORY_CONFIG[mission.category || "outros"] || CATEGORY_CONFIG["outros"];
  const CategoryIcon = categoryStyle.icon;

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onToggle(mission.id);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Card
      className={cn(
        "group relative p-4 transition-all duration-300 hover:shadow-md border-l-4",
        mission.completed
          ? "bg-gray-50/50 border-l-green-500 border-t-gray-100 border-r-gray-100 border-b-gray-100 opacity-75"
          : `bg-card hover:border-l-primary border-l-gray-300`,
        isAnimating && "scale-[0.98]"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Botão de Concluir / Verificar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          className={cn(
            "shrink-0 h-8 w-8 rounded-full transition-all duration-300",
            mission.completed
              ? "text-green-500 hover:text-green-600 hover:bg-green-100"
              : "text-gray-400 hover:text-primary hover:bg-primary/10"
          )}
        >
          {mission.completed ? (
            <BadgeCheck className="h-8 w-8 fill-green-100" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </Button>

        {/* Conteúdo: Título e Categoria */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <span
            className={cn(
              "text-lg font-medium transition-all duration-300 truncate",
              mission.completed ? "line-through text-gray-400" : "text-gray-800"
            )}
          >
            {mission.title}
          </span>
          
          {/* Badge da Categoria */}
          <div className="flex items-center gap-1.5">
            <span className={cn("flex items-center px-2 py-0.5 rounded-full text-xs font-medium gap-1", categoryStyle.bg, categoryStyle.color)}>
              <CategoryIcon className="w-3 h-3" />
              {categoryStyle.label}
            </span>
          </div>
        </div>

        {/* Botão de Excluir */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(mission.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
          title="Excluir missão"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
};
