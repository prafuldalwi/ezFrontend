export const getColumnClass = (id: string) => {
    if (id === "todo") return "todo";
    if (id === "progress") return "progress";
    if (id === "done") return "done";
    return "";
  };
  
  export const getCardAccentClass = (id: string) => {
    if (id === "done") return "accent-green";
    return "accent-yellow";
  };
  