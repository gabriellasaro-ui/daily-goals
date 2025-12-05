import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export const ProgressBar = ({ completed, total }: ProgressBarProps) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">
          Progresso do Dia
        </span>
        <span className="text-sm font-bold text-primary">
          {completed} / {total}
        </span>
      </div>
      <Progress
        value={percentage}
        className="h-3 bg-secondary"
      />
      {percentage === 100 && total > 0 && (
        <p className="text-sm text-success font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
          🎉 Parabéns! Todas as missões concluídas!
        </p>
      )}
    </div>
  );
};
