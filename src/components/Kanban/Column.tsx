import { useDroppable } from "@dnd-kit/core";
import { Card } from "./Card";
import type { ColumnType } from "./KanbanBoard";
import React from "react";

interface Props {
  column: ColumnType;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
}

export const Column = ({ column, setColumns }: Props) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  const addCard = () => {
    const title = prompt("Card title");
    if (!title) return;

    setColumns(prev =>
      prev.map(col =>
        col.id === column.id
          ? {
              ...col,
              cards: [...col.cards, { id: crypto.randomUUID(), title }]
            }
          : col
      )
    );
  };

  const deleteCard = (cardId: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === column.id
          ? { ...col, cards: col.cards.filter(c => c.id !== cardId) }
          : col
      )
    );
  };

  return (
    <div ref={setNodeRef} className="kanban-column">
      <div className={`kanban-column-header ${column.id}`}>
        <span>{column.title}</span>
        <span className="count">{column.cards.length}</span>
        <button className="icon-btn" onClick={addCard}>+</button>
      </div>

      <button className="add-card-btn" onClick={addCard}>
        + Add Card
      </button>

      <div className="kanban-cards">
        {column.cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onDelete={() => deleteCard(card.id)}
            onUpdate={(title) => {
              setColumns(prev =>
                prev.map(col =>
                  col.id === column.id
                    ? {
                        ...col,
                        cards: col.cards.map(c =>
                          c.id === card.id ? { ...c, title } : c
                        )
                      }
                    : col
                )
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};
