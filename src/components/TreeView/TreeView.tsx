import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TreeNode } from "./TreeNode";
import { TreeNodeData } from "./types";
import { updateNode, removeNode, moveNode } from "./treeUtils";

const mockLazyLoad = (): Promise<TreeNodeData[]> =>
  new Promise((res) =>
    setTimeout(
      () =>
        res([
          { id: crypto.randomUUID(), label: "Lazy Child 1" },
          { id: crypto.randomUUID(), label: "Lazy Child 2" }
        ]),
      700
    )
  );

export const TreeView = () => {
  const [tree, setTree] = useState<TreeNodeData[]>([
    { id: "1", label: "Root", hasChildren: true }
  ]);

  return (
    <DndProvider backend={HTML5Backend}>
      {tree.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          lazyLoad={async (id) => {
            const children = await mockLazyLoad();
            setTree((t) =>
              updateNode(t, id, (n) => ({ ...n, children }))
            );
          }}
          onToggle={() => {}}
          onAdd={(id) =>
            setTree((t) =>
              updateNode(t, id, (n) => ({
                ...n,
                children: [
                  ...(n.children || []),
                  { id: crypto.randomUUID(), label: "New Node" }
                ]
              }))
            )
          }
          onEdit={(id, label) =>
            setTree((t) => updateNode(t, id, (n) => ({ ...n, label })))
          }
          onRemove={(id) => {
            if (window.confirm("Delete this node and all children?"))
              setTree((t) => removeNode(t, id));
          }}
          onMove={(drag, target) =>
            setTree((t) => moveNode(t, drag, target))
          }
        />
      ))}
    </DndProvider>
  );
};
