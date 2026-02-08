import { TreeNodeData } from "./types";

export const updateNode = (
  nodes: TreeNodeData[],
  id: string,
  updater: (node: TreeNodeData) => TreeNodeData
): TreeNodeData[] =>
  nodes.map((n) =>
    n.id === id
      ? updater(n)
      : n.children
      ? { ...n, children: updateNode(n.children, id, updater) }
      : n
  );

export const removeNode = (
  nodes: TreeNodeData[],
  id: string
): TreeNodeData[] =>
  nodes
    .filter((n) => n.id !== id)
    .map((n) =>
      n.children ? { ...n, children: removeNode(n.children, id) } : n
    );

export const moveNode = (
  nodes: TreeNodeData[],
  dragId: string,
  targetId: string
): TreeNodeData[] => {
  let dragged: TreeNodeData | null = null;

  const remove = (list: TreeNodeData[]): TreeNodeData[] =>
    list.filter((n) => {
      if (n.id === dragId) {
        dragged = n;
        return false;
      }
      if (n.children) n.children = remove(n.children);
      return true;
    });

  const insert = (list: TreeNodeData[]): TreeNodeData[] =>
    list.map((n) =>
      n.id === targetId && dragged
        ? { ...n, children: [...(n.children || []), dragged] }
        : n.children
        ? { ...n, children: insert(n.children) }
        : n
    );

  return insert(remove([...nodes]));
};
