import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { TreeNodeData } from "./types";
import "./TreeView.css";

interface Props {
  node: TreeNodeData;
  onToggle: (id: string) => void;
  onAdd: (id: string) => void;
  onEdit: (id: string, label: string) => void;
  onRemove: (id: string) => void;
  onMove: (dragId: string, targetId: string) => void;
  lazyLoad: (id: string) => Promise<void>;
  depth?: number;
}

export const TreeNode = ({
  node,
  onToggle,
  onAdd,
  onEdit,
  onRemove,
  onMove,
  lazyLoad,
  depth = 0
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(node.label);

  const [, dragRef] = useDrag({
    type: "NODE",
    item: { id: node.id }
  });

  const [, dropRef] = useDrop({
    accept: "NODE",
    drop: (item: { id: string }) => {
      if (item.id !== node.id) {
        onMove(item.id, node.id);
      }
    }
  });

  return (
    <div
      className="tree-node"
      style={{ marginLeft: depth * 40 }}
      ref={(el) => dragRef(dropRef(el))}
    >
      {/* connector */}
      {depth > 0 && <div className="tree-connector" />}

      <div className="tree-card">
        {node.hasChildren && (
          <button
            className="toggle-btn"
            onClick={() => {
              onToggle(node.id);
              if (!node.children) lazyLoad(node.id);
            }}
          >
            {node.children ? "−" : "+"}
          </button>
        )}

        <div
          className={`node-avatar ${depth === 0 ? "root" : "child"}`}
        >
          {node.label.charAt(0).toUpperCase()}
        </div>

        {editing ? (
          <input
            className="edit-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={() => {
              onEdit(node.id, label);
              setEditing(false);
            }}
            autoFocus
          />
        ) : (
          <span
            className="node-label"
            onDoubleClick={() => setEditing(true)}
          >
            {node.label}
          </span>
        )}

        <button className="icon-btn" onClick={() => onAdd(node.id)}>
          +
        </button>
        <button className="icon-btn" onClick={() => onRemove(node.id)}>
          🗑
        </button>
      </div>

      {node.children?.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          onToggle={onToggle}
          onAdd={onAdd}
          onEdit={onEdit}
          onRemove={onRemove}
          onMove={onMove}
          lazyLoad={lazyLoad}
          depth={depth + 1}
        />
      ))}
    </div>
  );
};
