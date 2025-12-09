import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MissionCard, MissionCardProps } from "./MissionCard";
import { GripVertical } from "lucide-react";

interface SortableMissionCardProps extends Omit<MissionCardProps, 'dragHandleProps'> {}

export const SortableMissionCard = (props: SortableMissionCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.mission.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <MissionCard
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};
