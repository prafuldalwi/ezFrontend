import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { Column } from "./Column";
import "./Kanban.css";

export type CardType = {
  id: string;
  title: string;
};

export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
};

const initialData: ColumnType[] = [
  {
    id: "todo",
    title: "Todo",
    cards: [
      { id: "1", title: "Create initial project plan" },
      { id: "2", title: "Design landing page" },
    ],
  },
  {
    id: "progress",
    title: "In Progress",
    cards: [{ id: "3", title: "Implement authentication" }],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ id: "4", title: "Write API documentation" }],
  },
];

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<ColumnType[]>(initialData);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);

  /* 🔥 Smooth drag sensor */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const onDragStart = ({ active }: DragStartEvent) => {
    for (const col of columns) {
      const card = col.cards.find(c => c.id === active.id);
      if (card) {
        setActiveCard(card);
        break;
      }
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null);

    if (!over || active.id === over.id) return;

    setColumns(prev => {
      const newCols = structuredClone(prev);

      let sourceCol: ColumnType | undefined;
      let targetCol: ColumnType | undefined;

      for (const col of newCols) {
        if (col.cards.some(c => c.id === active.id)) {
          sourceCol = col;
        }
        if (col.cards.some(c => c.id === over.id)) {
          targetCol = col;
        }
      }

      if (!sourceCol || !targetCol) return prev;

      const sourceIndex = sourceCol.cards.findIndex(
        c => c.id === active.id
      );
      const targetIndex = targetCol.cards.findIndex(
        c => c.id === over.id
      );

      if (sourceCol.id === targetCol.id) {
        sourceCol.cards = arrayMove(
          sourceCol.cards,
          sourceIndex,
          targetIndex
        );
      } else {
        const [movedCard] = sourceCol.cards.splice(sourceIndex, 1);
        targetCol.cards.splice(targetIndex + 1, 0, movedCard);
      }

      return newCols;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="kanban-board">
        {columns.map(col => (
          <SortableContext
            key={col.id}
            items={col.cards.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <Column column={col} setColumns={setColumns} />
          </SortableContext>
        ))}
      </div>

      {/* ✨ Smooth floating card */}
      <DragOverlay>
        {activeCard ? (
          <div className="card drag-overlay">
            {activeCard.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
