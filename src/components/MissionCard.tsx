import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  mission: {
    id: string;
    title: string;
    completed: boolean;
  };
  onToggle: (id: string) => void;
}

export const MissionCard = ({ mission, onToggle }: MissionCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

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
        "p-4 transition-all duration-300 hover:shadow-lg",
        mission.completed
          ? "bg-success/10 border-success/30"
          : "bg-card hover:border-primary/50",
        isAnimating && "scale-95"
      )}
      style={{
        boxShadow: mission.completed
          ? "0 4px 20px -2px hsl(var(--success) / 0.2)"
          : "var(--shadow-mission)",
      }}
    >
      <div className="flex items-center gap-3">
        <Button
          variant={mission.completed ? "default" : "outline"}
          size="icon"
          onClick={handleToggle}
          className={cn(
            "shrink-0 transition-all duration-300",
            mission.completed
              ? "bg-success hover:bg-success/90 border-success"
              : "hover:bg-primary/10 hover:border-primary"
          )}
        >
          {mission.completed ? (
            <Check className="h-5 w-5" />
          ) : (
            <Target className="h-5 w-5" />
          )}
        </Button>
        <span
          className={cn(
            "flex-1 text-lg transition-all duration-300",
            mission.completed
              ? "line-through text-muted-foreground"
              : "text-foreground font-medium"
          )}
        >
          {mission.title}
        </span>
      </div>
    </Card>
  );
};
