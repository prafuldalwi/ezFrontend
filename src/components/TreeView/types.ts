export interface TreeNodeData {
  id: string;
  label: string;
  hasChildren?: boolean;
  children?: TreeNodeData[];
}
