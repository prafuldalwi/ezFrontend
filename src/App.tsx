import React from "react";
import "./App.css";
import { TreeView } from "./components/TreeView";
import { KanbanBoard } from "./components/Kanban";

function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Frontend Practical</h1>

      <section style={{ marginBottom: 40 }}>
        <h2>Tree View Component</h2>
        <TreeView />
      </section>

      <section>
        <h2>Kanban Board</h2>
        <KanbanBoard />
      </section>
    </div>
  );
}

export default App;
