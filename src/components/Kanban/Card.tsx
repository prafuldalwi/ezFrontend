import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import type { CardType } from "./KanbanBoard";
import React from "react";

interface Props {
  card: CardType;
  onDelete: () => void;
  onUpdate: (title: string) => void;
}

export const Card = ({ card, onDelete, onUpdate }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isDragging ? "dragging" : ""} ${
        deleting ? "deleting" : ""
      }`}
    >
      {/* Drag handle (important for smooth UX) */}
      <div
        className="drag-handle"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        ⠿
      </div>

      {editing ? (
        <input
          defaultValue={card.title}
          onBlur={(e) => {
            onUpdate(e.target.value);
            setEditing(false);
          }}
          autoFocus
          className="card-input"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          className="card-title"
          onDoubleClick={() => setEditing(true)}
        >
          {card.title}
        </div>
      )}

      <span
        className="delete-icon"
        onClick={(e) => {
          e.stopPropagation();
          setDeleting(true);
          setTimeout(onDelete, 200);
        }}
      >
        🗑
      </span>
    </div>
  );
};
