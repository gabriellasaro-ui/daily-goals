import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  BadgeCheck, 
  Circle, 
  Trash2, 
  Pencil, 
  X, 
  Save, 
  Briefcase, 
  Heart, 
  BookOpen, 
  Tag,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    category?: string;
    date?: string;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void; 
  onEdit: (id: string, newTitle: string, newCategory: string, newDate: string) => void;
}

export const MissionCard = ({ mission, onToggle, onDelete, onEdit }: MissionCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editedTitle, setEditedTitle] = useState(mission.title);
  const [editedCategory, setEditedCategory] = useState(mission.category || "outros");
  const [editedDate, setEditedDate] = useState(mission.date || new Date().toISOString().split('T')[0]);

  const categoryKey = mission.category && CATEGORY_CONFIG[mission.category] ? mission.category : "outros";
  const categoryStyle = CATEGORY_CONFIG[categoryKey];
  const CategoryIcon = categoryStyle.icon;

  const handleToggle = () => {
    if (isEditing) return;
    setIsAnimating(true);
    setTimeout(() => {
      onToggle(mission.id);
      setIsAnimating(false);
    }, 300);
  };

  const handleSave = () => {
    if (editedTitle.trim()) {
      onEdit(mission.id, editedTitle, editedCategory, editedDate);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}`;
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
        {!isEditing && (
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
            {mission.completed ? <BadgeCheck className="h-8 w-8" /> : <Circle className="h-6 w-6" />}
          </Button>
        )}

        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
              <Input 
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="h-9 text-base"
                autoFocus
              />
              <div className="flex gap-2">
                 <Input 
                    type="date" 
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                    className="w-full h-9 text-sm"
                  />
              </div>
              <div className="flex gap-1 flex-wrap">
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setEditedCategory(key)}
                    className={cn(
                      "px-2 py-1 rounded-md text-xs font-semibold border transition-all flex items-center gap-1",
                      editedCategory === key
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <span className={cn(
                  "text-lg font-medium transition-all duration-300 truncate mr-2",
                  mission.completed ? "line-through text-gray-400" : "text-gray-800"
                )}>
                  {mission.title}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("flex items-center px-2 py-0.5 rounded-full text-xs font-medium gap-1", categoryStyle.bg, categoryStyle.color)}>
                  <CategoryIcon className="w-3 h-3" />
                  {categoryStyle.label}
                </span>
                
                {mission.date && (
                  <span className="flex items-center text-xs text-gray-400 font-medium">
                    <CalendarDays className="w-3 h-3 mr-1" />
                    {formatDate(mission.date)}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 self-start">
          {isEditing ? (
            <>
              <Button size="icon" variant="ghost" onClick={handleSave} className="text-green-600 hover:bg-green-100 h-8 w-8"><Save className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)} className="text-gray-400 hover:bg-gray-100 h-8 w-8"><X className="h-4 w-4" /></Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8 text-gray-400 hover:text-blue-500 hover:bg-blue-50"><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(mission.id)} className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
