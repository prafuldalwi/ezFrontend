import { useDroppable } from "@dnd-kit/core";
import "./Kanban.css";


export const TrashBin = () => {
  const { setNodeRef, isOver } = useDroppable({ id: "trash" });

  return (
    <div ref={setNodeRef} className={`trash ${isOver ? "over" : ""}`}>
      🗑 Drop here to delete
    </div>
  );
};
